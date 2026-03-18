import { BadRequestException, UnauthorizedException, Inject } from '@nestjs/common';
import { Resolver, Mutation, Args, ObjectType, Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { AtLeastOneOf } from '@mas/nest-graphql-typeorm-base';
import { DB_ADAPTER } from '@mas/db-contracts';
import type { IDbAdapter } from '@mas/db-contracts';
import type { DataSource } from 'typeorm';
import { Public } from '../decorators/public.decorator';
import { CurrentIdentity } from '../decorators/current-identity.decorator';
import { IdentityService } from '../modules/identity/identity.service';
import { Identity } from '../modules/identity/identity.entity';
import { UserService } from '../modules/user/user.service';
import { ProviderService } from '../modules/provider/provider.service';
import { TokenService } from '../modules/token/token.service';
import { PasswordResetService } from '../modules/password-reset/password-reset.service';

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
    @Inject(DB_ADAPTER) private readonly db: IDbAdapter<DataSource>,
    private readonly identityService: IdentityService,
    private readonly userService: UserService,
    private readonly providerService: ProviderService,
    private readonly tokenService: TokenService,
    private readonly passwordResetService: PasswordResetService,
  ) {}

  @Public()
  @Mutation(() => LoginResponse)
  async login(@Args('input') { login, password }: LoginInput): Promise<LoginResponse> {
    const repo = this.db.getConnection().getRepository(Identity);
    const identity = await repo.findOne({
      where: [{ email: login }, { identityName: login }],
    });
    if (!identity) throw new UnauthorizedException('Invalid credentials');

    const valid = await this.providerService.validatePassword(identity.id, password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.tokenService.issueTokenPair({
      sub: identity.id,
      type: identity.type,
    });
    await repo.update(identity.id, { lastLoginAt: new Date() });

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

  /**
   * Initiates a password reset for the given email.
   *
   * Always returns `true` — even when the email is not found — to prevent
   * email-enumeration attacks. The reset URL is logged to the console in
   * development; wire a real mailer via `SMTP_*` env vars in production.
   */
  @Public()
  @Mutation(() => Boolean)
  async forgotPassword(@Args('email') email: string): Promise<boolean> {
    const repo = this.db.getConnection().getRepository(Identity);
    const identity = await repo.findOne({ where: { email } });
    if (identity) {
      const raw = await this.passwordResetService.createToken(identity.id);
      const resetUrl = `${process.env['FRONTEND_URL'] ?? 'http://localhost:4205'}/auth?mode=reset&token=${raw}`;
      console.log(`[AUTH] Password reset link for ${email}:\n  ${resetUrl}`);
    }
    return true;
  }

  /**
   * Consumes a one-time reset token and sets a new password.
   *
   * @throws {@link BadRequestException} if the token is invalid, expired, or already used.
   */
  @Public()
  @Mutation(() => Boolean)
  async resetPassword(
    @Args('token') token: string,
    @Args('newPassword') newPassword: string,
  ): Promise<boolean> {
    if (newPassword.length < 8)
      throw new BadRequestException('Password must be at least 8 characters');
    const identityId = await this.passwordResetService.consumeToken(token);
    await this.providerService.updatePassword(identityId, newPassword);
    return true;
  }
}
