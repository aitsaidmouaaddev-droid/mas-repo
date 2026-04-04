import { Injectable, Inject } from '@nestjs/common';
import { DB_ADAPTER, type IDbAdapter } from '@mas/db-contracts';
import { BaseService } from '@mas/nest-graphql-typeorm-base';
import { JobVersion } from './job-version.entity';
import type { CreateJobVersionInput, UpdateJobVersionInput } from './job-version.entity';

@Injectable()
export class JobVersionService extends BaseService<
  JobVersion,
  CreateJobVersionInput,
  UpdateJobVersionInput
>() {
  constructor(@Inject(DB_ADAPTER) adapter: IDbAdapter) {
    super(adapter.getRepository(JobVersion));
  }
}
