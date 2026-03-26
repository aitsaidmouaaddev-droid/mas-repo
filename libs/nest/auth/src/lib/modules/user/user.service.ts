import { Injectable, Inject } from '@nestjs/common';
import { DB_ADAPTER } from '@mas/db-contracts';
import type { IDbAdapter } from '@mas/db-contracts';
import { BaseService } from '@mas/nest-graphql-typeorm-base';
import { User } from './user.entity';
import type { CreateUserInput, UpdateUserInput } from './user.entity';

@Injectable()
export class UserService extends BaseService<User, CreateUserInput, UpdateUserInput>() {
  constructor(@Inject(DB_ADAPTER) adapter: IDbAdapter) {
    super(adapter.getRepository(User));
  }

}
