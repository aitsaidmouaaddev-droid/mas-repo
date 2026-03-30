import { Resolver } from '@nestjs/graphql';
import { BaseResolver } from '@mas/nest-graphql-typeorm-base';
import { GameProgress, CreateGameProgressInput, UpdateGameProgressInput } from './game-progress.entity';
import { GameProgressService } from './game-progress.service';

@Resolver(() => GameProgress)
export class GameProgressResolver extends BaseResolver(
  GameProgress,
  CreateGameProgressInput,
  UpdateGameProgressInput,
) {
  constructor(service: GameProgressService) {
    super(service);
  }
}
