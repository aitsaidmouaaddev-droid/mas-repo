import { Resolver } from '@nestjs/graphql';
import { BaseResolver } from '@mas/nest-graphql-typeorm-base';
import type { IdentityService } from './identity.service';
import { Identity, CreateIdentityInput, UpdateIdentityInput } from './identity.entity';

@Resolver(() => Identity)
export class IdentityResolver extends BaseResolver(
  Identity,
  CreateIdentityInput,
  UpdateIdentityInput,
) {
  constructor(service: IdentityService) {
    super(service);
  }
}
