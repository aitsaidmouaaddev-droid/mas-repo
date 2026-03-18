import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdentityModule } from '../identity/identity.module';
import { IdentityProvider } from './identity-provider.entity';
import { ProviderService } from './provider.service';

/**
 * Manages the link between identities and auth providers (LOCAL, GOOGLE…).
 *
 * Depends on {@link IdentityModule} for the `Identity` entity.
 * Exports {@link ProviderService} so `AuthService` can call `validateOrCreate`.
 */
@Module({
  imports: [IdentityModule, TypeOrmModule.forFeature([IdentityProvider])],
  providers: [ProviderService],
  exports: [ProviderService],
})
export class ProviderModule {}
