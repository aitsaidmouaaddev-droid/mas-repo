import { Injectable, Inject } from '@nestjs/common';
import { Scope } from '@nestjs/common';
import { DB_ADAPTER, type IDbAdapter } from '@mas/db-contracts';
import { BaseService, IdentityContext } from '@mas/nest-graphql-typeorm-base';
import { QcmProgress, CreateQcmProgressInput, UpdateQcmProgressInput } from './qcm-progress.entity';

@Injectable({ scope: Scope.REQUEST })
export class QcmProgressService extends BaseService<
  QcmProgress,
  CreateQcmProgressInput,
  UpdateQcmProgressInput
>(true) {
  constructor(
    @Inject(DB_ADAPTER) adapter: IDbAdapter,
    identityCtx: IdentityContext,
  ) {
    super(adapter.getRepository(QcmProgress), identityCtx);
  }
}
