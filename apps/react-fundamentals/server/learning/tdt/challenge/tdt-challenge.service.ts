import { Injectable, Inject } from '@nestjs/common';
import { DB_ADAPTER, type IDbAdapter } from '@mas/db-contracts';
import { BaseService } from '@mas/nest-graphql-typeorm-base';
import { TdtChallenge } from './tdt-challenge.entity';
import type { CreateTdtChallengeInput, UpdateTdtChallengeInput } from './tdt-challenge.entity';

@Injectable()
export class TdtChallengeService extends BaseService<
  TdtChallenge,
  CreateTdtChallengeInput,
  UpdateTdtChallengeInput
>() {
  constructor(@Inject(DB_ADAPTER) adapter: IDbAdapter) {
    super(adapter.getRepository(TdtChallenge));
  }
}
