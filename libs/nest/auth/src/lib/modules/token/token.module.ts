import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IdentityModule } from '../identity/identity.module';
import { TokenService } from './token.service';

/**
 * JWT access tokens + persisted refresh tokens.
 *
 * Reads `JWT_SECRET` and `JWT_EXPIRES_IN` from the environment via
 * `ConfigService` — set these in your app's `.env` file.
 */
@Module({
  imports: [
    IdentityModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          expiresIn: config.get('JWT_EXPIRES_IN', '15m') as any,
        },
      }),
    }),
  ],
  providers: [TokenService],
  exports: [TokenService, JwtModule],
})
export class TokenModule {}
