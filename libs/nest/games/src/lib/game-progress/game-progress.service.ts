import { Injectable, Inject, Scope } from '@nestjs/common';
import { DB_ADAPTER, type IDbAdapter } from '@mas/db-contracts';
import { BaseService, IdentityContext } from '@mas/nest-graphql-typeorm-base';
import { GameProgress, CreateGameProgressInput, UpdateGameProgressInput } from './game-progress.entity';

@Injectable({ scope: Scope.REQUEST })
export class GameProgressService extends BaseService<
  GameProgress,
  CreateGameProgressInput,
  UpdateGameProgressInput
>(true) {
  constructor(
    @Inject(DB_ADAPTER) adapter: IDbAdapter,
    identityCtx: IdentityContext,
  ) {
    super(adapter.getRepository(GameProgress), identityCtx);
  }
}
