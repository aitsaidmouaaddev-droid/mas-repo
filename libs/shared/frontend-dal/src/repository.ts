/**
 * @module repository
 * Repository interfaces for the frontend DAL.
 *
 * Depend on these interfaces in application code; never on a concrete adapter.
 *
 * @see {@link IRepository} — full CRUD (most common dependency)
 * @see {@link IReadRepository} — read-only access
 * @see {@link IWriteRepository} — write operations
 */
import type { CursorParams, CursorResult, FilterCriteria, PageParams, PageResult } from './query';

/**
 * Read-only operations.
 * Implement this when a data source is read-only from the frontend's perspective.
 */
export interface IReadRepository<T, ID = string> {
  /** Fetch a single entity by its identifier. Returns null when not found. */
  getById(id: ID): Promise<T | null>;

  /** Fetch every entity (use with caution on large datasets). */
  getAll(): Promise<T[]>;

  /** Page-based pagination. */
  paginate(params: PageParams): Promise<PageResult<T>>;

  /** Cursor-based pagination (infinite scroll / feeds). */
  paginateCursor(params: CursorParams): Promise<CursorResult<T>>;

  /** Return all entities matching the given criteria. */
  filter(criteria: FilterCriteria<T>): Promise<T[]>;

  /** Filtered + page-based pagination combined. */
  paginateFilter(criteria: FilterCriteria<T>, params: PageParams): Promise<PageResult<T>>;

  /** Filtered + cursor-based pagination combined. */
  paginateFilterCursor(criteria: FilterCriteria<T>, params: CursorParams): Promise<CursorResult<T>>;
}

/**
 * Write operations.
 * Implement this when a data source accepts mutations.
 */
export interface IWriteRepository<T, ID = string> {
  /**
   * Persist a new entity.
   * Pass the full entity including `id` when the caller owns the identifier
   * (e.g. external media IDs, client-generated UUIDs); omit `id` otherwise.
   */
  save(entity: T | Omit<T, 'id'>): Promise<T>;

  /** Partially update an existing entity. */
  update(id: ID, partial: Partial<Omit<T, 'id'>>): Promise<T>;

  /** Remove a single entity. */
  delete(id: ID): Promise<void>;

  /** Remove multiple entities in one call. */
  deleteMany(ids: ID[]): Promise<void>;
}

/**
 * Full CRUD repository — the most common interface to depend on.
 */
export interface IRepository<T, ID = string>
  extends IReadRepository<T, ID>,
    IWriteRepository<T, ID> {}
