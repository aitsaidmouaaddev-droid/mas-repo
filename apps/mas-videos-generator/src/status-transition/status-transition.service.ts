import { Injectable, Inject } from '@nestjs/common';
import { DB_ADAPTER, type IDbAdapter } from '@mas/db-contracts';
import { BaseService } from '@mas/nest-graphql-typeorm-base';
import { StatusTransition } from './status-transition.entity';
import type {
  CreateStatusTransitionInput,
  UpdateStatusTransitionInput,
} from './status-transition.entity';

@Injectable()
export class StatusTransitionService extends BaseService<
  StatusTransition,
  CreateStatusTransitionInput,
  UpdateStatusTransitionInput
>() {
  constructor(@Inject(DB_ADAPTER) adapter: IDbAdapter) {
    super(adapter.getRepository(StatusTransition));
  }
}
