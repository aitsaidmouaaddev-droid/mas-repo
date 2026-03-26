import { DynamicModule, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { IdentityModule } from './modules/identity/identity.module';
import { UserModule } from './modules/user/user.module';
import { ProviderModule } from './modules/provider/provider.module';
import { TokenModule } from './modules/token/token.module';
import { PasswordResetModule } from './modules/password-reset/password-reset.module';
import { OAuthModule } from './modules/oauth/oauth.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CoreAuthResolver } from './resolvers/core-auth.resolver';
import { LocalAuthResolver } from './resolvers/local-auth.resolver';
import { PasswordResetResolver } from './resolvers/password-reset.resolver';
import { Identity } from './modules/identity/identity.entity';
import { User } from './modules/user/user.entity';
import { IdentityProvider } from './modules/provider/identity-provider.entity';
import { RefreshToken } from './modules/token/refresh-token.entity';
import { PasswordResetToken } from './modules/password-reset/password-reset-token.entity';

export type AuthMethod = 'local' | 'google' | 'passwordReset';

export interface AuthModuleOptions {
  /** Auth methods to enable. Omit a method to hide its mutations from the schema. */
  methods: AuthMethod[];
}

@Module({})
export class AuthModule {
  /** All TypeORM entities — pass to TypeOrmAdapter's `entities` array in the app. */
  static readonly entities = [
    Identity,
    User,
    IdentityProvider,
    RefreshToken,
    PasswordResetToken,
  ] as const;

  static register(options: AuthModuleOptions): DynamicModule {
    const { methods } = options;

    const imports: DynamicModule['imports'] = [
      PassportModule,
      IdentityModule,
      UserModule,
      ProviderModule,
      TokenModule,
    ];

    const providers: DynamicModule['providers'] = [
      JwtStrategy,
      JwtAuthGuard,
      CoreAuthResolver,
    ];

    if (methods.includes('local')) {
      providers.push(LocalStrategy, LocalAuthResolver);
    }

    if (methods.includes('google')) {
      imports.push(OAuthModule);
    }

    if (methods.includes('passwordReset')) {
      imports.push(PasswordResetModule);
      providers.push(PasswordResetResolver);
    }

    return {
      module: AuthModule,
      imports,
      providers,
      exports: [IdentityModule, UserModule, ProviderModule, TokenModule, JwtAuthGuard],
    };
  }
}
