import { Resolver } from '@nestjs/graphql';
import { BaseResolver } from '@mas/nest-graphql-typeorm-base';
import { EmailEvent, CreateEmailEventInput, UpdateEmailEventInput } from './email-event.entity';
import { EmailEventService } from './email-event.service';

@Resolver(() => EmailEvent)
export class EmailEventResolver extends BaseResolver(
  EmailEvent,
  CreateEmailEventInput,
  UpdateEmailEventInput,
) {
  constructor(service: EmailEventService) {
    super(service);
  }
}
