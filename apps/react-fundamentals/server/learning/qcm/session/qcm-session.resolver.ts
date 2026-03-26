import { Int, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { BaseResolver } from '@mas/nest-graphql-typeorm-base';
import { QcmSession, CreateQcmSessionInput, UpdateQcmSessionInput } from './qcm-session.entity';
import { QcmSessionService } from './qcm-session.service';

@Resolver(() => QcmSession)
export class QcmSessionResolver extends BaseResolver(
  QcmSession,
  CreateQcmSessionInput,
  UpdateQcmSessionInput,
) {
  constructor(service: QcmSessionService) {
    super(service);
  }

  @ResolveField('duration', () => Int)
  getDuration(@Parent() session: QcmSession): number {
    const end = session.completedAt ? new Date(session.completedAt) : new Date();
    return Math.floor((end.getTime() - new Date(session.startedAt).getTime()) / 1000);
  }
}
