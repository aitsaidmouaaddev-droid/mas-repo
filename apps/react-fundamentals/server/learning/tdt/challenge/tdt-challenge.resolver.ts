import { Resolver } from '@nestjs/graphql';
import { BaseResolver } from '@mas/nest-graphql-typeorm-base';
import { TdtChallenge, CreateTdtChallengeInput, UpdateTdtChallengeInput } from './tdt-challenge.entity';
import { TdtChallengeService } from './tdt-challenge.service';

@Resolver(() => TdtChallenge)
export class TdtChallengeResolver extends BaseResolver(
  TdtChallenge,
  CreateTdtChallengeInput,
  UpdateTdtChallengeInput,
) {
  constructor(service: TdtChallengeService) {
    super(service);
  }
}
