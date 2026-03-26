import { Injectable, Inject } from '@nestjs/common';
import { Scope } from '@nestjs/common';
import { DB_ADAPTER, type IDbAdapter } from '@mas/db-contracts';
import { BaseService, IdentityContext } from '@mas/nest-graphql-typeorm-base';
import { QcmAnswer, CreateQcmAnswerInput, UpdateQcmAnswerInput } from './qcm-answer.entity';

@Injectable({ scope: Scope.REQUEST })
export class QcmAnswerService extends BaseService<
  QcmAnswer,
  CreateQcmAnswerInput,
  UpdateQcmAnswerInput
>(true) {
  constructor(
    @Inject(DB_ADAPTER) adapter: IDbAdapter,
    identityCtx: IdentityContext,
  ) {
    super(adapter.getRepository(QcmAnswer), identityCtx);
  }
}
