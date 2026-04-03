import { Module } from '@nestjs/common';
import { JobVersionService } from './job-version.service';
import { JobVersionResolver } from './job-version.resolver';

@Module({
  providers: [JobVersionService, JobVersionResolver],
  exports: [JobVersionService],
})
export class JobVersionModule {}
