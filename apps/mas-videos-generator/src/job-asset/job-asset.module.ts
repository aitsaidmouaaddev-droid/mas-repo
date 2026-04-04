import { Module } from '@nestjs/common';
import { JobAssetService } from './job-asset.service';
import { JobAssetResolver } from './job-asset.resolver';

@Module({
  providers: [JobAssetService, JobAssetResolver],
  exports: [JobAssetService],
})
export class JobAssetModule {}
