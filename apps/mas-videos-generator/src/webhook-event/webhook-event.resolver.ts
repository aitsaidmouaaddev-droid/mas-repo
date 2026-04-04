import { Resolver } from '@nestjs/graphql';
import { BaseResolver } from '@mas/nest-graphql-typeorm-base';
import {
  WebhookEvent,
  CreateWebhookEventInput,
  UpdateWebhookEventInput,
} from './webhook-event.entity';
import { WebhookEventService } from './webhook-event.service';

@Resolver(() => WebhookEvent)
export class WebhookEventResolver extends BaseResolver(
  WebhookEvent,
  CreateWebhookEventInput,
  UpdateWebhookEventInput,
) {
  constructor(service: WebhookEventService) {
    super(service);
  }
}
