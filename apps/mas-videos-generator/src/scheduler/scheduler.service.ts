import { Injectable, Inject, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { DB_ADAPTER, type IDbAdapter, type IRepository } from '@mas/db-contracts';
import { EmailService } from '@mas/nest-email';
import { Subject, SubjectStatus } from '../subject/subject.entity';
import { VideoJob, VideoJobStatus } from '../video-job/video-job.entity';
import { EmailEvent, EmailDirection, EmailEventType } from '../email-event/email-event.entity';

/** Runs daily at 09:00. Selects the highest-priority pending subject,
 *  creates a VideoJob, and sends a trigger-confirmation email. */
@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  private readonly subjectRepo: IRepository<Subject>;
  private readonly jobRepo: IRepository<VideoJob>;
  private readonly emailEventRepo: IRepository<EmailEvent>;

  constructor(
    @Inject(DB_ADAPTER) adapter: IDbAdapter,
    private readonly emailService: EmailService,
    private readonly config: ConfigService,
  ) {
    this.subjectRepo = adapter.getRepository(Subject);
    this.jobRepo = adapter.getRepository(VideoJob);
    this.emailEventRepo = adapter.getRepository(EmailEvent);
  }

  // ─── Daily trigger ──────────────────────────────────────────────────────────

  /** Cron: every day at 09:00 server time. */
  @Cron('0 21 * * 6', { name: 'weekly-subject-picker' })
  async runDailyPick(): Promise<void> {
    this.logger.log('Scheduler: daily pick started');
    await this.pickAndSchedule();
  }

  // ─── Core logic ─────────────────────────────────────────────────────────────

  /**
   * Exposed for manual trigger (e.g. test route or admin action).
   * Idempotent: does nothing if no eligible subject is found.
   */
  async pickAndSchedule(): Promise<VideoJob | null> {
    // 1. Fetch all pending, active subjects ordered by priority desc
    const candidates = await this.subjectRepo.filter(
      { status: SubjectStatus.PENDING, isActive: true, isDeleted: false } as never,
      { sort: { field: 'priority', order: 'desc' } },
    );

    // Filter: only subjects with no scheduledFor, or scheduledFor <= today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eligible = candidates.filter((s) => {
      if (!s.scheduledFor) return true;
      return new Date(s.scheduledFor) <= today;
    });

    if (eligible.length === 0) {
      this.logger.log('Scheduler: no eligible pending subject found today');
      return null;
    }

    return this.scheduleSubject(eligible[0]);
  }

  /**
   * Manually trigger pipeline for a specific subject (BO action).
   * Throws if the subject is not found, not active, or not in PENDING status.
   */
  async triggerForSubject(subjectId: string): Promise<VideoJob> {
    const subjects = await this.subjectRepo.filter({ id: subjectId, isDeleted: false } as never);
    const subject = subjects[0];

    if (!subject) throw new Error(`Subject ${subjectId} not found`);
    if (!subject.isActive) throw new Error(`Subject "${subject.topic}" is not active`);
    if (subject.status !== SubjectStatus.PENDING) {
      throw new Error(
        `Subject "${subject.topic}" cannot be triggered — current status: ${subject.status}`,
      );
    }

    return this.scheduleSubject(subject);
  }

  // ─── Shared scheduling core ──────────────────────────────────────────────────

  private async scheduleSubject(subject: Subject): Promise<VideoJob> {
    // 1. Create VideoJob
    const job = await this.jobRepo.save({
      subjectId: subject.id,
      status: VideoJobStatus.AWAITING_TRIGGER_CONFIRMATION,
      scheduledDate: new Date(),
      versionCount: 0,
      retryCount: 0,
    } as VideoJob);

    // 2. Mark subject as awaiting confirmation
    await this.subjectRepo.save({
      id: subject.id,
      status: SubjectStatus.AWAITING_TRIGGER_CONFIRMATION,
    } as Subject);

    // 3. Send trigger confirmation email
    const to = this.config.getOrThrow<string>('NOTIFICATION_EMAIL');
    const emailSubject = `[Videos Generator] Confirm today's topic: "${subject.topic}"`;
    const html = this.buildTriggerEmail(subject, job);

    await this.emailService.send({ to, subject: emailSubject, html });

    // 4. Record EmailEvent
    await this.emailEventRepo.save({
      jobId: job.id,
      direction: EmailDirection.SENT,
      emailType: EmailEventType.TRIGGER_CONFIRM,
      toAddress: to,
      subject: emailSubject,
      bodyHtml: html,
      sentAt: new Date(),
      actionTokenUsed: false,
    } as EmailEvent);

    this.logger.log(`Scheduler: trigger email sent — subject "${subject.topic}" (job ${job.id})`);

    return job;
  }

  // ─── Email template ─────────────────────────────────────────────────────────

  private buildTriggerEmail(subject: Subject, job: VideoJob): string {
    const platform = subject.targetPlatforms?.join(', ') ?? 'youtube';
    const duration = subject.targetDuration ? `${subject.targetDuration}s` : 'auto';
    const shorts = subject.generateShorts ? 'Yes' : 'No';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
           background: #f4f4f5; margin: 0; padding: 32px; }
    .card { background: #fff; border-radius: 12px; max-width: 560px;
            margin: 0 auto; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,.08); }
    h2 { margin-top: 0; color: #1e1e2e; }
    .topic { font-size: 1.3rem; font-weight: 700; color: #7c3aed;
             background: #f5f3ff; border-left: 4px solid #7c3aed;
             padding: 12px 16px; border-radius: 6px; margin: 20px 0; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    td { padding: 8px 0; border-bottom: 1px solid #f0f0f0; color: #555; }
    td:first-child { font-weight: 600; color: #333; width: 40%; }
    .reply-box { background: #f0fdf4; border: 1px solid #86efac;
                 border-radius: 8px; padding: 16px; margin: 24px 0; }
    .reply-box p { margin: 4px 0; color: #15803d; font-weight: 500; }
    .footer { font-size: 0.8rem; color: #aaa; margin-top: 24px; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <h2>📹 Daily Video — Trigger Confirmation</h2>
    <p>Today's selected topic is ready for your approval:</p>

    <div class="topic">${this.escHtml(subject.topic)}</div>

    <table>
      <tr><td>Job ID</td><td>${job.id}</td></tr>
      <tr><td>Platform</td><td>${this.escHtml(platform)}</td></tr>
      <tr><td>Duration</td><td>${duration}</td></tr>
      <tr><td>Generate Shorts</td><td>${shorts}</td></tr>
      <tr><td>Voice Language</td><td>${subject.voiceLanguage ?? 'en'}</td></tr>
      <tr><td>Priority</td><td>${subject.priority ?? 0}</td></tr>
    </table>

    <div class="reply-box">
      <p>✅ Reply <strong>APPROVE</strong> to start video generation</p>
      <p>⏭️ Reply <strong>SKIP</strong> to skip today and keep pending</p>
      <p>✏️ Reply <strong>REVISE: &lt;new topic&gt;</strong> to change the topic</p>
    </div>

    <p style="color:#888; font-size:.9rem;">
      This email was sent automatically by the Videos Generator scheduler.
    </p>
    <div class="footer">mas-videos-generator · job ${job.id}</div>
  </div>
</body>
</html>`;
  }

  private escHtml(str: string): string {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
