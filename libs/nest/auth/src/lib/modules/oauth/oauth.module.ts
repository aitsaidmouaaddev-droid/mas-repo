import { Module } from '@nestjs/common';
import { IdentityModule } from '../identity/identity.module';
import { UserModule } from '../user/user.module';
import { ProviderModule } from '../provider/provider.module';
import { TokenModule } from '../token/token.module';
import { GoogleStrategy } from '../../strategies/google.strategy';
import { OAuthController } from './oauth.controller';

@Module({
  imports: [IdentityModule, UserModule, ProviderModule, TokenModule],
  providers: [GoogleStrategy],
  controllers: [OAuthController],
})
export class OAuthModule {}
