import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { AuthenticatedPrincipal } from '../strategies/jwt.strategy';

/**
 * Injects the authenticated {@link AuthenticatedPrincipal} into a resolver or
 * controller method. Works for both REST and GraphQL contexts.
 *
 * The principal extends {@link Identity} and additionally exposes `userId`
 * (the `User` table primary key) injected by the JWT strategy.
 */
export const CurrentIdentity = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedPrincipal => {
    if (ctx.getType<string>() === 'graphql') {
      return GqlExecutionContext.create(ctx)
        .getContext<{ req: { user: AuthenticatedPrincipal } }>().req.user;
    }
    return ctx.switchToHttp().getRequest<{ user: AuthenticatedPrincipal }>().user;
  },
);
