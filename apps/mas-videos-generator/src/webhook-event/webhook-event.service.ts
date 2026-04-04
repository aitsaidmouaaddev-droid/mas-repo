import { Injectable, Inject } from '@nestjs/common';
import { DB_ADAPTER, type IDbAdapter } from '@mas/db-contracts';
import { BaseService } from '@mas/nest-graphql-typeorm-base';
import { WebhookEvent } from './webhook-event.entity';
import type { CreateWebhookEventInput, UpdateWebhookEventInput } from './webhook-event.entity';

@Injectable()
export class WebhookEventService extends BaseService<
  WebhookEvent,
  CreateWebhookEventInput,
  UpdateWebhookEventInput
>() {
  constructor(@Inject(DB_ADAPTER) adapter: IDbAdapter) {
    super(adapter.getRepository(WebhookEvent));
  }
}
