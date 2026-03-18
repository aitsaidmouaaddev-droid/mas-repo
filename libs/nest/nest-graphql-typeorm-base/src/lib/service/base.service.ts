import type { CursorPage, IRepository, Page } from '@mas/db-contracts';

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
  findAll(includeDeleted?: boolean): Promise<T[]>;
  findOne(id: ID, includeDeleted?: boolean): Promise<T | null>;
  findPage(page: number, pageSize: number, includeDeleted?: boolean): Promise<Page<T>>;
  findCursorPage(
    cursor: string | undefined,
    limit: number,
    includeDeleted?: boolean,
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
 * Concrete services extend the returned class, inject their typed repository,
 * and call `super(repo)`.  They inherit all five CRUD methods for free and can
 * override or add domain-specific logic as needed.
 *
 * @typeParam T  - Domain entity type (e.g. `QcmQuestion`).
 * @typeParam I  - Create-input DTO (e.g. `CreateQcmInput`).
 * @typeParam U  - Update-input DTO — must include `id` (e.g. `UpdateQcmInput`).
 * @typeParam ID - Primary-key scalar, defaults to `string`.
 *
 * @example
 * ```ts
 * \@Injectable()
 * export class QcmService extends BaseService<
 *   QcmQuestion,
 *   CreateQcmInput,
 *   UpdateQcmInput
 * >() {
 *   constructor(
 *     \@Inject(QCM_REPO) repo: IRepository<QcmQuestion>,
 *   ) {
 *     super(repo);
 *   }
 *
 *   // All records including soft-deleted:
 *   findAllIncludingDeleted() {
 *     return this.findAll(true);
 *   }
 *
 *   // Domain-specific additions:
 *   findByModule(moduleId: string) {
 *     return this.repo.findMany({ where: { moduleId, isDeleted: false } });
 *   }
 * }
 * ```
 */
export function BaseService<T, I, U extends { id: ID }, ID = string>() {
  abstract class AbstractService implements IBaseService<T, I, U, ID> {
    constructor(readonly repo: IRepository<T, ID>) {}

    /**
     * Returns records where `isDeleted = false` by default.
     * Pass `includeDeleted = true` to retrieve all records.
     */
    findAll(includeDeleted = false): Promise<T[]> {
      if (includeDeleted) return this.repo.findAll();
      return this.repo.filter({ isDeleted: false } as never);
    }

    /**
     * Returns a single active record by primary key, or `null` if not found
     * or soft-deleted.  Pass `includeDeleted = true` to bypass the filter.
     */
    async findOne(id: ID, includeDeleted = false): Promise<T | null> {
      const criteria = includeDeleted ? { id } : { id, isDeleted: false };
      const results = await this.repo.filter(criteria as never, { limit: 1 });
      return results[0] ?? null;
    }

    /**
     * Returns a page of records.  Filters `isDeleted = false` by default.
     * Pass `includeDeleted = true` to include soft-deleted records.
     */
    findPage(page: number, pageSize: number, includeDeleted = false): Promise<Page<T>> {
      const criteria = includeDeleted ? {} : { isDeleted: false };
      return this.repo.paginateFilter(criteria as never, { page, pageSize });
    }

    /**
     * Returns a cursor page of records.  Filters `isDeleted = false` by default.
     * Pass `includeDeleted = true` to include soft-deleted records.
     */
    findCursorPage(
      cursor: string | undefined,
      limit: number,
      includeDeleted = false,
    ): Promise<CursorPage<T>> {
      const criteria = includeDeleted ? {} : { isDeleted: false };
      return this.repo.filterCursor(criteria as never, { cursor, limit });
    }

    /**
     * Persists a new record from the create-input DTO.
     * `isDeleted` defaults to `false` via the column default.
     */
    create(input: I): Promise<T> {
      return this.repo.save(input as unknown as T);
    }

    /**
     * Merges the update-input DTO onto an existing record identified by `id`.
     * The `id` from the argument takes precedence over any `id` in `input`.
     */
    update(id: ID, input: U): Promise<T> {
      return this.repo.save({ ...input, id } as unknown as T);
    }

    /**
     * Soft-deletes the record by setting `isDeleted = true`.
     * The row is NOT physically removed from the database.
     * Subsequent `findAll` / `findOne` calls will exclude it automatically.
     */
    async delete(id: ID): Promise<void> {
      await this.repo.save({ id, isDeleted: true } as unknown as T);
    }
  }

  return AbstractService;
}
