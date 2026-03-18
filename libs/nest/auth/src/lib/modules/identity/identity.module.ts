import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Identity } from './identity.entity';
import { IdentityService } from './identity.service';
import { IdentityResolver } from './identity.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Identity])],
  providers: [IdentityService, IdentityResolver],
  exports: [IdentityService, TypeOrmModule],
})
export class IdentityModule {}
