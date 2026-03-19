import { Injectable, Inject } from '@nestjs/common';
import { Scope } from '@nestjs/common';
import { DB_ADAPTER, type IDbAdapter } from '@mas/db-contracts';
import { BaseService, IdentityContext } from '@mas/nest-graphql-typeorm-base';
import { TdtProgress, CreateTdtProgressInput, UpdateTdtProgressInput } from './tdt-progress.entity';

@Injectable({ scope: Scope.REQUEST })
export class TdtProgressService extends BaseService<
  TdtProgress,
  CreateTdtProgressInput,
  UpdateTdtProgressInput
>(true) {
  constructor(
    @Inject(DB_ADAPTER) adapter: IDbAdapter,
    identityCtx: IdentityContext,
  ) {
    super(adapter.getRepository(TdtProgress), identityCtx);
  }
}
