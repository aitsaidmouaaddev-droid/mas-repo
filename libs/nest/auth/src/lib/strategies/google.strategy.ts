import { Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, type Profile, type VerifyCallback } from 'passport-google-oauth20';
import { DB_ADAPTER } from '@mas/db-contracts';
import type { IDbAdapter } from '@mas/db-contracts';
import type { DataSource } from 'typeorm';
import { UserService } from '../modules/user/user.service';
import { ProviderService } from '../modules/provider/provider.service';
import { TokenService } from '../modules/token/token.service';
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
      scope: [
        'email',
        'profile',
        'https://www.googleapis.com/auth/user.birthday.read',
        'https://www.googleapis.com/auth/user.gender.read',
      ],
    });
  }

  /** Fetches birthday and gender from the Google People API in a single request. */
  private async fetchGoogleProfile(
    accessToken: string,
  ): Promise<{ dateOfBirth?: Date; gender?: string }> {
    try {
      const res = await fetch(
        'https://people.googleapis.com/v1/people/me?personFields=birthdays,genders',
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      if (!res.ok) {
        console.warn('[GoogleStrategy] People API error:', res.status, await res.text());
        return {};
      }
      const data = (await res.json()) as {
        birthdays?: Array<{ date?: { year?: number; month?: number; day?: number } }>;
        genders?: Array<{ value?: string; formattedValue?: string }>;
      };

      const bday = data.birthdays?.find((b) => b.date?.month && b.date?.day)?.date;
      const dateOfBirth =
        bday?.month && bday?.day
          ? new Date(bday.year ?? 1900, bday.month - 1, bday.day)
          : undefined;

      const gender = data.genders?.[0]?.value ?? undefined;

      console.log('[GoogleStrategy] People API result:', {
        dateOfBirth,
        gender,
        raw: JSON.stringify(data),
      });
      return { dateOfBirth, gender };
    } catch (err) {
      console.warn('[GoogleStrategy] fetchGoogleProfile threw:', err);
      return {};
    }
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
      const { dateOfBirth, gender } = await this.fetchGoogleProfile(_accessToken);

      const identityRepo = this.db.getConnection().getRepository(Identity);
      const userRepo = this.db.getConnection().getRepository(User);

      // 1. Existing Google provider link → just load identity
      const providerRecord = await this.providerService.findByProvider(
        ProviderType.GOOGLE,
        googleId,
      );

      let identity: Identity;
      let userId: string;

      if (providerRecord) {
        const found = await identityRepo.findOne({ where: { id: providerRecord.identityId } });
        if (!found) throw new Error(`Identity ${providerRecord.identityId} not found`);
        identity = found;
        const existingUser = await userRepo.findOne({ where: { identityId: identity.id } });
        if (!existingUser) throw new Error(`User not found for identity ${identity.id}`);
        userId = existingUser.id;
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
            const created = await userRepo.save(
              userRepo.create({
                identityId: identity.id,
                firstName: firstName ?? undefined,
                lastName: lastName ?? undefined,
                dateOfBirth: dateOfBirth ?? undefined,
                gender: gender ?? undefined,
              }),
            );
            userId = created.id;
          } else {
            const userUpdates: Partial<User> = {};
            if (!existingUser.firstName && firstName) userUpdates.firstName = firstName;
            if (!existingUser.lastName && lastName) userUpdates.lastName = lastName;
            if (!existingUser.dateOfBirth && dateOfBirth) userUpdates.dateOfBirth = dateOfBirth;
            if (!existingUser.gender && gender) userUpdates.gender = gender;
            if (Object.keys(userUpdates).length)
              await userRepo.update(existingUser.id, userUpdates);
            userId = existingUser.id;
          }
        } else {
          // 2b. Brand-new signup — create User (cascades Identity creation)
          const user = await this.userService.create({
            firstName,
            lastName,
            dateOfBirth,
            gender,
            identity: { email, displayName, avatarUrl },
          } as Parameters<UserService['create']>[0]);
          identity = (await identityRepo.findOne({ where: { id: user.identityId } }))!;
          userId = user.id;
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
        uid: userId,
        type: identity.type,
      });

      done(null, { identity, ...tokens } satisfies GoogleOAuthResult);
    } catch (err) {
      done(err as Error);
    }
  }
}
