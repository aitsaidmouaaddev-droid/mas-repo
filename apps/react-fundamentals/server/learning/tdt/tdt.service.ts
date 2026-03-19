import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DB_ADAPTER, type IDbAdapter, type IRepository } from '@mas/db-contracts';
import { TdtSession, TdtSessionStatus, StartTdtSessionInput } from './tdt-session.entity';
import { TdtSubmission, SubmitCodeInput } from './tdt-submission.entity';
import { TdtProgress } from './tdt-progress.entity';

@Injectable()
export class TdtService {
  private readonly sessions: IRepository<TdtSession>;
  private readonly submissions: IRepository<TdtSubmission>;
  private readonly progress: IRepository<TdtProgress>;

  constructor(@Inject(DB_ADAPTER) adapter: IDbAdapter) {
    this.sessions = adapter.getRepository(TdtSession);
    this.submissions = adapter.getRepository(TdtSubmission);
    this.progress = adapter.getRepository(TdtProgress);
  }

  async startSession(identityId: string, input: StartTdtSessionInput): Promise<TdtSession> {
    const session = Object.assign(new TdtSession(), {
      identityId,
      challengeId: input.challengeId,
      status: TdtSessionStatus.InProgress,
      attemptsCount: 0,
      startedAt: new Date(),
    });
    return this.sessions.save(session);
  }

  async submitCode(identityId: string, input: SubmitCodeInput): Promise<TdtSubmission> {
    const session = await this.sessions.findById(input.sessionId);
    if (!session) throw new NotFoundException('Session not found');
    if (session.identityId !== identityId) throw new ForbiddenException();
    if (session.status !== TdtSessionStatus.InProgress) {
      throw new ForbiddenException('Session is no longer active');
    }

    const now = new Date();

    const submission = Object.assign(new TdtSubmission(), {
      sessionId: input.sessionId,
      code: input.code,
      passedTests: input.passedTests,
      failedTests: input.failedTests,
      totalTests: input.totalTests,
      logs: input.logs,
      submittedAt: now,
    });
    await this.submissions.save(submission);

    session.attemptsCount = (session.attemptsCount ?? 0) + 1;
    const allPassed = input.passedTests === input.totalTests && input.totalTests > 0;

    if (allPassed) {
      session.status = TdtSessionStatus.Solved;
      session.solvedAt = now;
    }
    await this.sessions.save(session);

    const existing = await this.progress.filter({
      identityId,
      challengeId: session.challengeId,
    } as Partial<TdtProgress>);
    const progress = existing[0] ?? Object.assign(new TdtProgress(), {
      identityId,
      challengeId: session.challengeId,
      isSolved: false,
      totalAttempts: 0,
    });

    progress.totalAttempts = (progress.totalAttempts ?? 0) + 1;
    progress.lastAttemptAt = now;

    if (allPassed && !progress.isSolved) {
      progress.isSolved = true;
      progress.firstSolvedAt = now;
      progress.bestSubmissionId = submission.id;
    } else if (allPassed && !progress.bestSubmissionId) {
      progress.bestSubmissionId = submission.id;
    }

    await this.progress.save(progress);
    return submission;
  }

  async abandonSession(identityId: string, sessionId: string): Promise<TdtSession> {
    const session = await this.sessions.findById(sessionId);
    if (!session) throw new NotFoundException('Session not found');
    if (session.identityId !== identityId) throw new ForbiddenException();
    session.status = TdtSessionStatus.Abandoned;
    return this.sessions.save(session);
  }

  async myProgress(identityId: string): Promise<TdtProgress[]> {
    return this.progress.filter({ identityId } as Partial<TdtProgress>);
  }

  async myChallengeProgress(identityId: string, challengeId: string): Promise<TdtProgress | null> {
    const results = await this.progress.filter({ identityId, challengeId } as Partial<TdtProgress>);
    return results[0] ?? null;
  }

  async mySessions(identityId: string, challengeId?: string): Promise<TdtSession[]> {
    const criteria = challengeId ? { identityId, challengeId } : { identityId };
    return this.sessions.filter(criteria as Partial<TdtSession>);
  }

  async sessionSubmissions(identityId: string, sessionId: string): Promise<TdtSubmission[]> {
    const session = await this.sessions.findById(sessionId);
    if (!session) throw new NotFoundException('Session not found');
    if (session.identityId !== identityId) throw new ForbiddenException();
    return this.submissions.filter({ sessionId } as Partial<TdtSubmission>);
  }
}
