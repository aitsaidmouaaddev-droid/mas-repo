import { Resolver } from '@nestjs/graphql';
import { BaseResolver } from '@mas/nest-graphql-typeorm-base';
import { UserService } from './user.service';
import { User, CreateUserInput, UpdateUserInput } from './user.entity';

@Resolver(() => User)
export class UserResolver extends BaseResolver(User, CreateUserInput, UpdateUserInput) {
  constructor(service: UserService) {
    super(service);
  }
}
