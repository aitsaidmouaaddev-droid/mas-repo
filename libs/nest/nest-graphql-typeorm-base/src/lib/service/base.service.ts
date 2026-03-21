import { NotFoundException } from '@nestjs/common';
import type { CursorPage, IRepository, Page } from '@mas/db-contracts';
import type { IdentityContext } from '../identity/identity.context';

/**
 * Shape that every concrete service produced by {@link BaseService} exposes.
 *
 * Resolvers depend on this interface rather than the concrete service class,
 * which keeps the resolver factory generic and avoids circular type references.
 *
 * @typeParam T  - Domain entity type.
 * @typeParam I  - Create-input DTO type.
 * @typeParam U  - Update-input DTO type (must carry `id` so the service knows
 *                what row to update).
 * @typeParam ID - Primary-key type, defaults to `string` (UUID).
 */
export interface IBaseService<T, I, U extends { id: ID }, ID = string> {
  findAll(includeDeleted?: boolean, populate?: string[]): Promise<T[]>;
  findBy(criteria: Record<string, unknown>, includeDeleted?: boolean, populate?: string[]): Promise<T[]>;
  countBy(criteria: Record<string, unknown>, includeDeleted?: boolean): Promise<number>;
  findOne(id: ID, includeDeleted?: boolean, populate?: string[]): Promise<T | null>;
  findPage(page: number, pageSize: number, includeDeleted?: boolean, populate?: string[]): Promise<Page<T>>;
  findCursorPage(
    cursor: string | undefined,
    limit: number,
    includeDeleted?: boolean,
    populate?: string[],
  ): Promise<CursorPage<T>>;
  create(input: I): Promise<T>;
  update(id: ID, input: U): Promise<T>;
  delete(id: ID): Promise<void>;
}

/**
 * Mixin factory that returns an abstract class pre-wired with standard CRUD
 * operations backed by an {@link IRepository}.
 *
 * ## Soft-delete filter
 * `findAll` and `findOne` automatically filter out records where
 * `isDeleted = true`.  Pass `includeDeleted = true` to bypass the filter
 * and retrieve all records including soft-deleted ones.
 *
 * ## Identity scoping (`requiresIdentity = true`)
 * When the flag is `true`, every operation is automatically scoped to the
 * authenticated user's identity:
 * - **Reads** (`findAll`, `findOne`, `findPage`, `findCursorPage`) append
 *   `{ identityId }` to the filter criteria so users only see their own records.
 * - **create** merges `identityId` into the persisted payload.
 * - **update / delete** verify ownership via a scoped `findOne` before
 *   proceeding; throws `NotFoundException` if the record does not belong to
 *   the current user.
 *
 * The identity id is sourced from an injected {@link IdentityContext} which
 * reads `req.user.id` set by the JWT guard.  Subclasses must pass it as the
 * second constructor argument when `requiresIdentity = true`.
 *
 * Concrete services extend the returned class, inject their typed repository,
 * and call `super(repo)` (or `super(repo, identityCtx)` for identity-scoped
 * services).  They inherit all five CRUD methods for free and can override or
 * add domain-specific logic as needed.
 *
 * @typeParam T  - Domain entity type (e.g. `QcmQuestion`).
 * @typeParam I  - Create-input DTO (e.g. `CreateQcmInput`).
 * @typeParam U  - Update-input DTO — must include `id` (e.g. `UpdateQcmInput`).
 * @typeParam ID - Primary-key scalar, defaults to `string`.
 *
 * @param requiresIdentity - When `true`, all operations are scoped to the
 *   current user's `identityId`.  Default: `false`.
 *
 * @example Non-identity service (catalog data, public content)
 * ```ts
 * \@Injectable()
 * export class QcmModuleService extends BaseService<
 *   QcmModule,
 *   CreateQcmModuleInput,
 *   UpdateQcmModuleInput
 * >() {
 *   constructor(\@Inject(QCM_MODULE_REPO) repo: IRepository<QcmModule>) {
 *     super(repo);
 *   }
 * }
 * ```
 *
 * @example Identity-scoped service (user sessions, progress)
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
/**
 * Builds the filter criteria object used by every repository call.
 *
 * @param requiresIdentity - Whether the current service requires identity scoping.
 * @param identityCtx      - The injected {@link IdentityContext}; must be present
 *                           when `requiresIdentity` is `true`.
 * @param includeDeleted   - When `false` (default), appends `isDeleted: false`
 *                           to exclude soft-deleted records.
 */
function resolveScope(
  requiresIdentity: boolean,
  identityCtx: IdentityContext | undefined,
  includeDeleted = false,
): Record<string, unknown> {
  const scope: Record<string, unknown> = {};

  if (!includeDeleted) scope['isDeleted'] = false;

  if (!requiresIdentity) return scope;

  if (!identityCtx) {
    throw new Error(
      'BaseService: requiresIdentity=true but IdentityContext was not passed to super()',
    );
  }
  scope['userId'] = identityCtx.userId;
  return scope;
}

export function BaseService<T, I, U extends { id: ID }, ID = string>(
  requiresIdentity = false,
) {
  abstract class AbstractService implements IBaseService<T, I, U, ID> {
    constructor(
      readonly repo: IRepository<T, ID>,
      readonly identityCtx?: IdentityContext,
    ) {}

    /**
     * Returns records where `isDeleted = false` by default.
     * When `requiresIdentity = true`, automatically filters by the current user.
     * Pass `includeDeleted = true` to retrieve all records.
     */
    findAll(includeDeleted = false, populate: string[] = []): Promise<T[]> {
      return this.repo.filter(
        resolveScope(requiresIdentity, this.identityCtx, includeDeleted) as never,
        { populate },
      );
    }

    findBy(criteria: Record<string, unknown>, includeDeleted = false, populate: string[] = []): Promise<T[]> {
      const scope = resolveScope(requiresIdentity, this.identityCtx, includeDeleted);
      return this.repo.filter({ ...criteria, ...scope } as never, { populate });
    }

    countBy(criteria: Record<string, unknown>, includeDeleted = false): Promise<number> {
      const scope = resolveScope(requiresIdentity, this.identityCtx, includeDeleted);
      return this.repo.count({ ...criteria, ...scope } as never);
    }

    async findOne(id: ID, includeDeleted = false, populate: string[] = []): Promise<T | null> {
      const criteria = { id, ...resolveScope(requiresIdentity, this.identityCtx, includeDeleted) };
      const results = await this.repo.filter(criteria as never, { limit: 1, populate });
      return results[0] ?? null;
    }

    findPage(page: number, pageSize: number, includeDeleted = false, populate: string[] = []): Promise<Page<T>> {
      return this.repo.paginateFilter(
        resolveScope(requiresIdentity, this.identityCtx, includeDeleted) as never,
        { page, pageSize, populate },
      );
    }

    findCursorPage(
      cursor: string | undefined,
      limit: number,
      includeDeleted = false,
      populate: string[] = [],
    ): Promise<CursorPage<T>> {
      return this.repo.filterCursor(
        resolveScope(requiresIdentity, this.identityCtx, includeDeleted) as never,
        { cursor, limit, populate },
      );
    }

    /**
     * Persists a new record from the create-input DTO.
     * When `requiresIdentity = true`, automatically merges `identityId` into
     * the persisted payload.
     */
    create(input: I): Promise<T> {
      // includeDeleted=true so we don't inject isDeleted:false into the INSERT payload
      const scope = resolveScope(requiresIdentity, this.identityCtx, true);
      const payload = requiresIdentity ? { ...(input as object), ...scope } : input;
      return this.repo.save(payload as unknown as T);
    }

    /**
     * Merges the update-input DTO onto an existing record identified by `id`.
     * When `requiresIdentity = true`, verifies ownership via a scoped `findOne`
     * before updating — throws `NotFoundException` if the record does not belong
     * to the current user.
     */
    async update(id: ID, input: U): Promise<T> {
      if (requiresIdentity) {
        const existing = await this.findOne(id);
        if (!existing) throw new NotFoundException(`Record ${String(id)} not found`);
      }
      return this.repo.save({ ...input, id } as unknown as T);
    }

    /**
     * Soft-deletes the record by setting `isDeleted = true`.
     * When `requiresIdentity = true`, verifies ownership via a scoped `findOne`
     * before soft-deleting — throws `NotFoundException` if the record does not
     * belong to the current user.
     * The row is NOT physically removed from the database.
     */
    async delete(id: ID): Promise<void> {
      if (requiresIdentity) {
        const existing = await this.findOne(id);
        if (!existing) throw new NotFoundException(`Record ${String(id)} not found`);
      }
      await this.repo.save({ id, isDeleted: true } as unknown as T);
    }
  }

  return AbstractService;
}
