import { Module } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { IdentityResolver } from './identity.resolver';

@Module({
  providers: [IdentityService, IdentityResolver],
  exports: [IdentityService],
})
export class IdentityModule {}
