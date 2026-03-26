import { Injectable, Inject } from '@nestjs/common';
import { Scope } from '@nestjs/common';
import { DB_ADAPTER, type IDbAdapter } from '@mas/db-contracts';
import { BaseService, IdentityContext } from '@mas/nest-graphql-typeorm-base';
import { TdtSession, CreateTdtSessionInput, UpdateTdtSessionInput } from './tdt-session.entity';

@Injectable({ scope: Scope.REQUEST })
export class TdtSessionService extends BaseService<
  TdtSession,
  CreateTdtSessionInput,
  UpdateTdtSessionInput
>(true) {
  constructor(
    @Inject(DB_ADAPTER) adapter: IDbAdapter,
    identityCtx: IdentityContext,
  ) {
    super(adapter.getRepository(TdtSession), identityCtx);
  }
}
