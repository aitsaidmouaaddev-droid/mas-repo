import { Resolver } from '@nestjs/graphql';
import { BaseResolver } from '@mas/nest-graphql-typeorm-base';
import { Game, CreateGameInput, UpdateGameInput } from './game.entity';
import { GameService } from './game.service';

@Resolver(() => Game)
export class GameResolver extends BaseResolver(Game, CreateGameInput, UpdateGameInput) {
  constructor(service: GameService) {
    super(service);
  }
}
