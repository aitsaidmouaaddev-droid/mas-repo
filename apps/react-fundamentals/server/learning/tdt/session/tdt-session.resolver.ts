import { Resolver } from '@nestjs/graphql';
import { BaseResolver } from '@mas/nest-graphql-typeorm-base';
import { TdtSession, CreateTdtSessionInput, UpdateTdtSessionInput } from './tdt-session.entity';
import { TdtSessionService } from './tdt-session.service';

@Resolver(() => TdtSession)
export class TdtSessionResolver extends BaseResolver(
  TdtSession,
  CreateTdtSessionInput,
  UpdateTdtSessionInput,
) {
  constructor(service: TdtSessionService) {
    super(service);
  }
}
