import { Injectable, Inject, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { DB_ADAPTER, type IDbAdapter, type IRepository } from '@mas/db-contracts';
import { ClaudeService } from '../claude/claude.service';
import { RenderService } from '../render/render.service';
import { UploadService } from '../upload/upload.service';
import { JobLogService } from '../job-log/job-log.service';
import { ReviewService } from '../review/review.service';
import { LogLevel, LogStep } from '../job-log/job-log.entity';
import { VideoJob, VideoJobStatus } from '../video-job/video-job.entity';
import { Subject } from '../subject/subject.entity';

export type RetryStep = 'generate' | 'render' | 'upload';

const STEP_LOG: Record<RetryStep, LogStep> = {
  generate: LogStep.CLAUDE_GENERATE,
  render: LogStep.RENDER,
  upload: LogStep.UPLOAD,
};

@Injectable()
export class PipelineService {
  private readonly logger = new Logger(PipelineService.name);

  private readonly jobRepo: IRepository<VideoJob>;
  private readonly subjectRepo: IRepository<Subject>;

  constructor(
    @Inject(DB_ADAPTER) adapter: IDbAdapter,
    private readonly claudeService: ClaudeService,
    private readonly renderService: RenderService,
    private readonly uploadService: UploadService,
    private readonly jobLogService: JobLogService,
    private readonly reviewService: ReviewService,
  ) {
    this.jobRepo = adapter.getRepository(VideoJob);
    this.subjectRepo = adapter.getRepository(Subject);
  }

  async retryStep(jobId: string, step: RetryStep): Promise<VideoJob> {
    const jobs = await this.jobRepo.filter({ id: jobId, isDeleted: false } as never);
    const job = jobs[0];
    if (!job) throw new NotFoundException(`Job ${jobId} not found`);

    this.logger.log(`Pipeline: manual retry step="${step}" for job ${jobId}`);
    await this.jobLogService.create({
      jobId,
      level: LogLevel.INFO,
      step: LogStep.RETRY,
      message: `Manual retry requested for step: ${step}`,
    });

    const logStep = STEP_LOG[step];

    // Pre-transition to in-progress status so the UI reflects the running state immediately
    const inProgressStatus: Record<RetryStep, VideoJobStatus> = {
      generate: VideoJobStatus.DRAFT_GENERATING,
      render: VideoJobStatus.RENDERING,
      upload: VideoJobStatus.UPLOADING,
    };
    await this.jobRepo.save({
      id: jobId,
      status: inProgressStatus[step],
      errorMessage: undefined,
    } as never);

    if (step === 'generate') {
      const subjects = await this.subjectRepo.filter({ id: job.subjectId } as never);
      const subject = subjects[0];
      if (!subject) throw new NotFoundException(`Subject ${job.subjectId} not found`);
      this.claudeService
        .generate(job, subject)
        .then(() => this.reviewService.sendReviewEmailForJob(jobId))
        .catch(async (err: Error) => {
          this.logger.error(`Pipeline retry generate failed: ${err.message}`);
          await this.jobRepo.save({
            id: jobId,
            status: VideoJobStatus.FAILED,
            errorMessage: err.message,
          } as never);
          await this.jobLogService.create({
            jobId,
            level: LogLevel.ERROR,
            step: logStep,
            message: err.message,
          });
        });
    } else if (step === 'render') {
      this.renderService.render(job).catch(async (err: Error) => {
        this.logger.error(`Pipeline retry render failed: ${err.message}`);
        await this.jobRepo.save({
          id: jobId,
          status: VideoJobStatus.FAILED,
          errorMessage: err.message,
        } as never);
        await this.jobLogService.create({
          jobId,
          level: LogLevel.ERROR,
          step: logStep,
          message: err.message,
        });
      });
    } else if (step === 'upload') {
      this.uploadService.upload(job).catch(async (err: Error) => {
        this.logger.error(`Pipeline retry upload failed: ${err.message}`);
        await this.jobRepo.save({
          id: jobId,
          status: VideoJobStatus.FAILED,
          errorMessage: err.message,
        } as never);
        await this.jobLogService.create({
          jobId,
          level: LogLevel.ERROR,
          step: logStep,
          message: err.message,
        });
      });
    } else {
      throw new BadRequestException(`Unknown step: ${step}`);
    }

    // Return refreshed job after a short tick
    const refreshed = await this.jobRepo.filter({ id: jobId } as never);
    return refreshed[0] ?? job;
  }
}
