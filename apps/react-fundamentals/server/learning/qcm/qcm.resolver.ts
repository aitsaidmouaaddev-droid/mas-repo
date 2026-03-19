import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { CurrentIdentity, Identity } from '@mas/auth';
import { QcmService } from './qcm.service';
import { QcmSession, StartQcmSessionInput } from './qcm-session.entity';
import { QcmAnswer, AnswerQuestionInput } from './qcm-answer.entity';
import { QcmProgress } from './qcm-progress.entity';

@Resolver(() => QcmSession)
export class QcmResolver {
  constructor(private readonly qcm: QcmService) {}

  // ── Queries ────────────────────────────────────────────────────────────────

  @Query(() => [QcmProgress])
  myQcmProgress(@CurrentIdentity() identity: Identity): Promise<QcmProgress[]> {
    return this.qcm.myProgress(identity.id);
  }

  @Query(() => QcmProgress, { nullable: true })
  myQcmModuleProgress(
    @CurrentIdentity() identity: Identity,
    @Args('moduleId') moduleId: string,
  ): Promise<QcmProgress | null> {
    return this.qcm.myModuleProgress(identity.id, moduleId);
  }

  @Query(() => [QcmSession])
  myQcmSessions(
    @CurrentIdentity() identity: Identity,
    @Args('moduleId', { nullable: true }) moduleId?: string,
  ): Promise<QcmSession[]> {
    return this.qcm.mySessions(identity.id, moduleId);
  }

  @Query(() => [QcmAnswer])
  qcmSessionAnswers(
    @CurrentIdentity() identity: Identity,
    @Args('sessionId', { type: () => ID }) sessionId: string,
  ): Promise<QcmAnswer[]> {
    return this.qcm.sessionAnswers(identity.id, sessionId);
  }

  // ── Mutations ──────────────────────────────────────────────────────────────

  @Mutation(() => QcmSession)
  startQcmSession(
    @CurrentIdentity() identity: Identity,
    @Args('input') input: StartQcmSessionInput,
  ): Promise<QcmSession> {
    return this.qcm.startSession(identity.id, input);
  }

  @Mutation(() => QcmAnswer)
  answerQcmQuestion(
    @CurrentIdentity() identity: Identity,
    @Args('input') input: AnswerQuestionInput,
  ): Promise<QcmAnswer> {
    return this.qcm.answerQuestion(identity.id, input);
  }

  @Mutation(() => QcmSession)
  completeQcmSession(
    @CurrentIdentity() identity: Identity,
    @Args('sessionId', { type: () => ID }) sessionId: string,
  ): Promise<QcmSession> {
    return this.qcm.completeSession(identity.id, sessionId);
  }

  @Mutation(() => QcmSession)
  abandonQcmSession(
    @CurrentIdentity() identity: Identity,
    @Args('sessionId', { type: () => ID }) sessionId: string,
  ): Promise<QcmSession> {
    return this.qcm.abandonSession(identity.id, sessionId);
  }
}
