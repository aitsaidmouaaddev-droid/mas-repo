import { Resolver, Query, ResolveField, Parent } from '@nestjs/graphql';
import { Inject, forwardRef } from '@nestjs/common';
import { BaseResolver } from '@mas/nest-graphql-typeorm-base';
import { CurrentIdentity } from '../../decorators/current-identity.decorator';
import { IdentityService } from './identity.service';
import { Identity, CreateIdentityInput, UpdateIdentityInput } from './identity.entity';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Resolver(() => Identity)
export class IdentityResolver extends BaseResolver(
  Identity,
  CreateIdentityInput,
  UpdateIdentityInput,
) {
  constructor(
    service: IdentityService,
    @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
  ) {
    super(service);
  }

  @Query(() => Identity, { name: 'me' })
  me(@CurrentIdentity() identity: Identity): Identity {
    return identity;
  }

  @ResolveField(() => User, { nullable: true })
  async user(@Parent() identity: Identity): Promise<User | null> {
    const results = await this.userService.repo.filter({ identityId: identity.id } as never);
    return results[0] ?? null;
  }
}
