import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AgendaController } from './agenda.controller';
import { AgendaService } from './agenda.service';
import { AgendaJwtGuard } from './agenda-jwt.guard';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AgendaController],
  providers: [AgendaService, AgendaJwtGuard],
})
export class AgendaModule {}
