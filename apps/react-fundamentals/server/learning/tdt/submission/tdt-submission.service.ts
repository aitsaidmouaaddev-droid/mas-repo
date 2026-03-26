import { Injectable, Inject } from '@nestjs/common';
import { Scope } from '@nestjs/common';
import { DB_ADAPTER, type IDbAdapter } from '@mas/db-contracts';
import { BaseService, IdentityContext } from '@mas/nest-graphql-typeorm-base';
import { TdtSubmission, CreateTdtSubmissionInput, UpdateTdtSubmissionInput } from './tdt-submission.entity';

@Injectable({ scope: Scope.REQUEST })
export class TdtSubmissionService extends BaseService<
  TdtSubmission,
  CreateTdtSubmissionInput,
  UpdateTdtSubmissionInput
>(true) {
  constructor(
    @Inject(DB_ADAPTER) adapter: IDbAdapter,
    identityCtx: IdentityContext,
  ) {
    super(adapter.getRepository(TdtSubmission), identityCtx);
  }
}
