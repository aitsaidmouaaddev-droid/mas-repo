import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { IdentityModule } from './modules/identity/identity.module';
import { UserModule } from './modules/user/user.module';
import { ProviderModule } from './modules/provider/provider.module';
import { TokenModule } from './modules/token/token.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthResolver } from './resolvers/auth.resolver';

@Module({
  imports: [PassportModule, IdentityModule, UserModule, ProviderModule, TokenModule],
  providers: [JwtStrategy, LocalStrategy, JwtAuthGuard, AuthResolver],
  exports: [IdentityModule, UserModule, ProviderModule, TokenModule, JwtAuthGuard],
})
export class AuthModule {}
