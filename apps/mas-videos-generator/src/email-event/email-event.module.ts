import { Module } from '@nestjs/common';
import { EmailEventService } from './email-event.service';
import { EmailEventResolver } from './email-event.resolver';

@Module({
  providers: [EmailEventService, EmailEventResolver],
  exports: [EmailEventService],
})
export class EmailEventModule {}
