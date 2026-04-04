import { Injectable, Inject, Optional, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { DB_ADAPTER, type IDbAdapter, type IRepository } from '@mas/db-contracts';
import {
  EmailService,
  EMAIL_RECEIVER,
  type IEmailReceiver,
  type InboundEmail,
} from '@mas/nest-email';
import { ClaudeService } from '../claude/claude.service';
import { RenderService } from '../render/render.service';
import { Subject, SubjectStatus } from '../subject/subject.entity';
import { VideoJob, VideoJobStatus } from '../video-job/video-job.entity';
import { JobVersion, JobVersionStatus } from '../job-version/job-version.entity';
import type { VideoJobData } from '../job-version/video-job-data.types';
import { EmailEvent, EmailDirection, EmailEventType } from '../email-event/email-event.entity';
import { StatusTransition, TransitionTrigger } from '../status-transition/status-transition.entity';
import { JobLog, LogLevel, LogStep } from '../job-log/job-log.entity';

// ─── Command parser ───────────────────────────────────────────────────────────

type ParsedCommand = { type: 'APPROVE' } | { type: 'SKIP' } | { type: 'REVISE'; note: string };

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseCommand(body: string): ParsedCommand | null {
  const text = body.includes('<') ? stripHtml(body) : body;

  // Collect non-quoted, non-empty lines and join them — handles soft-wrapped
  // replies where e.g. "APPROVE" may arrive split across two lines.
  const candidate = text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith('>'))
    .join(' ')
    .trim();

  if (!candidate) return null;
  const cleaned = candidate.replace(/^[^a-zA-Z]+/, '');
  const upper = cleaned.toUpperCase();

  if (upper === 'APPROVE' || upper.startsWith('APPROVE ')) return { type: 'APPROVE' };
  if (upper === 'SKIP' || upper.startsWith('SKIP ')) return { type: 'SKIP' };

  const reviseMatch = cleaned.match(/^REVISE\s*:\s*(.+)/i);
  if (reviseMatch) {
    const note = reviseMatch[1].trim();
    return note ? { type: 'REVISE', note } : null;
  }

  // Also check if any single line contains the keyword on its own
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith('>'));
  for (const line of lines) {
    // Strip leading non-word characters (*, **, >, _, etc. from email formatting)
    const clean = line.replace(/^[^a-zA-Z]+/, '');
    const u = clean.toUpperCase();
    if (u === 'APPROVE' || u.startsWith('APPROVE ')) return { type: 'APPROVE' };
    if (u === 'SKIP' || u.startsWith('SKIP ')) return { type: 'SKIP' };
    const m = clean.match(/^REVISE\s*:\s*(.+)/i);
    if (m) return { type: 'REVISE', note: m[1].trim() };
  }

  return null;
}

// ─── Service ──────────────────────────────────────────────────────────────────

@Injectable()
export class ReviewService implements OnModuleInit {
  private readonly logger = new Logger(ReviewService.name);
  private lastPollAt!: Date;

  private readonly subjectRepo: IRepository<Subject>;
  private readonly jobRepo: IRepository<VideoJob>;
  private readonly versionRepo: IRepository<JobVersion>;
  private readonly emailEventRepo: IRepository<EmailEvent>;
  private readonly transitionRepo: IRepository<StatusTransition>;
  private readonly logRepo: IRepository<JobLog>;

  constructor(
    @Optional() @Inject(EMAIL_RECEIVER) private readonly receiver: IEmailReceiver | null,
    private readonly claudeService: ClaudeService,
    private readonly renderService: RenderService,
    private readonly emailService: EmailService,
    private readonly config: ConfigService,
    @Inject(DB_ADAPTER) adapter: IDbAdapter,
  ) {
    this.subjectRepo = adapter.getRepository(Subject);
    this.jobRepo = adapter.getRepository(VideoJob);
    this.versionRepo = adapter.getRepository(JobVersion);
    this.emailEventRepo = adapter.getRepository(EmailEvent);
    this.transitionRepo = adapter.getRepository(StatusTransition);
    this.logRepo = adapter.getRepository(JobLog);
  }

  onModuleInit(): void {
    // Ignore emails that arrived before the server started
    this.lastPollAt = new Date();
    this.logger.log('ReviewService: polling active — inbox poll every 5 min');
  }

  // ─── Cron ────────────────────────────────────────────────────────────────────

  @Cron('*/5 * * * *', { name: 'inbox-poll' })
  async pollAndProcess(): Promise<void> {
    if (!this.receiver) return;

    const since = this.lastPollAt;
    this.lastPollAt = new Date();

    let messages: InboundEmail[];
    try {
      messages = await this.receiver.pollNewMessages(since);
    } catch (err) {
      this.logger.error(`ReviewService: poll failed — ${(err as Error).message}`);
      return;
    }

    const notifEmail = this.config.getOrThrow<string>('NOTIFICATION_EMAIL');
    const relevant = messages.filter((m) =>
      m.from.toLowerCase().includes(notifEmail.toLowerCase()),
    );

    for (const msg of relevant) {
      try {
        await this.processMessage(msg);
      } catch (err) {
        this.logger.error(
          `ReviewService: error processing message ${msg.messageId} — ${(err as Error).message}`,
        );
      } finally {
        await this.receiver.markProcessed(msg.messageId);
      }
    }
  }

  // ─── Message routing ─────────────────────────────────────────────────────────

  private async processMessage(msg: InboundEmail): Promise<void> {
    const body = msg.bodyText ?? (msg.bodyHtml ? stripHtml(msg.bodyHtml) : '');
    const command = parseCommand(body);

    if (!command) {
      this.logger.debug(
        `ReviewService: unrecognised reply from ${msg.from} — "${body.slice(0, 60)}"`,
      );
      return;
    }

    // Record inbound email event
    await this.emailEventRepo.save({
      direction: EmailDirection.RECEIVED,
      emailType: EmailEventType.INBOUND_REVISION,
      fromAddress: msg.from,
      subject: msg.subject,
      bodyText: body.slice(0, 2000),
      gmailMessageId: msg.messageId,
      gmailThreadId: msg.threadId,
      receivedAt: msg.receivedAt,
      parsedInstruction: command.type === 'REVISE' ? command.note : command.type,
      actionTokenUsed: false,
    } as EmailEvent);

    // Route by current job status
    const triggerJob = await this.findJobByStatus(VideoJobStatus.AWAITING_TRIGGER_CONFIRMATION);
    if (
      triggerJob &&
      (command.type === 'APPROVE' || command.type === 'SKIP' || command.type === 'REVISE')
    ) {
      await this.handleTriggerReply(triggerJob, command);
      return;
    }

    const reviewJob = await this.findJobByStatus(VideoJobStatus.AWAITING_REVIEW);
    if (reviewJob && (command.type === 'APPROVE' || command.type === 'REVISE')) {
      await this.handleReviewReply(reviewJob, command);
      return;
    }

    this.logger.debug(
      `ReviewService: command "${command.type}" — no matching job in actionable status`,
    );
  }

  // ─── Trigger reply ────────────────────────────────────────────────────────────

  private async handleTriggerReply(job: VideoJob, command: ParsedCommand): Promise<void> {
    if (command.type === 'SKIP') {
      await this.transition(job, VideoJobStatus.SKIPPED_TODAY, TransitionTrigger.EMAIL_ACTION);
      await this.subjectRepo.save({
        id: job.subjectId,
        status: SubjectStatus.SKIPPED_TODAY,
      } as Subject);
      this.logger.log(`ReviewService: job ${job.id} SKIPPED by user`);
      return;
    }

    // APPROVE or REVISE (topic change) → run Claude
    if (command.type === 'REVISE') {
      // User wants to change topic before generating — update the subject
      await this.subjectRepo.save({ id: job.subjectId, topic: command.note } as Subject);
      this.logger.log(`ReviewService: subject ${job.subjectId} topic updated to "${command.note}"`);
    }

    const subject = await this.subjectRepo.findById(job.subjectId);
    if (!subject) return;

    await this.transition(job, VideoJobStatus.DRAFT_GENERATING, TransitionTrigger.EMAIL_ACTION);

    try {
      const version = await this.claudeService.generate(job, subject);
      // claudeService already set status to AWAITING_REVIEW
      await this.sendReviewEmail(job, subject, version);
    } catch (err) {
      await this.transition(
        job,
        VideoJobStatus.FAILED,
        TransitionTrigger.SYSTEM,
        (err as Error).message,
      );
      await this.jobRepo.save({ id: job.id, errorMessage: (err as Error).message } as VideoJob);
    }
  }

  // ─── Review reply ─────────────────────────────────────────────────────────────

  private async handleReviewReply(job: VideoJob, command: ParsedCommand): Promise<void> {
    if (command.type === 'APPROVE') {
      const draft = await this.findCurrentDraft(job.id);

      if (draft) {
        await this.versionRepo.save({
          id: draft.id,
          status: JobVersionStatus.APPROVED,
          isApproved: true,
          approvedAt: new Date(),
        } as JobVersion);
      }

      await this.jobRepo.save({
        id: job.id,
        status: VideoJobStatus.APPROVED,
        approvedVersionId: draft?.id,
        approvedAt: new Date(),
      } as VideoJob);
      await this.subjectRepo.save({
        id: job.subjectId,
        status: SubjectStatus.IN_PROGRESS,
      } as Subject);
      await this.transitionRepo.save({
        jobId: job.id,
        fromStatus: VideoJobStatus.AWAITING_REVIEW,
        toStatus: VideoJobStatus.APPROVED,
        triggeredBy: TransitionTrigger.EMAIL_ACTION,
      } as StatusTransition);

      this.logger.log(`ReviewService: job ${job.id} APPROVED — triggering render`);
      await this.sendApprovalConfirmationEmail(job);

      // Kick off render asynchronously — don't block the email poll loop
      this.renderService.render(job).catch((err: Error) => {
        this.logger.error(`ReviewService: render failed for job ${job.id} — ${err.message}`);
      });
      return;
    }

    // REVISE → regenerate
    if (command.type !== 'REVISE') return;

    const subject = await this.subjectRepo.findById(job.subjectId);
    if (!subject) return;

    await this.transition(job, VideoJobStatus.DRAFT_GENERATING, TransitionTrigger.EMAIL_ACTION);

    // Refetch fresh job (versionCount was updated by previous generate call)
    const freshJob = await this.jobRepo.findById(job.id);
    if (!freshJob) return;

    try {
      const version = await this.claudeService.generate(freshJob, subject, command.note);
      await this.sendReviewEmail(freshJob, subject, version);
    } catch (err) {
      await this.transition(
        freshJob,
        VideoJobStatus.FAILED,
        TransitionTrigger.SYSTEM,
        (err as Error).message,
      );
      await this.jobRepo.save({
        id: freshJob.id,
        errorMessage: (err as Error).message,
      } as VideoJob);
    }
  }

  // ─── Email builders ───────────────────────────────────────────────────────────

  async sendReviewEmailForJob(jobId: string): Promise<void> {
    const job = await this.jobRepo.findById(jobId);
    if (!job) return;
    const subject = await this.subjectRepo.findById(job.subjectId);
    if (!subject) return;
    const drafts = await this.versionRepo.filter(
      { jobId, status: JobVersionStatus.DRAFT, isDeleted: false } as never,
      { sort: { field: 'versionNumber', order: 'desc' }, limit: 1 },
    );
    const version = drafts[0];
    if (!version) return;
    await this.sendReviewEmail(job, subject, version);
  }

  private async sendReviewEmail(
    job: VideoJob,
    subject: Subject,
    version: JobVersion,
  ): Promise<void> {
    const to = this.config.getOrThrow<string>('NOTIFICATION_EMAIL');
    const emailSubject = `[Videos Generator] Review v${version.versionNumber}: "${subject.topic}"`;
    const html = this.buildReviewEmailHtml(subject.topic, version);

    await this.emailService.send({ to, subject: emailSubject, html });

    await this.emailEventRepo.save({
      jobId: job.id,
      direction: EmailDirection.SENT,
      emailType: EmailEventType.REVIEW,
      toAddress: to,
      subject: emailSubject,
      bodyHtml: html,
      sentAt: new Date(),
      actionTokenUsed: false,
    } as EmailEvent);

    this.logger.log(
      `ReviewService: review email sent for v${version.versionNumber} (job ${job.id})`,
    );
  }

  private async sendApprovalConfirmationEmail(job: VideoJob): Promise<void> {
    const to = this.config.getOrThrow<string>('NOTIFICATION_EMAIL');
    const emailSubject = `[Videos Generator] ✅ Approved — rendering will begin`;
    const html = `
<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
<style>
  body{font-family:-apple-system,sans-serif;background:#f4f4f5;margin:0;padding:32px}
  .card{background:#fff;border-radius:12px;max-width:520px;margin:0 auto;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,.08)}
  h2{color:#15803d;margin-top:0}
</style></head>
<body><div class="card">
  <h2>✅ Video Plan Approved</h2>
  <p>The video plan for job <strong>${job.id}</strong> has been approved.</p>
  <p>Rendering will begin shortly. You'll receive another email when the video is ready for upload.</p>
  <p style="color:#888;font-size:.85rem;margin-top:24px">mas-videos-generator · job ${job.id}</p>
</div></body></html>`;

    await this.emailService.send({ to, subject: emailSubject, html });
    await this.emailEventRepo.save({
      jobId: job.id,
      direction: EmailDirection.SENT,
      emailType: EmailEventType.APPROVAL_START,
      toAddress: to,
      subject: emailSubject,
      sentAt: new Date(),
      actionTokenUsed: false,
    } as EmailEvent);
  }

  private buildReviewEmailHtml(topic: string, version: JobVersion): string {
    const d = version.data as VideoJobData;
    const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const chapterRows = (d.chapters ?? [])
      .map(
        (c) => `<tr><td>${c.order}</td><td>${esc(c.title)}</td><td>${c.durationSeconds}s</td></tr>`,
      )
      .join('');

    const qcRows = (d.qualityChecks ?? [])
      .map((q) => {
        const color = q.status === 'pass' ? '#15803d' : q.status === 'fail' ? '#dc2626' : '#d97706';
        return `<tr><td>${esc(q.rule)}</td><td style="color:${color};font-weight:600">${q.status.toUpperCase()}</td><td>${esc(q.note ?? '')}</td></tr>`;
      })
      .join('');

    const riskRows = (d.risks ?? [])
      .map((r) => {
        const color =
          r.severity === 'high' ? '#dc2626' : r.severity === 'medium' ? '#d97706' : '#6b7280';
        return `<tr><td>${esc(r.type)}</td><td style="color:${color}">${r.severity}</td><td>${esc(r.description)}</td></tr>`;
      })
      .join('');

    const tagList = (d.youtubeMetadata?.tags ?? [])
      .map(
        (t) =>
          `<span style="background:#f3f4f6;border-radius:4px;padding:2px 8px;font-size:.8rem">${esc(t)}</span>`,
      )
      .join(' ');

    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
<style>
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f4f4f5;margin:0;padding:32px}
  .card{background:#fff;border-radius:12px;max-width:640px;margin:0 auto;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,.08)}
  h2{margin-top:0;color:#1e1e2e}
  h3{color:#4b5563;font-size:1rem;border-bottom:1px solid #f0f0f0;padding-bottom:6px}
  .topic{font-size:1.2rem;font-weight:700;color:#7c3aed;background:#f5f3ff;border-left:4px solid #7c3aed;padding:10px 14px;border-radius:6px;margin:16px 0}
  .badge{display:inline-block;padding:2px 10px;border-radius:12px;font-size:.8rem;font-weight:600}
  .badge-blue{background:#dbeafe;color:#1d4ed8}
  table{width:100%;border-collapse:collapse;margin:8px 0;font-size:.9rem}
  th{text-align:left;padding:6px 8px;background:#f9fafb;color:#6b7280;font-size:.8rem}
  td{padding:6px 8px;border-bottom:1px solid #f3f4f6}
  .reply-box{background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:16px;margin:24px 0}
  .reply-box p{margin:4px 0;color:#15803d;font-weight:500}
  .section{margin:20px 0}
  .kv{display:flex;gap:8px;margin:4px 0;font-size:.9rem}
  .kv .k{color:#6b7280;min-width:140px}
  .footer{font-size:.75rem;color:#aaa;margin-top:24px;text-align:center}
</style></head>
<body><div class="card">

  <h2>📋 Review Plan — v${version.versionNumber}</h2>
  <div class="topic">${esc(topic)}</div>

  <div class="section">
    <h3>Strategy</h3>
    <div class="kv"><span class="k">Angle</span><span>${esc(d.strategy?.angle ?? '')}</span></div>
    <div class="kv"><span class="k">Hook</span><span><em>${esc(d.strategy?.hook ?? '')}</em></span></div>
    <div class="kv"><span class="k">Promise</span><span>${esc(d.strategy?.promise ?? '')}</span></div>
    <div class="kv"><span class="k">Audience</span><span>${esc(d.strategy?.targetAudience ?? '')}</span></div>
    <div class="kv"><span class="k">Tone</span><span>${esc(d.strategy?.tone ?? '')}</span></div>
    ${d.strategy?.cta ? `<div class="kv"><span class="k">CTA</span><span>${esc(d.strategy.cta)}</span></div>` : ''}
  </div>

  <div class="section">
    <h3>YouTube Metadata</h3>
    <div class="kv"><span class="k">Title</span><strong>${esc(d.youtubeMetadata?.title ?? '')}</strong></div>
    <div class="kv"><span class="k">Description</span><span style="color:#555">${esc((d.youtubeMetadata?.description ?? '').slice(0, 200))}…</span></div>
    <div style="margin-top:8px">${tagList}</div>
  </div>

  <div class="section">
    <h3>Chapters (${d.chapters?.length ?? 0}) · ${d.totalDuration}s total</h3>
    <table>
      <tr><th>#</th><th>Title</th><th>Duration</th></tr>
      ${chapterRows}
    </table>
    <p style="color:#6b7280;font-size:.85rem;margin:4px 0">${d.scenes?.length ?? 0} scenes across ${d.chapters?.length ?? 0} chapters</p>
  </div>

  ${
    qcRows
      ? `<div class="section">
    <h3>Quality Checks</h3>
    <table><tr><th>Rule</th><th>Status</th><th>Note</th></tr>${qcRows}</table>
  </div>`
      : ''
  }

  ${
    riskRows
      ? `<div class="section">
    <h3>Risks</h3>
    <table><tr><th>Type</th><th>Severity</th><th>Description</th></tr>${riskRows}</table>
  </div>`
      : ''
  }

  <div class="reply-box">
    <p>✅ Reply <strong>APPROVE</strong> to start rendering</p>
    <p>✏️ Reply <strong>REVISE: &lt;your feedback&gt;</strong> to regenerate with changes</p>
  </div>

  <div class="footer">mas-videos-generator · job ${version.jobId} · v${version.versionNumber}</div>
</div></body></html>`;
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────────

  private async findJobByStatus(status: VideoJobStatus): Promise<VideoJob | null> {
    const jobs = await this.jobRepo.filter({ status, isDeleted: false } as never, {
      sort: { field: 'createdAt', order: 'asc' },
      limit: 1,
    });
    return jobs[0] ?? null;
  }

  private async findCurrentDraft(jobId: string): Promise<JobVersion | null> {
    const drafts = await this.versionRepo.filter(
      { jobId, status: JobVersionStatus.DRAFT, isDeleted: false } as never,
      { sort: { field: 'versionNumber', order: 'desc' }, limit: 1 },
    );
    return drafts[0] ?? null;
  }

  private async transition(
    job: VideoJob,
    toStatus: VideoJobStatus,
    triggeredBy: TransitionTrigger,
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
      triggeredBy,
    } as StatusTransition);

    await this.logRepo.save({
      jobId: job.id,
      level: errorMessage ? LogLevel.ERROR : LogLevel.INFO,
      step: LogStep.STATUS_CHANGE,
      message: `${job.status} → ${toStatus}${errorMessage ? `: ${errorMessage}` : ''}`,
    } as JobLog);
  }
}
