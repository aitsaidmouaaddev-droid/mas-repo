import { Resolver, Query } from '@nestjs/graphql';
import { BaseResolver } from '@mas/nest-graphql-typeorm-base';
import { CurrentIdentity } from '../../decorators/current-identity.decorator';
import { IdentityService } from './identity.service';
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

  @Query(() => Identity, { name: 'me' })
  me(@CurrentIdentity() identity: Identity): Identity {
    return identity;
  }
}
