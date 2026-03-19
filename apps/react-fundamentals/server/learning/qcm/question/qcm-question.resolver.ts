import { Resolver } from '@nestjs/graphql';
import { BaseResolver } from '@mas/nest-graphql-typeorm-base';
import { QcmQuestion, CreateQcmQuestionInput, UpdateQcmQuestionInput } from './qcm-question.entity';
import { QcmQuestionService } from './qcm-question.service';

@Resolver(() => QcmQuestion)
export class QcmQuestionResolver extends BaseResolver(
  QcmQuestion,
  CreateQcmQuestionInput,
  UpdateQcmQuestionInput,
) {
  constructor(service: QcmQuestionService) {
    super(service);
  }
}
