import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IdentityModule } from '../identity/identity.module';
import { RefreshToken } from './refresh-token.entity';
import { TokenService } from './token.service';

/**
 * JWT access tokens + persisted refresh tokens.
 *
 * Reads `JWT_SECRET` and `JWT_EXPIRES_IN` from the environment via
 * `ConfigService` — set these in your app's `.env` file.
 *
 * Depends on {@link IdentityModule} for the `Identity` relation on
 * `RefreshToken`.
 */
@Module({
  imports: [
    IdentityModule,
    TypeOrmModule.forFeature([RefreshToken]),
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
