import type { ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import type { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * Global JWT guard — applies to every route and resolver by default.
 *
 * Routes/resolvers decorated with {@link Public} are skipped entirely.
 * Handles both REST (`Authorization: Bearer <token>`) and GraphQL
 * (same header, extracted from the GraphQL execution context).
 *
 * Register globally in your AppModule:
 * ```ts
 * providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }]
 * ```
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  override canActivate(ctx: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (isPublic) return true;
    return super.canActivate(ctx);
  }

  /** Extract request from GraphQL context so Passport can read the JWT. */
  override getRequest(ctx: ExecutionContext): unknown {
    if (ctx.getType<string>() === 'graphql') {
      return GqlExecutionContext.create(ctx).getContext<{ req: unknown }>().req;
    }
    return ctx.switchToHttp().getRequest();
  }
}
