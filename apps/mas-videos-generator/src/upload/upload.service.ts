import { Injectable, Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import * as fs from 'fs';
import { deleteJobOutput } from '../render/output-cleanup';
import { DB_ADAPTER, type IDbAdapter, type IRepository } from '@mas/db-contracts';
import { EmailService } from '@mas/nest-email';
import { VideoJob, VideoJobStatus } from '../video-job/video-job.entity';
import { JobVersion } from '../job-version/job-version.entity';
import { JobAsset, AssetType } from '../job-asset/job-asset.entity';
import { WebhookEvent } from '../webhook-event/webhook-event.entity';
import { StatusTransition, TransitionTrigger } from '../status-transition/status-transition.entity';
import { JobLog, LogLevel, LogStep } from '../job-log/job-log.entity';
import type { VideoJobData } from '../job-version/video-job-data.types';

const YOUTUBE_CATEGORY_MAP: Record<string, string> = {
  'Science & Technology': '28',
  Education: '27',
  Entertainment: '24',
  'How-to & Style': '26',
  'People & Blogs': '22',
  'Film & Animation': '1',
  Gaming: '20',
  'News & Politics': '25',
};

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  private readonly jobRepo: IRepository<VideoJob>;
  private readonly versionRepo: IRepository<JobVersion>;
  private readonly assetRepo: IRepository<JobAsset>;
  private readonly webhookRepo: IRepository<WebhookEvent>;
  private readonly transitionRepo: IRepository<StatusTransition>;
  private readonly logRepo: IRepository<JobLog>;

  constructor(
    private readonly config: ConfigService,
    private readonly emailService: EmailService,
    @Inject(DB_ADAPTER) adapter: IDbAdapter,
  ) {
    this.jobRepo = adapter.getRepository(VideoJob);
    this.versionRepo = adapter.getRepository(JobVersion);
    this.assetRepo = adapter.getRepository(JobAsset);
    this.webhookRepo = adapter.getRepository(WebhookEvent);
    this.transitionRepo = adapter.getRepository(StatusTransition);
    this.logRepo = adapter.getRepository(JobLog);
  }

  // ─── Public API ─────────────────────────────────────────────────────────────

  async upload(job: VideoJob): Promise<void> {
    this.logger.log(`Upload: starting YouTube upload for job ${job.id}`);
    await this.transition(job, VideoJobStatus.UPLOADING);

    try {
      const youtubeVideoId = await this.runUpload(job);
      await this.transition(job, VideoJobStatus.UPLOADED_PRIVATE);

      await this.jobRepo.save({ id: job.id, uploadedAt: new Date() } as VideoJob);

      // Record as webhook event for traceability
      await this.webhookRepo.save({
        jobId: job.id,
        source: 'youtube',
        eventType: 'video.uploaded',
        payload: { youtubeVideoId, privacyStatus: 'private' },
        processed: true,
      } as unknown as WebhookEvent);

      await this.transition(job, VideoJobStatus.DONE);
      await this.jobRepo.save({ id: job.id, completedAt: new Date() } as VideoJob);

      await this.log(
        job.id,
        LogLevel.INFO,
        LogStep.UPLOAD,
        `Uploaded to YouTube — video ID: ${youtubeVideoId}`,
      );

      this.logger.log(`Upload: job ${job.id} → YouTube video ${youtubeVideoId}`);

      await this.sendUploadDoneEmail(job, youtubeVideoId);
      deleteJobOutput(job.id, this.logger);
    } catch (err) {
      await this.transition(job, VideoJobStatus.FAILED, (err as Error).message);
      await this.jobRepo.save({ id: job.id, errorMessage: (err as Error).message } as VideoJob);
      throw err;
    }
  }

  // ─── Core upload logic ───────────────────────────────────────────────────────

  private async runUpload(job: VideoJob): Promise<string> {
    // Find the rendered video asset
    const assets = await this.assetRepo.filter(
      { jobId: job.id, assetType: AssetType.VIDEO, isDeleted: false } as never,
      { sort: { field: 'createdAt', order: 'desc' }, limit: 1 },
    );
    const videoAsset = assets[0];
    if (!videoAsset?.storagePath) {
      throw new Error(`No rendered video asset found for job ${job.id}`);
    }
    if (!fs.existsSync(videoAsset.storagePath)) {
      throw new Error(`Video file not found at: ${videoAsset.storagePath}`);
    }

    // Find approved version for metadata
    const versions = await this.versionRepo.filter(
      { jobId: job.id, isApproved: true, isDeleted: false } as never,
      { sort: { field: 'versionNumber', order: 'desc' }, limit: 1 },
    );
    const version = versions[0];
    const data = version?.data as VideoJobData | undefined;
    const meta = data?.youtubeMetadata;

    // Build OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      this.config.getOrThrow<string>('GMAIL_CLIENT_ID'),
      this.config.getOrThrow<string>('GMAIL_CLIENT_SECRET'),
    );
    oauth2Client.setCredentials({
      refresh_token: this.config.getOrThrow<string>('YOUTUBE_REFRESH_TOKEN'),
    });

    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

    await this.log(
      job.id,
      LogLevel.INFO,
      LogStep.UPLOAD,
      `Uploading ${videoAsset.storagePath} to YouTube`,
    );

    const categoryId = meta?.category ? (YOUTUBE_CATEGORY_MAP[meta.category] ?? '28') : '28';

    const response = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title: meta?.title ?? `Video ${job.id}`,
          description: meta?.description ?? '',
          tags: meta?.tags ?? [],
          categoryId,
          defaultLanguage: meta?.language ?? 'en',
          defaultAudioLanguage: meta?.language ?? 'en',
        },
        status: {
          privacyStatus: 'private',
          selfDeclaredMadeForKids: false,
        },
      },
      media: {
        mimeType: 'video/mp4',
        body: fs.createReadStream(videoAsset.storagePath),
      },
    });

    const youtubeVideoId = response.data.id;
    if (!youtubeVideoId) throw new Error('YouTube API returned no video ID');

    await this.uploadCaptions(job.id, youtubeVideoId, youtube);

    return youtubeVideoId;
  }

  private async uploadCaptions(
    jobId: string,
    youtubeVideoId: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    youtube: any,
  ): Promise<void> {
    const captionAssets = await this.assetRepo.filter({ jobId, isDeleted: false } as never);

    const srtAssets = captionAssets.filter((a) =>
      [AssetType.SUBTITLE_EN, AssetType.SUBTITLE_FR, AssetType.SUBTITLE_AR].includes(
        a.assetType as AssetType,
      ),
    );

    const LANG_MAP: Record<string, string> = {
      [AssetType.SUBTITLE_EN]: 'en',
      [AssetType.SUBTITLE_FR]: 'fr',
      [AssetType.SUBTITLE_AR]: 'ar',
    };

    for (const asset of srtAssets) {
      const lang = LANG_MAP[asset.assetType];
      if (!lang || !asset.storagePath || !fs.existsSync(asset.storagePath)) continue;

      try {
        await youtube.captions.insert({
          part: ['snippet'],
          requestBody: {
            snippet: {
              videoId: youtubeVideoId,
              language: lang,
              name: lang.toUpperCase(),
              isDraft: false,
            },
          },
          media: {
            mimeType: 'application/octet-stream',
            body: fs.createReadStream(asset.storagePath),
          },
        });
        await this.log(jobId, LogLevel.INFO, LogStep.UPLOAD, `Captions uploaded: ${lang}`);
      } catch (err) {
        // Caption upload failure is non-fatal — log and continue
        await this.log(
          jobId,
          LogLevel.WARN,
          LogStep.UPLOAD,
          `Caption upload failed for ${lang}: ${(err as Error).message}`,
        );
      }
    }
  }

  // ─── Email notification ──────────────────────────────────────────────────────

  private async sendUploadDoneEmail(job: VideoJob, youtubeVideoId: string): Promise<void> {
    const to = this.config.getOrThrow<string>('NOTIFICATION_EMAIL');
    const subject = `[Videos Generator] ✅ Video uploaded — ${youtubeVideoId}`;
    const html = `
<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
<style>
  body{font-family:-apple-system,sans-serif;background:#f4f4f5;margin:0;padding:32px}
  .card{background:#fff;border-radius:12px;max-width:520px;margin:0 auto;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,.08)}
  h2{color:#15803d;margin-top:0}
  .id{font-family:monospace;background:#f3f4f6;padding:4px 10px;border-radius:6px;font-size:.95rem}
  a{color:#7c3aed}
</style></head>
<body><div class="card">
  <h2>🎬 Video Uploaded to YouTube</h2>
  <p>Job <span class="id">${job.id}</span> has been uploaded successfully as <strong>private</strong>.</p>
  <p>YouTube Video ID: <span class="id">${youtubeVideoId}</span></p>
  <p>
    <a href="https://studio.youtube.com/video/${youtubeVideoId}/edit" target="_blank">
      Open in YouTube Studio →
    </a>
  </p>
  <p style="color:#888;font-size:.85rem;margin-top:24px">
    The video is currently <strong>private</strong>. Make it public from YouTube Studio when ready.
  </p>
</div></body></html>`;

    await this.emailService.send({ to, subject, html });
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────

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
