import { Module } from '@nestjs/common';
import { WebhookEventService } from './webhook-event.service';
import { WebhookEventResolver } from './webhook-event.resolver';

@Module({
  providers: [WebhookEventService, WebhookEventResolver],
  exports: [WebhookEventService],
})
export class WebhookEventModule {}
