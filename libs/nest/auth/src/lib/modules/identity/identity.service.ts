import { Injectable, Inject } from '@nestjs/common';
import { DB_ADAPTER } from '@mas/db-contracts';
import type { IDbAdapter } from '@mas/db-contracts';
import { BaseService } from '@mas/nest-graphql-typeorm-base';
import { Identity } from './identity.entity';
import type { CreateIdentityInput, UpdateIdentityInput } from './identity.entity';

@Injectable()
export class IdentityService extends BaseService<
  Identity,
  CreateIdentityInput,
  UpdateIdentityInput
>() {
  constructor(@Inject(DB_ADAPTER) adapter: IDbAdapter) {
    super(adapter.getRepository(Identity));
  }
}
