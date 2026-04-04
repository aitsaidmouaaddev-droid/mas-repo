import { Resolver } from '@nestjs/graphql';
import { BaseResolver } from '@mas/nest-graphql-typeorm-base';
import { JobVersion, CreateJobVersionInput, UpdateJobVersionInput } from './job-version.entity';
import { JobVersionService } from './job-version.service';

@Resolver(() => JobVersion)
export class JobVersionResolver extends BaseResolver(
  JobVersion,
  CreateJobVersionInput,
  UpdateJobVersionInput,
) {
  constructor(service: JobVersionService) {
    super(service);
  }
}
