import { Module } from '@nestjs/common';
import { IdentityModule } from '../identity/identity.module';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';

@Module({
  imports: [IdentityModule],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
