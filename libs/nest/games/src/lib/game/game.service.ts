import { Injectable, Inject } from '@nestjs/common';
import { DB_ADAPTER, type IDbAdapter } from '@mas/db-contracts';
import { BaseService } from '@mas/nest-graphql-typeorm-base';
import { Game, CreateGameInput, UpdateGameInput } from './game.entity';

@Injectable()
export class GameService extends BaseService<Game, CreateGameInput, UpdateGameInput>() {
  constructor(@Inject(DB_ADAPTER) adapter: IDbAdapter) {
    super(adapter.getRepository(Game));
  }
}
