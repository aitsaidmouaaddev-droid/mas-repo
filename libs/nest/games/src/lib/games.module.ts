import { Module } from '@nestjs/common';
import { IdentityContext } from '@mas/nest-graphql-typeorm-base';
import { Game } from './game/game.entity';
import { GameScore } from './game-score/game-score.entity';
import { GameProgress } from './game-progress/game-progress.entity';
import { GameService } from './game/game.service';
import { GameResolver } from './game/game.resolver';
import { GameScoreService } from './game-score/game-score.service';
import { GameScoreResolver } from './game-score/game-score.resolver';
import { GameProgressService } from './game-progress/game-progress.service';
import { GameProgressResolver } from './game-progress/game-progress.resolver';

@Module({
  providers: [
    IdentityContext,
    GameService,
    GameResolver,
    GameScoreService,
    GameScoreResolver,
    GameProgressService,
    GameProgressResolver,
  ],
  exports: [GameService, GameScoreService, GameProgressService],
})
export class GamesModule {
  /** All TypeORM entities — spread into the DataSource entities array. */
  static readonly entities = [Game, GameScore, GameProgress] as const;
}

