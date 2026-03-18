import { Resolver, Query } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { BaseResolver } from '@mas/nest-graphql-typeorm-base';
import { CurrentIdentity } from '../../decorators/current-identity.decorator';
import type { Identity } from '../identity/identity.entity';
import type { UserService } from './user.service';
import { User, CreateUserInput, UpdateUserInput } from './user.entity';

@Resolver(() => User)
export class UserResolver extends BaseResolver(User, CreateUserInput, UpdateUserInput) {
  constructor(
    service: UserService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {
    super(service);
  }

  /** Returns the User profile linked to the current identity. */
  @Query(() => User, { nullable: true, name: 'myUser' })
  myUser(@CurrentIdentity() identity: Identity): Promise<User | null> {
    return this.userRepo.findOne({ where: { identityId: identity.id } });
  }
}
