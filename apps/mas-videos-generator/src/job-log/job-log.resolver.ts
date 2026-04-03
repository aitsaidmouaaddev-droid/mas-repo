import { Resolver } from '@nestjs/graphql';
import { BaseResolver } from '@mas/nest-graphql-typeorm-base';
import { JobLog, CreateJobLogInput, UpdateJobLogInput } from './job-log.entity';
import { JobLogService } from './job-log.service';

@Resolver(() => JobLog)
export class JobLogResolver extends BaseResolver(JobLog, CreateJobLogInput, UpdateJobLogInput) {
  constructor(service: JobLogService) {
    super(service);
  }
}
