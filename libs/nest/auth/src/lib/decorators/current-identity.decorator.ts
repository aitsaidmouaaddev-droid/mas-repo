import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { Identity } from '../modules/identity/identity.entity';

/**
 * Injects the authenticated {@link Identity} into a resolver or controller method.
 * Works for both REST and GraphQL contexts.
 */
export const CurrentIdentity = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): Identity => {
    if (ctx.getType<string>() === 'graphql') {
      return GqlExecutionContext.create(ctx).getContext<{ req: { user: Identity } }>().req.user;
    }
    return ctx.switchToHttp().getRequest<{ user: Identity }>().user;
  },
);
