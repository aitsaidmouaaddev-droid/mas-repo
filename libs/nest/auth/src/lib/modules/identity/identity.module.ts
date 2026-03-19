import { Module, forwardRef } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { IdentityResolver } from './identity.resolver';
import { UserModule } from '../user/user.module';

@Module({
  imports: [forwardRef(() => UserModule)],
  providers: [IdentityService, IdentityResolver],
  exports: [IdentityService],
})
export class IdentityModule {}
