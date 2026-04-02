import { BadRequestException, Inject } from '@nestjs/common';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { DB_ADAPTER } from '@mas/db-contracts';
import type { IDbAdapter } from '@mas/db-contracts';
import type { DataSource } from 'typeorm';
import { Public } from '../decorators/public.decorator';
import { Identity } from '../modules/identity/identity.entity';
import { ProviderService } from '../modules/provider/provider.service';
import { PasswordResetService } from '../modules/password-reset/password-reset.service';

/** Forgot-password and reset-password mutations. Registered only when `passwordReset` is enabled. */
@Resolver()
export class PasswordResetResolver {
  constructor(
    @Inject(DB_ADAPTER) private readonly db: IDbAdapter<DataSource>,
    private readonly providerService: ProviderService,
    private readonly passwordResetService: PasswordResetService,
  ) {}

  /**
   * Initiates a password reset for the given email.
   * Always returns `true` to prevent email-enumeration attacks.
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

  /** Consumes a one-time reset token and sets a new password. */
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
