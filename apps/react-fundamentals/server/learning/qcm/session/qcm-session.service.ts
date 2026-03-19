import { Injectable, Inject } from '@nestjs/common';
import { Scope } from '@nestjs/common';
import { DB_ADAPTER, type IDbAdapter } from '@mas/db-contracts';
import { BaseService, IdentityContext } from '@mas/nest-graphql-typeorm-base';
import { QcmSession, CreateQcmSessionInput, UpdateQcmSessionInput } from './qcm-session.entity';

@Injectable({ scope: Scope.REQUEST })
export class QcmSessionService extends BaseService<
  QcmSession,
  CreateQcmSessionInput,
  UpdateQcmSessionInput
>(true) {
  constructor(
    @Inject(DB_ADAPTER) adapter: IDbAdapter,
    identityCtx: IdentityContext,
  ) {
    super(adapter.getRepository(QcmSession), identityCtx);
  }
}
