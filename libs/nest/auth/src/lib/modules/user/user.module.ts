import { Module, forwardRef } from '@nestjs/common';
import { IdentityModule } from '../identity/identity.module';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';

@Module({
  imports: [forwardRef(() => IdentityModule)],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
