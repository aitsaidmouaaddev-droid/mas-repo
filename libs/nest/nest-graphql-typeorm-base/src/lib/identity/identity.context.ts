import { Inject, Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

interface RequestWithUser {
  user?: { userId?: string };
}

/**
 * Request-scoped context that exposes the current authenticated identity's id.
 *
 * Inject this into any service that extends `BaseService(true)` so that all
 * CRUD operations are automatically scoped to the authenticated user.
 *
 * The `id` is read from `req.user.id`, which is set by the JWT auth guard
 * before the resolver executes.
 *
 * @example
 * ```ts
 * \@Injectable({ scope: Scope.REQUEST })
 * export class QcmSessionService extends BaseService<
 *   QcmSession,
 *   CreateQcmSessionInput,
 *   UpdateQcmSessionInput
 * >(true) {
 *   constructor(
 *     \@Inject(QCM_SESSION_REPO) repo: IRepository<QcmSession>,
 *     identityCtx: IdentityContext,
 *   ) {
 *     super(repo, identityCtx);
 *   }
 * }
 * ```
 */
@Injectable({ scope: Scope.REQUEST })
export class IdentityContext {
  constructor(@Inject(REQUEST) private readonly req: RequestWithUser) {}

  /**
   * Returns the current user's id.
   * Throws {@link UnauthorizedException} if no authenticated user is on the request.
   */
  get userId(): string {
    const id = this.req?.user?.userId;
    if (!id) throw new UnauthorizedException('No authenticated user on request');
    return id;
  }
}
