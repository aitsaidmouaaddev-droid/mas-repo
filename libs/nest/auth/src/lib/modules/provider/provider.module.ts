import { Module } from '@nestjs/common';
import { IdentityModule } from '../identity/identity.module';
import { ProviderService } from './provider.service';

@Module({
  imports: [IdentityModule],
  providers: [ProviderService],
  exports: [ProviderService],
})
export class ProviderModule {}
