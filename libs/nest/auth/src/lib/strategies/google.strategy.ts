import { Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, type Profile, type VerifyCallback } from 'passport-google-oauth20';
import { DB_ADAPTER } from '@mas/db-contracts';
import type { IDbAdapter } from '@mas/db-contracts';
import type { DataSource } from 'typeorm';
import type { UserService } from '../modules/user/user.service';
import type { ProviderService } from '../modules/provider/provider.service';
import type { TokenService } from '../modules/token/token.service';
import { Identity } from '../modules/identity/identity.entity';
import { User } from '../modules/user/user.entity';
import { ProviderType } from '../modules/provider/provider-type.enum';

/** Shape stored in `req.user` after the Google callback is verified. */
export interface GoogleOAuthResult {
  identity: Identity;
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(DB_ADAPTER) private readonly db: IDbAdapter<DataSource>,
    private readonly userService: UserService,
    private readonly providerService: ProviderService,
    private readonly tokenService: TokenService,
  ) {
    super({
      clientID: process.env['GOOGLE_CLIENT_ID'] ?? 'MISSING',
      clientSecret: process.env['GOOGLE_CLIENT_SECRET'] ?? 'MISSING',
      callbackURL:
        process.env['GOOGLE_CALLBACK_URL'] ?? 'http://localhost:4311/auth/oauth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    try {
      const googleId = profile.id;
      const email = profile.emails?.[0]?.value;
      const displayName = profile.displayName;
      const avatarUrl = profile.photos?.[0]?.value;
      const firstName = profile.name?.givenName;
      const lastName = profile.name?.familyName;

      const identityRepo = this.db.getConnection().getRepository(Identity);
      const userRepo = this.db.getConnection().getRepository(User);

      // 1. Existing Google provider link → just load identity
      const providerRecord = await this.providerService.findByProvider(
        ProviderType.GOOGLE,
        googleId,
      );

      let identity: Identity;

      if (providerRecord) {
        const found = await identityRepo.findOne({ where: { id: providerRecord.identityId } });
        if (!found) throw new Error(`Identity ${providerRecord.identityId} not found`);
        identity = found;
      } else {
        // 2a. Existing identity matched by email → link it, back-fill missing fields
        const existing = email ? await identityRepo.findOne({ where: { email } }) : null;

        if (existing) {
          identity = existing;
          const updates: Partial<Identity> = {};
          if (!identity.avatarUrl && avatarUrl) updates.avatarUrl = avatarUrl;
          if (!identity.displayName && displayName) updates.displayName = displayName;
          if (Object.keys(updates).length) {
            await identityRepo.update(identity.id, updates);
            Object.assign(identity, updates);
          }

          // Ensure the User row exists (identity may have been created via local signup)
          const existingUser = await userRepo.findOne({ where: { identityId: identity.id } });
          if (!existingUser) {
            await userRepo.save(
              userRepo.create({
                identityId: identity.id,
                firstName: firstName ?? undefined,
                lastName: lastName ?? undefined,
              }),
            );
          } else if (
            (!existingUser.firstName && firstName) ||
            (!existingUser.lastName && lastName)
          ) {
            await userRepo.update(existingUser.id, {
              firstName: existingUser.firstName ?? firstName,
              lastName: existingUser.lastName ?? lastName,
            });
          }
        } else {
          // 2b. Brand-new signup — create User (cascades Identity creation)
          const user = await this.userService.create({
            firstName,
            lastName,
            identity: { email, displayName, avatarUrl },
          } as Parameters<UserService['create']>[0]);
          identity = (await identityRepo.findOne({ where: { id: user.identityId } }))!;
        }

        // Create the Google provider row
        await this.providerService.createOAuth({
          identityId: identity.id,
          provider: ProviderType.GOOGLE,
          providerAccountId: googleId,
        });
      }

      // Update lastLoginAt
      await identityRepo.update(identity.id, { lastLoginAt: new Date() });

      const tokens = await this.tokenService.issueTokenPair({
        sub: identity.id,
        type: identity.type,
      });

      done(null, { identity, ...tokens } satisfies GoogleOAuthResult);
    } catch (err) {
      done(err as Error);
    }
  }
}
