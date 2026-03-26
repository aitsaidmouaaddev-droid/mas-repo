import { Resolver } from '@nestjs/graphql';
import { BaseResolver } from '@mas/nest-graphql-typeorm-base';
import { TdtProgress, CreateTdtProgressInput, UpdateTdtProgressInput } from './tdt-progress.entity';
import { TdtProgressService } from './tdt-progress.service';

@Resolver(() => TdtProgress)
export class TdtProgressResolver extends BaseResolver(
  TdtProgress,
  CreateTdtProgressInput,
  UpdateTdtProgressInput,
) {
  constructor(service: TdtProgressService) {
    super(service);
  }
}
