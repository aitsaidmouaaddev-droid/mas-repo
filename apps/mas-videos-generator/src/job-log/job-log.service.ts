import { Injectable, Inject } from '@nestjs/common';
import { DB_ADAPTER, type IDbAdapter } from '@mas/db-contracts';
import { BaseService } from '@mas/nest-graphql-typeorm-base';
import { JobLog } from './job-log.entity';
import type { CreateJobLogInput, UpdateJobLogInput } from './job-log.entity';

@Injectable()
export class JobLogService extends BaseService<JobLog, CreateJobLogInput, UpdateJobLogInput>() {
  constructor(@Inject(DB_ADAPTER) adapter: IDbAdapter) {
    super(adapter.getRepository(JobLog));
  }
}
