import { Injectable, Inject } from '@nestjs/common';
import { DB_ADAPTER, type IDbAdapter } from '@mas/db-contracts';
import { BaseService } from '@mas/nest-graphql-typeorm-base';
import { JobAsset } from './job-asset.entity';
import type { CreateJobAssetInput, UpdateJobAssetInput } from './job-asset.entity';

@Injectable()
export class JobAssetService extends BaseService<
  JobAsset,
  CreateJobAssetInput,
  UpdateJobAssetInput
>() {
  constructor(@Inject(DB_ADAPTER) adapter: IDbAdapter) {
    super(adapter.getRepository(JobAsset));
  }
}
