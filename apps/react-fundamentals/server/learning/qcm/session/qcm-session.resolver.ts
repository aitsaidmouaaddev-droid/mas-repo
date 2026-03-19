import { Resolver } from '@nestjs/graphql';
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
}
