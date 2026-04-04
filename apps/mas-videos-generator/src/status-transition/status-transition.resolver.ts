import { Resolver } from '@nestjs/graphql';
import { BaseResolver } from '@mas/nest-graphql-typeorm-base';
import {
  StatusTransition,
  CreateStatusTransitionInput,
  UpdateStatusTransitionInput,
} from './status-transition.entity';
import { StatusTransitionService } from './status-transition.service';

@Resolver(() => StatusTransition)
export class StatusTransitionResolver extends BaseResolver(
  StatusTransition,
  CreateStatusTransitionInput,
  UpdateStatusTransitionInput,
) {
  constructor(service: StatusTransitionService) {
    super(service);
  }
}
