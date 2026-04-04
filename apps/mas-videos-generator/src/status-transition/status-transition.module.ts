import { Module } from '@nestjs/common';
import { StatusTransitionService } from './status-transition.service';
import { StatusTransitionResolver } from './status-transition.resolver';

@Module({
  providers: [StatusTransitionService, StatusTransitionResolver],
  exports: [StatusTransitionService],
})
export class StatusTransitionModule {}
