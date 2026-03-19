import { Inject } from '@nestjs/common';
import { Resolver, Query } from '@nestjs/graphql';
import { DB_ADAPTER } from '@mas/db-contracts';
import type { IDbAdapter } from '@mas/db-contracts';
import type { DataSource } from 'typeorm';
import { BaseResolver } from '@mas/nest-graphql-typeorm-base';
import { CurrentIdentity } from '../../decorators/current-identity.decorator';
import type { Identity } from '../identity/identity.entity';
import { UserService } from './user.service';
import { User, CreateUserInput, UpdateUserInput } from './user.entity';

@Resolver(() => User)
export class UserResolver extends BaseResolver(User, CreateUserInput, UpdateUserInput) {
  constructor(
    service: UserService,
    @Inject(DB_ADAPTER) private readonly db: IDbAdapter<DataSource>,
  ) {
    super(service);
  }

  /** Returns the User profile linked to the current identity. */
  @Query(() => User, { nullable: true, name: 'myUser' })
  myUser(@CurrentIdentity() identity: Identity): Promise<User | null> {
    return this.db
      .getConnection()
      .getRepository(User)
      .findOne({ where: { identityId: identity.id } });
  }
}
