import { Injectable, Inject, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { jobOutputDir, deleteJobOutput } from './output-cleanup';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { DB_ADAPTER, type IDbAdapter, type IRepository } from '@mas/db-contracts';
import { VideoJob, VideoJobStatus } from '../video-job/video-job.entity';
import { JobVersion } from '../job-version/job-version.entity';
import { JobAsset, AssetType, AssetStatus } from '../job-asset/job-asset.entity';
import { StatusTransition, TransitionTrigger } from '../status-transition/status-transition.entity';
import { JobLog, LogLevel, LogStep } from '../job-log/job-log.entity';
import type { VideoJobData } from '../job-version/video-job-data.types';
import { TtsService } from './tts.service';
import { SrtService } from './srt.service';
import { FalVideoService } from './fal-video.service';
import { UploadService } from '../upload/upload.service';
interface RemotionSceneProps {
  sceneId: string;
  durationSeconds: number;
  voiceText: string;
  audioFile: string;
  overlayText?: string;
  bgColorIndex: number;
}

@Injectable()
export class RenderService {
  private readonly logger = new Logger(RenderService.name);

  private readonly jobRepo: IRepository<VideoJob>;
  private readonly versionRepo: IRepository<JobVersion>;
  private readonly assetRepo: IRepository<JobAsset>;
  private readonly transitionRepo: IRepository<StatusTransition>;
  private readonly logRepo: IRepository<JobLog>;

  constructor(
    private readonly tts: TtsService,
    private readonly srt: SrtService,
    private readonly falVideo: FalVideoService,
    private readonly uploadService: UploadService,
    @Inject(DB_ADAPTER) adapter: IDbAdapter,
  ) {
    this.jobRepo = adapter.getRepository(VideoJob);
    this.versionRepo = adapter.getRepository(JobVersion);
    this.assetRepo = adapter.getRepository(JobAsset);
    this.transitionRepo = adapter.getRepository(StatusTransition);
    this.logRepo = adapter.getRepository(JobLog);
  }

  // ─── Public API ─────────────────────────────────────────────────────────────

  async render(job: VideoJob): Promise<void> {
    this.logger.log(`Render: starting for job ${job.id}`);
    await this.transition(job, VideoJobStatus.RENDERING);

    try {
      await this.runRender(job);
      await this.transition(job, VideoJobStatus.RENDERED);
      await this.jobRepo.save({ id: job.id, renderedAt: new Date() } as VideoJob);
      this.logger.log(`Render: completed for job ${job.id}`);

      // Auto-upload to YouTube after successful render
      this.uploadService.upload(job).catch((err: Error) => {
        this.logger.error(`Render: upload failed for job ${job.id} — ${err.message}`);
      });
    } catch (err) {
      await this.transition(job, VideoJobStatus.FAILED, (err as Error).message);
      deleteJobOutput(job.id, this.logger);
      throw err;
    }
  }

  // ─── Pipeline ────────────────────────────────────────────────────────────────

  private async runRender(job: VideoJob): Promise<void> {
    // Fetch approved version
    const versions = await this.versionRepo.filter(
      { jobId: job.id, isApproved: true, isDeleted: false } as never,
      { sort: { field: 'versionNumber', order: 'desc' }, limit: 1 },
    );
    const version = versions[0];
    if (!version) throw new Error(`No approved version found for job ${job.id}`);

    const data = version.data as VideoJobData;
    const outputDir = this.jobOutputDir(job.id);
    fs.mkdirSync(outputDir, { recursive: true });

    // 1 — TTS
    await this.log(job.id, LogLevel.INFO, LogStep.TTS, 'Starting TTS synthesis');
    const audioResults = await this.tts.synthesiseScenes(
      data.scenes,
      outputDir,
      data.metadata.voiceLanguage,
    );

    // Save audio assets
    for (const audio of audioResults) {
      await this.saveAsset(job.id, version.id, AssetType.VOICE_AUDIO, audio.filePath, {
        sceneId: audio.sceneId,
        durationMs: audio.durationMs,
        fileSize: audio.fileSize,
      });
    }
    await this.log(
      job.id,
      LogLevel.INFO,
      LogStep.TTS,
      `${audioResults.length} audio files generated`,
    );

    // Build actual duration map from TTS results — drives Remotion and fal clip length
    const audioDurationMap = new Map(audioResults.map((a) => [a.sceneId, a.durationMs / 1000]));

    // 2 — SRT subtitles (use actual audio durations for accurate timing)
    await this.log(job.id, LogLevel.INFO, LogStep.SUBTITLES, 'Generating subtitles');
    const scenesWithActualDuration = data.scenes.map((s) => ({
      ...s,
      durationSeconds: audioDurationMap.get(s.sceneId) ?? s.durationSeconds,
    }));
    const srtPaths = this.srt.generateAll(scenesWithActualDuration, outputDir);

    await this.saveAsset(job.id, version.id, AssetType.SUBTITLE_EN, srtPaths.en);
    await this.saveAsset(job.id, version.id, AssetType.SUBTITLE_FR, srtPaths.fr);
    await this.saveAsset(job.id, version.id, AssetType.SUBTITLE_AR, srtPaths.ar);
    await this.log(job.id, LogLevel.INFO, LogStep.SUBTITLES, 'SRT files generated (en, fr, ar)');

    // 3 — AI video generation (fal.ai Wan 2.1) — use actual audio durations
    await this.log(
      job.id,
      LogLevel.INFO,
      LogStep.RENDER,
      `Generating AI video clips for ${data.scenes.length} scenes`,
    );
    const sceneVideos = await this.falVideo.generateSceneVideos(
      scenesWithActualDuration,
      outputDir,
      async (index, total) => {
        await this.log(job.id, LogLevel.INFO, LogStep.RENDER, `AI video: scene ${index}/${total}`);
      },
    );
    const sceneVideoMap = new Map(sceneVideos.map((v) => [v.sceneId, v.filePath]));
    await this.log(
      job.id,
      LogLevel.INFO,
      LogStep.RENDER,
      `${sceneVideos.length} AI video clips generated`,
    );

    // 4 — Remotion composition (composites audio + AI video clips)
    await this.log(job.id, LogLevel.INFO, LogStep.RENDER, 'Bundling Remotion composition');
    const videoPath = path.join(outputDir, 'video.mp4');

    const sceneProps: RemotionSceneProps[] = scenesWithActualDuration.map((scene, i) => {
      const absVideoPath = sceneVideoMap.get(scene.sceneId);
      return {
        sceneId: scene.sceneId,
        durationSeconds: scene.durationSeconds, // actual TTS duration
        voiceText: scene.voiceText,
        audioFile: `audio/scene-${scene.sceneId}.mp3`,
        videoFile: absVideoPath ? `scenes/scene-${scene.sceneId}.mp4` : undefined,
        overlayText: scene.visual?.overlayText ?? undefined,
        bgColorIndex: i,
      };
    });

    const entryPoint = path.resolve(__dirname, 'remotion', 'index.tsx');
    const bundled = await bundle({ entryPoint, publicDir: outputDir });

    await this.log(job.id, LogLevel.INFO, LogStep.RENDER, 'Rendering video');
    const composition = await selectComposition({
      serveUrl: bundled,
      id: 'VideoComposition',
      inputProps: { scenes: sceneProps },
    });

    let lastLoggedPct = -1;
    await renderMedia({
      composition,
      serveUrl: bundled,
      codec: 'h264',
      outputLocation: videoPath,
      inputProps: { scenes: sceneProps },
      onProgress: ({ progress }) => {
        const pct = Math.floor(progress * 100);
        const milestone = Math.floor(pct / 10) * 10;
        if (milestone > lastLoggedPct) {
          lastLoggedPct = milestone;
          this.logger.debug(`Render progress: ${milestone}%`);
          this.log(job.id, LogLevel.INFO, LogStep.RENDER, `Render progress: ${milestone}%`).catch(
            () => undefined,
          );
        }
      },
    });

    const stat = fs.statSync(videoPath);
    await this.saveAsset(job.id, version.id, AssetType.VIDEO, videoPath, {
      fileSize: stat.size,
    });

    await this.log(job.id, LogLevel.INFO, LogStep.RENDER, `Video rendered → ${videoPath}`);
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  private jobOutputDir(jobId: string): string {
    return jobOutputDir(jobId);
  }

  private async saveAsset(
    jobId: string,
    versionId: string,
    assetType: AssetType,
    storagePath: string,
    extra?: Record<string, unknown>,
  ): Promise<void> {
    await this.assetRepo.save({
      jobId,
      versionId,
      assetType,
      storagePath,
      status: AssetStatus.READY,
      fileSize: extra?.['fileSize'] as number | undefined,
      durationMs: extra?.['durationMs'] as number | undefined,
      metadata: extra,
    } as JobAsset);
  }

  private async transition(
    job: VideoJob,
    toStatus: VideoJobStatus,
    errorMessage?: string,
  ): Promise<void> {
    await this.jobRepo.save({
      id: job.id,
      status: toStatus,
      ...(errorMessage ? { errorMessage } : {}),
    } as VideoJob);

    await this.transitionRepo.save({
      jobId: job.id,
      fromStatus: job.status,
      toStatus,
      triggeredBy: TransitionTrigger.SYSTEM,
    } as StatusTransition);
  }

  private async log(jobId: string, level: LogLevel, step: LogStep, message: string): Promise<void> {
    await this.logRepo.save({ jobId, level, step, message } as JobLog);
  }
}
