import { Injectable, Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { DB_ADAPTER, type IDbAdapter, type IRepository } from '@mas/db-contracts';
import { Subject } from '../subject/subject.entity';
import { VideoJob, VideoJobStatus } from '../video-job/video-job.entity';
import { JobVersion, JobVersionStatus } from '../job-version/job-version.entity';
import type { VideoJobData } from '../job-version/video-job-data.types';
import { JobLog, LogLevel, LogStep } from '../job-log/job-log.entity';

const MODEL = 'claude-sonnet-4-6';

const SYSTEM_PROMPT = `You are a professional YouTube video production planner specialising in educational and informative content.
Your sole output must be a single valid JSON object — no markdown fences, no comments, no explanation before or after the JSON.
Every field marked as required in the schema must be present. Nullable fields may be omitted or set to null.
Produce high-quality, engaging, platform-optimised content tailored to the subject and editorial constraints provided.

CRITICAL — visual.prompt rules (used verbatim by an AI text-to-video model — Wan 2.1):
- Each prompt must be a single self-contained cinematic description of exactly what happens in that scene.
- Be extremely specific: describe the subject, action, environment, lighting, camera angle, motion, and mood.
- Use cinematic language: "close-up shot", "wide establishing shot", "slow dolly forward", "golden hour lighting", "shallow depth of field", "handheld camera", etc.
- Include concrete visual details: colours, textures, weather, time of day, people/objects present and what they are doing.
- Never use abstract or metaphorical language — describe only what is literally visible on screen.
- Match the scene's voiceText topic exactly — the video must visually illustrate what is being narrated.
- Minimum 40 words per prompt. Aim for 60–80 words.
- REAL-WORLD ACCURACY IS MANDATORY: always use correct, factual visual details — exact flag colours/designs, correct team kit colours, accurate landmarks, real geography. Never invent or approximate real-world visuals.
  Examples of required accuracy:
  · Morocco flag: solid red background, green pentagram (five-pointed star) centred.
  · Senegal flag: three equal vertical stripes — green, yellow, red — green five-pointed star in the yellow stripe.
  · If any country, team, athlete, or landmark appears, describe their real and accurate visual appearance explicitly in the prompt.
- Bad example: "A scene about football" — too vague, will produce random output.
- Good example: "Slow-motion wide shot of a packed football stadium at night under floodlights, thousands of fans in red and green jerseys cheering, confetti falling from the sky, players celebrating on the pitch, camera slowly panning left across the crowd, dramatic and euphoric atmosphere, cinematic colour grading."`;

@Injectable()
export class ClaudeService {
  private readonly logger = new Logger(ClaudeService.name);
  private readonly anthropic: Anthropic;

  private readonly subjectRepo: IRepository<Subject>;
  private readonly jobRepo: IRepository<VideoJob>;
  private readonly versionRepo: IRepository<JobVersion>;
  private readonly logRepo: IRepository<JobLog>;

  constructor(
    @Inject(DB_ADAPTER) adapter: IDbAdapter,
    private readonly config: ConfigService,
  ) {
    this.anthropic = new Anthropic({
      apiKey: config.getOrThrow<string>('ANTHROPIC_API_KEY'),
    });
    this.subjectRepo = adapter.getRepository(Subject);
    this.jobRepo = adapter.getRepository(VideoJob);
    this.versionRepo = adapter.getRepository(JobVersion);
    this.logRepo = adapter.getRepository(JobLog);
  }

  // ─── Public API ─────────────────────────────────────────────────────────────

  /**
   * Generate a new JobVersion for the given job.
   * Pass `revisionNote` when the user has requested changes on a previous draft.
   */
  async generate(job: VideoJob, subject: Subject, revisionNote?: string): Promise<JobVersion> {
    const versionNumber = (job.versionCount ?? 0) + 1;
    this.logger.log(`Claude: generating v${versionNumber} for job ${job.id} — "${subject.topic}"`);

    // Mark any previous DRAFT versions as superseded
    if (versionNumber > 1) {
      await this.supersedePreviousDrafts(job.id);
    }

    const prompt = this.buildPrompt(job, subject, versionNumber, revisionNote);

    let rawResponse: string;
    try {
      rawResponse = await this.callClaude(prompt);
    } catch (err) {
      await this.writeLog(
        job.id,
        LogLevel.ERROR,
        LogStep.CLAUDE_GENERATE,
        `Claude API error: ${(err as Error).message}`,
      );
      throw err;
    }

    let data: VideoJobData;
    try {
      data = this.extractJson(rawResponse);
    } catch (err) {
      await this.writeLog(
        job.id,
        LogLevel.ERROR,
        LogStep.CLAUDE_GENERATE,
        `JSON parse failed: ${(err as Error).message}`,
        { rawResponse: rawResponse.slice(0, 500) },
      );
      throw new Error(`Claude returned invalid JSON: ${(err as Error).message}`);
    }

    // Save JobVersion
    const version = await this.versionRepo.save({
      jobId: job.id,
      versionNumber,
      status: JobVersionStatus.DRAFT,
      promptSent: prompt,
      data,
      isApproved: false,
    } as JobVersion);

    // Update VideoJob
    await this.jobRepo.save({
      id: job.id,
      versionCount: versionNumber,
      status: VideoJobStatus.AWAITING_REVIEW,
    } as VideoJob);

    await this.writeLog(
      job.id,
      LogLevel.INFO,
      LogStep.CLAUDE_GENERATE,
      `v${versionNumber} generated and saved (jobVersion ${version.id})`,
    );

    this.logger.log(`Claude: v${versionNumber} saved for job ${job.id}`);
    return version;
  }

  // ─── Prompt builder ──────────────────────────────────────────────────────────

  private buildPrompt(
    job: VideoJob,
    subject: Subject,
    versionNumber: number,
    revisionNote?: string,
  ): string {
    const ed = subject.editorialData;
    const targetDuration = subject.targetDuration ?? 300;
    const approxScenes = Math.max(4, Math.round(targetDuration / 20));
    const approxChapters = Math.max(2, Math.round(approxScenes / 3));

    const editorialBlock = ed
      ? `
## Editorial Constraints
${ed.tone ? `- Tone: ${ed.tone}` : ''}
${ed.angle ? `- Angle / Perspective: ${ed.angle}` : ''}
${ed.cta ? `- Call to action: ${ed.cta}` : ''}
${ed.forbiddenWords?.length ? `- Forbidden words/phrases: ${ed.forbiddenWords.join(', ')}` : ''}
${ed.references?.length ? `- Reference sources: ${ed.references.join(', ')}` : ''}
${ed.notes ? `- Additional notes: ${ed.notes}` : ''}`.trim()
      : '';

    const revisionBlock = revisionNote
      ? `
## Revision Request (v${versionNumber})
The previous draft was rejected. Apply the following changes:
${revisionNote}`.trim()
      : '';

    return `## Task
Generate a complete video production plan for the subject below.
Return ONLY a valid JSON object matching the VideoJobData schema. No markdown, no extra text.

## Subject
- Topic: ${subject.topic}
- Target duration: ${targetDuration} seconds (~${Math.round(targetDuration / 60)} min)
- Target platforms: ${(subject.targetPlatforms ?? ['youtube']).join(', ')}
- Generate Shorts: ${subject.generateShorts ? 'yes' : 'no'}
- Voice language: ${subject.voiceLanguage ?? 'en'}
- Job ID: ${job.id}
- Subject ID: ${subject.id}

${editorialBlock}
${revisionBlock}

## VideoJobData JSON Schema

Produce exactly this structure (all non-nullable fields are required):

{
  "metadata": {
    "jobId": "${job.id}",
    "subjectId": "${subject.id}",
    "versionNumber": ${versionNumber},
    "generatedAt": "<ISO 8601 timestamp>",
    "targetDuration": ${targetDuration},
    "voiceLanguage": "${subject.voiceLanguage ?? 'en'}",
    "targetPlatforms": ${JSON.stringify(subject.targetPlatforms ?? ['youtube'])},
    "generateShorts": ${subject.generateShorts ?? false}
  },
  "strategy": {
    "angle": "<unique angle/perspective for this topic>",
    "hook": "<first 5-second hook sentence>",
    "promise": "<what the viewer will learn/gain>",
    "targetAudience": "<description of ideal viewer>",
    "tone": "<tone: e.g. educational, conversational, inspiring>",
    "cta": "<call to action — nullable>"
  },
  "voiceScript": "<full narration script as a single string, ~${Math.round(targetDuration * 2.5)} words>",
  "chapters": [
    /* ${approxChapters} chapters — each: */
    {
      "chapterId": "<unique slug>",
      "order": 1,
      "title": "<chapter title>",
      "startTimeSeconds": 0,
      "durationSeconds": <int>
    }
  ],
  "scenes": [
    /* ${approxScenes} scenes — each: */
    {
      "sceneId": "<unique slug>",
      "chapterId": "<parent chapter id>",
      "order": 1,
      "durationSeconds": <15–30>,
      "purpose": "<intro|hook|explain|demo|recap|cta>",
      "voiceText": "<narration for this scene>",
      "subtitleTracks": { "en": "<english subtitle>", "fr": "<french>", "ar": "<arabic>" },
      "visual": {
        "type": "<animation|screencast|talking-head|b-roll>",
        "prompt": "<REQUIRED — cinematic text-to-video prompt, 60–80 words, describes exactly what is visible: subject, action, environment, lighting, camera angle and motion, mood. Must visually illustrate the voiceText narration. No abstract language — only what is literally on screen.>",
        "style": "<visual style: e.g. cinematic, documentary, photorealistic, dramatic>",
        "cameraMotion": "<pan|zoom|static|dolly|handheld — nullable>",
        "overlayText": "<on-screen text — nullable>"
      },
      "audio": {
        "voiceLanguage": "${subject.voiceLanguage ?? 'en'}",
        "backgroundMusic": "<mood description — nullable>",
        "musicLevel": "<low|medium — nullable>"
      },
      "transition": { "in": "<cut|fade|slide>", "out": "<cut|fade|slide>" },
      "renderStrategy": "<remotion|static>"
    }
  ],
  "totalDuration": ${targetDuration},
  "ttsConfig": {
    "provider": "google",
    "language": "${subject.voiceLanguage ?? 'en'}",
    "voiceId": null,
    "speakingRate": 1.0,
    "pitch": 0
  },
  "musicSuggestions": [
    { "mood": "<mood>", "genre": "<genre>", "tempo": "<bpm range — nullable>", "reference": "<nullable>" }
  ],
  "thumbnailConfig": {
    "prompt": "<detailed image prompt for YouTube thumbnail>",
    "style": "<photorealistic|illustrated|minimal>",
    "overlayText": "<headline text — nullable>",
    "colorPalette": "<e.g. #1a1a2e, #7c3aed — nullable>"
  },
  "youtubeMetadata": {
    "title": "<YouTube title ≤ 100 chars, with hook>",
    "description": "<YouTube description 200–500 chars with timestamps>",
    "tags": ["<tag1>", "<tag2>", "..."],
    "category": "<YouTube category name — nullable>",
    "language": "${subject.voiceLanguage ?? 'en'}"
  },
  "shortsPlan": ${
    subject.generateShorts
      ? `[
    /* 3 shorts — each: */
    {
      "shortIndex": 1,
      "sceneIds": ["<sceneId>"],
      "estimatedDuration": <30–60>,
      "hook": "<shorts hook>",
      "cta": "<nullable>"
    }
  ]`
      : '[]'
  },
  "qualityChecks": [
    { "rule": "<rule name>", "status": "pass|fail|warn", "note": "<nullable>" }
  ],
  "risks": [
    { "type": "<copyright|accuracy|sensitivity|technical>", "description": "<description>", "severity": "low|medium|high" }
  ]
}

Generate the VideoJobData JSON now.`;
  }

  // ─── Claude API call ─────────────────────────────────────────────────────────

  private async callClaude(userPrompt: string): Promise<string> {
    const stream = await this.anthropic.messages.stream({
      model: MODEL,
      max_tokens: 50000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const message = await stream.finalMessage();

    if (message.stop_reason === 'max_tokens') {
      throw new Error(
        'Claude response was truncated (max_tokens reached) — JSON will be incomplete',
      );
    }

    const block = message.content.find((b: { type: string }) => b.type === 'text');
    if (!block || block.type !== 'text') {
      throw new Error('Claude returned no text content');
    }
    return block.text;
  }

  // ─── JSON extraction ─────────────────────────────────────────────────────────

  private extractJson(raw: string): VideoJobData {
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start === -1 || end === -1) {
      throw new Error('No JSON object found in Claude response');
    }
    return JSON.parse(raw.slice(start, end + 1)) as VideoJobData;
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  private async supersedePreviousDrafts(jobId: string): Promise<void> {
    const drafts = await this.versionRepo.filter({
      jobId,
      status: JobVersionStatus.DRAFT,
      isDeleted: false,
    } as never);
    await Promise.all(
      drafts.map((v) =>
        this.versionRepo.save({ id: v.id, status: JobVersionStatus.SUPERSEDED } as JobVersion),
      ),
    );
  }

  private async writeLog(
    jobId: string,
    level: LogLevel,
    step: LogStep,
    message: string,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.logRepo.save({ jobId, level, step, message, metadata } as JobLog);
  }
}
