import { Module } from '@nestjs/common';
import { JobLogService } from './job-log.service';
import { JobLogResolver } from './job-log.resolver';

@Module({
  providers: [JobLogService, JobLogResolver],
  exports: [JobLogService],
})
export class JobLogModule {}
