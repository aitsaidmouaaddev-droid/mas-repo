import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { TypeOrmRepository } from '@mas/db-typeorm';
import { BaseService } from '@mas/nest-graphql-typeorm-base';
import { User } from './user.entity';
import type { CreateUserInput, UpdateUserInput } from './user.entity';

@Injectable()
export class UserService extends BaseService<User, CreateUserInput, UpdateUserInput>() {
  constructor(@InjectRepository(User) repo: Repository<User>) {
    super(new TypeOrmRepository(User, repo.manager));
  }
}
