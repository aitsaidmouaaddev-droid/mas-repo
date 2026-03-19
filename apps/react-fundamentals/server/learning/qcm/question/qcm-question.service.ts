import { Injectable, Inject } from '@nestjs/common';
import { DB_ADAPTER, type IDbAdapter } from '@mas/db-contracts';
import { BaseService } from '@mas/nest-graphql-typeorm-base';
import { QcmQuestion } from './qcm-question.entity';
import type { CreateQcmQuestionInput, UpdateQcmQuestionInput } from './qcm-question.entity';

@Injectable()
export class QcmQuestionService extends BaseService<
  QcmQuestion,
  CreateQcmQuestionInput,
  UpdateQcmQuestionInput
>() {
  constructor(@Inject(DB_ADAPTER) adapter: IDbAdapter) {
    super(adapter.getRepository(QcmQuestion));
  }
}
