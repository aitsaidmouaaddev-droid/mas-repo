import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { CurrentIdentity, Identity } from '@mas/auth';
import { TdtService } from './tdt.service';
import { TdtSession, StartTdtSessionInput } from './tdt-session.entity';
import { TdtSubmission, SubmitCodeInput } from './tdt-submission.entity';
import { TdtProgress } from './tdt-progress.entity';

@Resolver(() => TdtSession)
export class TdtResolver {
  constructor(private readonly tdt: TdtService) {}

  // ── Queries ────────────────────────────────────────────────────────────────

  @Query(() => [TdtProgress])
  myTdtProgress(@CurrentIdentity() identity: Identity): Promise<TdtProgress[]> {
    return this.tdt.myProgress(identity.id);
  }

  @Query(() => TdtProgress, { nullable: true })
  myTdtChallengeProgress(
    @CurrentIdentity() identity: Identity,
    @Args('challengeId') challengeId: string,
  ): Promise<TdtProgress | null> {
    return this.tdt.myChallengeProgress(identity.id, challengeId);
  }

  @Query(() => [TdtSession])
  myTdtSessions(
    @CurrentIdentity() identity: Identity,
    @Args('challengeId', { nullable: true }) challengeId?: string,
  ): Promise<TdtSession[]> {
    return this.tdt.mySessions(identity.id, challengeId);
  }

  @Query(() => [TdtSubmission])
  tdtSessionSubmissions(
    @CurrentIdentity() identity: Identity,
    @Args('sessionId', { type: () => ID }) sessionId: string,
  ): Promise<TdtSubmission[]> {
    return this.tdt.sessionSubmissions(identity.id, sessionId);
  }

  // ── Mutations ──────────────────────────────────────────────────────────────

  @Mutation(() => TdtSession)
  startTdtSession(
    @CurrentIdentity() identity: Identity,
    @Args('input') input: StartTdtSessionInput,
  ): Promise<TdtSession> {
    return this.tdt.startSession(identity.id, input);
  }

  @Mutation(() => TdtSubmission)
  submitTdtCode(
    @CurrentIdentity() identity: Identity,
    @Args('input') input: SubmitCodeInput,
  ): Promise<TdtSubmission> {
    return this.tdt.submitCode(identity.id, input);
  }

  @Mutation(() => TdtSession)
  abandonTdtSession(
    @CurrentIdentity() identity: Identity,
    @Args('sessionId', { type: () => ID }) sessionId: string,
  ): Promise<TdtSession> {
    return this.tdt.abandonSession(identity.id, sessionId);
  }
}
