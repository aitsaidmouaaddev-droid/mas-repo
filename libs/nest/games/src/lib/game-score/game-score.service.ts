import { Injectable, Inject, Scope } from '@nestjs/common';
import { DB_ADAPTER, type IDbAdapter } from '@mas/db-contracts';
import { BaseService } from '@mas/nest-graphql-typeorm-base';
import { IdentityContext } from '@mas/nest-graphql-typeorm-base';
import { GameScore, CreateGameScoreInput, UpdateGameScoreInput } from './game-score.entity';

@Injectable({ scope: Scope.REQUEST })
export class GameScoreService extends BaseService<
  GameScore,
  CreateGameScoreInput,
  UpdateGameScoreInput
>(true) {
  constructor(
    @Inject(DB_ADAPTER) adapter: IDbAdapter,
    identityCtx: IdentityContext,
  ) {
    super(adapter.getRepository(GameScore), identityCtx);
  }
}
