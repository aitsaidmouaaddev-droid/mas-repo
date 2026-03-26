import { Resolver } from '@nestjs/graphql';
import { BaseResolver } from '@mas/nest-graphql-typeorm-base';
import { QcmProgress, CreateQcmProgressInput, UpdateQcmProgressInput } from './qcm-progress.entity';
import { QcmProgressService } from './qcm-progress.service';

@Resolver(() => QcmProgress)
export class QcmProgressResolver extends BaseResolver(
  QcmProgress,
  CreateQcmProgressInput,
  UpdateQcmProgressInput,
) {
  constructor(service: QcmProgressService) {
    super(service);
  }
}
