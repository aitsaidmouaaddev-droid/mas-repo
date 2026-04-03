import { Injectable, Inject } from '@nestjs/common';
import { DB_ADAPTER, type IDbAdapter } from '@mas/db-contracts';
import { BaseService } from '@mas/nest-graphql-typeorm-base';
import { EmailEvent } from './email-event.entity';
import type { CreateEmailEventInput, UpdateEmailEventInput } from './email-event.entity';

@Injectable()
export class EmailEventService extends BaseService<
  EmailEvent,
  CreateEmailEventInput,
  UpdateEmailEventInput
>() {
  constructor(@Inject(DB_ADAPTER) adapter: IDbAdapter) {
    super(adapter.getRepository(EmailEvent));
  }
}
