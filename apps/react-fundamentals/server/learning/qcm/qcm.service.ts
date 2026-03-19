import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DB_ADAPTER, type IDbAdapter, type IRepository } from '@mas/db-contracts';
import { QcmSession, QcmSessionStatus, StartQcmSessionInput } from './qcm-session.entity';
import { QcmAnswer, AnswerQuestionInput } from './qcm-answer.entity';
import { QcmProgress } from './qcm-progress.entity';

@Injectable()
export class QcmService {
  private readonly sessions: IRepository<QcmSession>;
  private readonly answers: IRepository<QcmAnswer>;
  private readonly progress: IRepository<QcmProgress>;

  constructor(@Inject(DB_ADAPTER) adapter: IDbAdapter) {
    this.sessions = adapter.getRepository(QcmSession);
    this.answers = adapter.getRepository(QcmAnswer);
    this.progress = adapter.getRepository(QcmProgress);
  }

  async startSession(identityId: string, input: StartQcmSessionInput): Promise<QcmSession> {
    const session = Object.assign(new QcmSession(), {
      identityId,
      moduleId: input.moduleId,
      totalQuestions: input.totalQuestions,
      status: QcmSessionStatus.InProgress,
      startedAt: new Date(),
    });
    return this.sessions.save(session);
  }

  async answerQuestion(identityId: string, input: AnswerQuestionInput): Promise<QcmAnswer> {
    const session = await this.sessions.findById(input.sessionId);
    if (!session) throw new NotFoundException('Session not found');
    if (session.identityId !== identityId) throw new ForbiddenException();
    if (session.status !== QcmSessionStatus.InProgress) {
      throw new ForbiddenException('Session is no longer active');
    }

    const answer = Object.assign(new QcmAnswer(), {
      sessionId: input.sessionId,
      questionId: input.questionId,
      selectedOption: input.selectedOption,
      isCorrect: input.isCorrect,
      timeSpentMs: input.timeSpentMs,
      answeredAt: new Date(),
    });
    return this.answers.save(answer);
  }

  async completeSession(identityId: string, sessionId: string): Promise<QcmSession> {
    const session = await this.sessions.findById(sessionId);
    if (!session) throw new NotFoundException('Session not found');
    if (session.identityId !== identityId) throw new ForbiddenException();
    if (session.status !== QcmSessionStatus.InProgress) {
      throw new ForbiddenException('Session is no longer active');
    }

    const answers = await this.answers.filter({ sessionId } as Partial<QcmAnswer>);
    const correct = answers.filter((a) => a.isCorrect).length;
    const score = session.totalQuestions > 0
      ? Math.round((correct / session.totalQuestions) * 100)
      : 0;
    const now = new Date();

    session.status = QcmSessionStatus.Completed;
    session.score = score;
    session.completedAt = now;
    await this.sessions.save(session);

    const existing = await this.progress.filter({
      identityId,
      moduleId: session.moduleId,
    } as Partial<QcmProgress>);
    const progress = existing[0] ?? Object.assign(new QcmProgress(), {
      identityId,
      moduleId: session.moduleId,
      attemptsCount: 0,
      isCompleted: false,
    });

    progress.attemptsCount = (progress.attemptsCount ?? 0) + 1;
    progress.lastAttemptAt = now;
    progress.lastSessionId = session.id;

    if (progress.bestScore == null || score > progress.bestScore) {
      progress.bestScore = score;
    }
    if (score === 100 && !progress.isCompleted) {
      progress.isCompleted = true;
      progress.firstCompletedAt = now;
    }

    await this.progress.save(progress);
    return session;
  }

  async abandonSession(identityId: string, sessionId: string): Promise<QcmSession> {
    const session = await this.sessions.findById(sessionId);
    if (!session) throw new NotFoundException('Session not found');
    if (session.identityId !== identityId) throw new ForbiddenException();
    session.status = QcmSessionStatus.Abandoned;
    return this.sessions.save(session);
  }

  async myProgress(identityId: string): Promise<QcmProgress[]> {
    return this.progress.filter({ identityId } as Partial<QcmProgress>);
  }

  async myModuleProgress(identityId: string, moduleId: string): Promise<QcmProgress | null> {
    const results = await this.progress.filter({ identityId, moduleId } as Partial<QcmProgress>);
    return results[0] ?? null;
  }

  async mySessions(identityId: string, moduleId?: string): Promise<QcmSession[]> {
    const criteria = moduleId ? { identityId, moduleId } : { identityId };
    return this.sessions.filter(criteria as Partial<QcmSession>);
  }

  async sessionAnswers(identityId: string, sessionId: string): Promise<QcmAnswer[]> {
    const session = await this.sessions.findById(sessionId);
    if (!session) throw new NotFoundException('Session not found');
    if (session.identityId !== identityId) throw new ForbiddenException();
    return this.answers.filter({ sessionId } as Partial<QcmAnswer>);
  }
}
