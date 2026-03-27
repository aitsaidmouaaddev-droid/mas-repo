import { Resolver } from '@nestjs/graphql';
import { BaseResolver } from '@mas/nest-graphql-typeorm-base';
import { GameScore, CreateGameScoreInput, UpdateGameScoreInput } from './game-score.entity';
import { GameScoreService } from './game-score.service';

@Resolver(() => GameScore)
export class GameScoreResolver extends BaseResolver(
  GameScore,
  CreateGameScoreInput,
  UpdateGameScoreInput,
) {
  constructor(service: GameScoreService) {
    super(service);
  }
}
