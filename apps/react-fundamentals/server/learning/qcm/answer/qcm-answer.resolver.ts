import { Resolver } from '@nestjs/graphql';
import { BaseResolver } from '@mas/nest-graphql-typeorm-base';
import { QcmAnswer, CreateQcmAnswerInput, UpdateQcmAnswerInput } from './qcm-answer.entity';
import { QcmAnswerService } from './qcm-answer.service';

@Resolver(() => QcmAnswer)
export class QcmAnswerResolver extends BaseResolver(
  QcmAnswer,
  CreateQcmAnswerInput,
  UpdateQcmAnswerInput,
) {
  constructor(service: QcmAnswerService) {
    super(service);
  }
}
