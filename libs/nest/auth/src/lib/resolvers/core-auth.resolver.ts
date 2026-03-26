import { UnauthorizedException } from '@nestjs/common';
import { Resolver, Mutation, Args, ObjectType, Field } from '@nestjs/graphql';
import { Public } from '../decorators/public.decorator';
import { CurrentIdentity } from '../decorators/current-identity.decorator';
import { IdentityService } from '../modules/identity/identity.service';
import { Identity } from '../modules/identity/identity.entity';
import { TokenService } from '../modules/token/token.service';
import { UserService } from '../modules/user/user.service';

@ObjectType()
export class LoginResponse {
  @Field() accessToken!: string;
  @Field() refreshToken!: string;
  @Field(() => Identity) identity!: Identity;
}

/** Always-on mutations: token refresh and logout. */
@Resolver()
export class CoreAuthResolver {
  constructor(
    private readonly identityService: IdentityService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}

  @Public()
  @Mutation(() => LoginResponse)
  async refreshToken(@Args('token') token: string): Promise<LoginResponse> {
    const { identityId, newRefreshToken } = await this.tokenService.rotateRefreshToken(token);
    const identity = await this.identityService.findOne(identityId);
    if (!identity) throw new UnauthorizedException();
    const [user] = await this.userService.repo.filter({ identityId }, { limit: 1 });
    if (!user) throw new UnauthorizedException('No user account for this identity');
    const accessToken = this.tokenService.signAccessToken({ sub: identityId, uid: user.id, type: identity.type });
    return { accessToken, refreshToken: newRefreshToken, identity };
  }

  @Mutation(() => Boolean)
  async logout(
    @CurrentIdentity() _identity: Identity,
    @Args('refreshToken') refreshToken: string,
  ): Promise<boolean> {
    await this.tokenService.revokeRefreshToken(refreshToken);
    return true;
  }

  @Mutation(() => Boolean)
  async logoutAll(@CurrentIdentity() identity: Identity): Promise<boolean> {
    await this.tokenService.revokeAllForIdentity(identity.id);
    return true;
  }
}
