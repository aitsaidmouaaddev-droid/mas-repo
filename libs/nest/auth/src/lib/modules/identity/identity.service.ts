import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { TypeOrmRepository } from '@mas/db-typeorm';
import { BaseService } from '@mas/nest-graphql-typeorm-base';
import { Identity } from './identity.entity';
import type { CreateIdentityInput, UpdateIdentityInput } from './identity.entity';

@Injectable()
export class IdentityService extends BaseService<
  Identity,
  CreateIdentityInput,
  UpdateIdentityInput
>() {
  constructor(@InjectRepository(Identity) repo: Repository<Identity>) {
    super(new TypeOrmRepository(Identity, repo.manager));
  }
}
