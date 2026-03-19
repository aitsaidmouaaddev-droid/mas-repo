import { Resolver } from '@nestjs/graphql';
import { BaseResolver } from '@mas/nest-graphql-typeorm-base';
import { QcmModule, CreateQcmModuleInput, UpdateQcmModuleInput } from './qcm-module.entity';
import { QcmModuleService } from './qcm-module.service';

@Resolver(() => QcmModule)
export class QcmModuleResolver extends BaseResolver(
  QcmModule,
  CreateQcmModuleInput,
  UpdateQcmModuleInput,
) {
  constructor(service: QcmModuleService) {
    super(service);
  }
}
