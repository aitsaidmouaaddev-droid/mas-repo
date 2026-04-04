import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { SchedulerResolver } from './scheduler.resolver';

@Module({
  providers: [SchedulerService, SchedulerResolver],
  exports: [SchedulerService],
})
export class SchedulerModule {}
