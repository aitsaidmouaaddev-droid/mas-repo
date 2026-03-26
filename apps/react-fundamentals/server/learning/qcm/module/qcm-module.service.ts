import { Injectable, Inject } from '@nestjs/common';
import { DB_ADAPTER, type IDbAdapter } from '@mas/db-contracts';
import { BaseService } from '@mas/nest-graphql-typeorm-base';
import { QcmModule } from './qcm-module.entity';
import type { CreateQcmModuleInput, UpdateQcmModuleInput } from './qcm-module.entity';

@Injectable()
export class QcmModuleService extends BaseService<
  QcmModule,
  CreateQcmModuleInput,
  UpdateQcmModuleInput
>() {
  constructor(@Inject(DB_ADAPTER) adapter: IDbAdapter) {
    super(adapter.getRepository(QcmModule));
  }
}
