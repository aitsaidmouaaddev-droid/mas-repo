import { Resolver } from '@nestjs/graphql';
import { BaseResolver } from '@mas/nest-graphql-typeorm-base';
import { JobAsset, CreateJobAssetInput, UpdateJobAssetInput } from './job-asset.entity';
import { JobAssetService } from './job-asset.service';

@Resolver(() => JobAsset)
export class JobAssetResolver extends BaseResolver(
  JobAsset,
  CreateJobAssetInput,
  UpdateJobAssetInput,
) {
  constructor(service: JobAssetService) {
    super(service);
  }
}
