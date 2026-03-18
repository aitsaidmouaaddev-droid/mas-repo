import type {
  CursorOptions,
  CursorPage,
  DeepPartial,
  FindManyOptions,
  FindOptions,
  Page,
} from '../types/query.types';

/** Read-only contract for any data store. */
export interface IReadRepository<T, ID = string> {
  // ─── By ID ─────────────────────────────────────────────────────────────────

  /** Fetch a single entity by its primary key. Returns `null` when not found. */
  findById(id: ID): Promise<T | null>;

  /** Whether a record with the given primary key exists. */
  exists(id: ID): Promise<boolean>;

  // ─── List / filter ─────────────────────────────────────────────────────────

  /** Fetch all records, optionally narrowed by filter / sort / limit / offset. */
  findAll(options?: FindOptions<T>): Promise<T[]>;

  /**
   * Fetch all records matching `criteria`.
   * Convenience alias for `findAll({ filter: criteria, ...options })`.
   */
  filter(criteria: DeepPartial<T>, options?: Omit<FindOptions<T>, 'filter'>): Promise<T[]>;

  /** Total number of records, optionally narrowed by a filter. */
  count(filter?: DeepPartial<T>): Promise<number>;

  // ─── Page-based pagination ──────────────────────────────────────────────────

  /** Paginate all records (no filter). */
  findMany(options: FindManyOptions<T>): Promise<Page<T>>;

  /**
   * Filter + page-based pagination combined.
   * Convenience alias for `findMany({ filter: criteria, ...options })`.
   */
  paginateFilter(
    criteria: DeepPartial<T>,
    options: Omit<FindManyOptions<T>, 'filter'>,
  ): Promise<Page<T>>;

  // ─── Cursor-based pagination ────────────────────────────────────────────────

  /** Cursor-based (keyset) pagination over all records. */
  findCursor(options: CursorOptions<T>): Promise<CursorPage<T>>;

  /**
   * Filter + cursor-based pagination combined.
   */
  filterCursor(criteria: DeepPartial<T>, options: CursorOptions<T>): Promise<CursorPage<T>>;
}
