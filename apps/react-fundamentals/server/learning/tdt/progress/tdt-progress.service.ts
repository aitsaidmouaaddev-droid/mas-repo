import { Injectable, Inject, NotFoundException } from '@nestjs/common';
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
  constructor(@Inject(DB_ADAPTER) adapter: IDbAdapter, identityCtx: IdentityContext) {
    super(adapter.getRepository(TdtProgress), identityCtx);
  }

  override async create(input: CreateTdtProgressInput): Promise<TdtProgress> {
    const saved = await super.create(input);
    const reloaded = await this.findOne(saved.id);
    if (!reloaded) throw new NotFoundException(`TdtProgress ${saved.id} not found after create`);
    return reloaded;
  }

  override async update(id: string, input: UpdateTdtProgressInput): Promise<TdtProgress> {
    await super.update(id, input);
    const reloaded = await this.findOne(id);
    if (!reloaded) throw new NotFoundException(`TdtProgress ${id} not found after update`);
    return reloaded;
  }
}
