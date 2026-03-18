import { UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Resolver, Mutation, Args, ObjectType, Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { AtLeastOneOf } from '@mas/nest-graphql-typeorm-base';
import type { Repository } from 'typeorm';
import { Public } from '../decorators/public.decorator';
import { CurrentIdentity } from '../decorators/current-identity.decorator';
import type { IdentityService } from '../modules/identity/identity.service';
import { Identity } from '../modules/identity/identity.entity';
import type { UserService } from '../modules/user/user.service';
import type { ProviderService } from '../modules/provider/provider.service';
import type { TokenService } from '../modules/token/token.service';

@ObjectType()
export class LoginResponse {
  @Field() accessToken!: string;
  @Field() refreshToken!: string;
  @Field(() => Identity) identity!: Identity;
}

@InputType()
class LoginInput {
  /** Email or identityName. */
  @IsNotEmpty()
  @Field()
  login!: string;
  @IsNotEmpty()
  @MinLength(8)
  @Field()
  password!: string;
}

@InputType()
class RegisterInput {
  @AtLeastOneOf(['email', 'identityName'])
  @IsOptional()
  @IsEmail()
  @Field({ nullable: true })
  email?: string;
  @IsOptional()
  @IsString()
  @MinLength(3)
  @Field({ nullable: true })
  identityName?: string;
  @IsNotEmpty()
  @MinLength(8)
  @Field()
  password!: string;
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  displayName?: string;
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  avatarUrl?: string;
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  locale?: string;
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  timezone?: string;
}

@Resolver()
export class AuthResolver {
  constructor(
    @InjectRepository(Identity) private readonly identityRepo: Repository<Identity>,
    private readonly identityService: IdentityService,
    private readonly userService: UserService,
    private readonly providerService: ProviderService,
    private readonly tokenService: TokenService,
  ) {}

  @Public()
  @Mutation(() => LoginResponse)
  async login(@Args('input') { login, password }: LoginInput): Promise<LoginResponse> {
    const identity = await this.identityRepo.findOne({
      where: [{ email: login }, { identityName: login }],
    });
    if (!identity) throw new UnauthorizedException('Invalid credentials');

    const valid = await this.providerService.validatePassword(identity.id, password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.tokenService.issueTokenPair({
      sub: identity.id,
      type: identity.type,
    });
    await this.identityRepo.update(identity.id, { lastLoginAt: new Date() });

    return { ...tokens, identity };
  }

  @Public()
  @Mutation(() => LoginResponse)
  async register(@Args('input') input: RegisterInput): Promise<LoginResponse> {
    const user = await this.userService.create({
      identity: {
        email: input.email,
        identityName: input.identityName,
        displayName: input.displayName,
        avatarUrl: input.avatarUrl,
      },
      locale: input.locale,
      timezone: input.timezone,
    });
    await this.providerService.createLocal(
      user.identityId!,
      input.email ?? input.identityName!,
      input.password,
    );
    const tokens = await this.tokenService.issueTokenPair({ sub: user.identityId!, type: 'user' });
    return { ...tokens, identity: user.identity! };
  }

  @Public()
  @Mutation(() => LoginResponse)
  async refreshToken(@Args('token') token: string): Promise<LoginResponse> {
    const { identityId, newRefreshToken } = await this.tokenService.rotateRefreshToken(token);

    const identity = await this.identityService.findOne(identityId);
    if (!identity) throw new UnauthorizedException();

    const accessToken = this.tokenService.signAccessToken({ sub: identityId, type: identity.type });
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
