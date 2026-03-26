import { Resolver } from '@nestjs/graphql';
import { BaseResolver } from '@mas/nest-graphql-typeorm-base';
import { TdtSubmission, CreateTdtSubmissionInput, UpdateTdtSubmissionInput } from './tdt-submission.entity';
import { TdtSubmissionService } from './tdt-submission.service';

@Resolver(() => TdtSubmission)
export class TdtSubmissionResolver extends BaseResolver(
  TdtSubmission,
  CreateTdtSubmissionInput,
  UpdateTdtSubmissionInput,
) {
  constructor(service: TdtSubmissionService) {
    super(service);
  }
}
