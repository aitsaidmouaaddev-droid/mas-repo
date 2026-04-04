import { Resolver } from '@nestjs/graphql';
import { BaseResolver } from '@mas/nest-graphql-typeorm-base';
import { VideoJob, CreateVideoJobInput, UpdateVideoJobInput } from './video-job.entity';
import { VideoJobService } from './video-job.service';

@Resolver(() => VideoJob)
export class VideoJobResolver extends BaseResolver(
  VideoJob,
  CreateVideoJobInput,
  UpdateVideoJobInput,
) {
  constructor(service: VideoJobService) {
    super(service);
  }
}
