import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { AgendaService } from './agenda.service';

@Injectable()
export class AgendaJwtGuard implements CanActivate {
  constructor(private readonly agendaService: AgendaService) {}

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<Request>();
    const authHeader = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing agenda token');
    }
    const token = authHeader.slice(7);
    if (!this.agendaService.validateToken(token)) {
      throw new UnauthorizedException('Invalid or expired agenda token');
    }
    return true;
  }
}
