import { Resolver, Mutation, Args, ID } from '@nestjs/graphql';
import { VideoJob } from '../video-job/video-job.entity';
import { PipelineService, RetryStep } from './pipeline.service';

@Resolver()
export class PipelineResolver {
  constructor(private readonly pipelineService: PipelineService) {}

  @Mutation(() => VideoJob, {
    description:
      'Manually retry a specific pipeline step for a job. ' +
      'step must be one of: generate | render | upload. ' +
      "The step is fired asynchronously; the mutation returns the job's current state immediately.",
  })
  retryStep(
    @Args('jobId', { type: () => ID }) jobId: string,
    @Args('step') step: RetryStep,
  ): Promise<VideoJob> {
    return this.pipelineService.retryStep(jobId, step);
  }
}
