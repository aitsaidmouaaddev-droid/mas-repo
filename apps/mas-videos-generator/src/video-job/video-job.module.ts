import { Module } from '@nestjs/common';
import { VideoJobService } from './video-job.service';
import { VideoJobResolver } from './video-job.resolver';

@Module({
  providers: [VideoJobService, VideoJobResolver],
  exports: [VideoJobService],
})
export class VideoJobModule {}
