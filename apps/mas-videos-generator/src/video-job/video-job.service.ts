import { Injectable, Inject } from '@nestjs/common';
import { DB_ADAPTER, type IDbAdapter } from '@mas/db-contracts';
import { BaseService } from '@mas/nest-graphql-typeorm-base';
import { VideoJob } from './video-job.entity';
import type { CreateVideoJobInput, UpdateVideoJobInput } from './video-job.entity';

@Injectable()
export class VideoJobService extends BaseService<
  VideoJob,
  CreateVideoJobInput,
  UpdateVideoJobInput
>() {
  constructor(@Inject(DB_ADAPTER) adapter: IDbAdapter) {
    super(adapter.getRepository(VideoJob));
  }
}
