import { Resolver, Mutation, Args, ID } from '@nestjs/graphql';
import { VideoJob } from '../video-job/video-job.entity';
import { SchedulerService } from './scheduler.service';

@Resolver()
export class SchedulerResolver {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Mutation(() => VideoJob, {
    description:
      'Manually trigger the pipeline for a specific subject, bypassing the daily cron. ' +
      'Sends a trigger-confirmation email identical to the scheduled flow. ' +
      'Throws if the subject is not PENDING or not active.',
  })
  async triggerSubject(
    @Args('subjectId', { type: () => ID }) subjectId: string,
  ): Promise<VideoJob> {
    return this.schedulerService.triggerForSubject(subjectId);
  }
}
