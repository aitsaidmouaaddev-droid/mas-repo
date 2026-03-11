/**
 * @module query
 * Pagination, sorting, and filtering types for {@link IReadRepository}.
 *
 * Platform-agnostic — usable from React, Angular, Vue, React Native, etc.
 *
 * @see {@link IReadRepository} — consumer of these types
 */

// ---------------------------------------------------------------------------
// Sorting
// ---------------------------------------------------------------------------

/** Sort order for a repository query. */
export type SortDirection = 'asc' | 'desc';

/**
 * A single sort parameter specifying a field and direction.
 * @typeParam T - Entity type; `field` is constrained to `keyof T`.
 */
export interface SortParam<T> {
  field: keyof T;
  direction: SortDirection;
}

// ---------------------------------------------------------------------------
// Pagination — page-based
// ---------------------------------------------------------------------------

/** Parameters for page-based (offset) pagination. */
export interface PageParams {
  /** 1-based page number. */
  page: number;
  /** Number of items per page. */
  pageSize: number;
  sort?: SortParam<unknown>[];
}

/** Result envelope for a page-based query. */
export interface PageResult<T> {
  items: T[];
  /** Total number of matching entities across all pages. */
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

// ---------------------------------------------------------------------------
// Pagination — cursor-based (infinite scroll / feeds)
// ---------------------------------------------------------------------------

/** Parameters for cursor-based (keyset) pagination — ideal for infinite scroll and feeds. */
export interface CursorParams {
  /** Opaque cursor returned by the previous page. Omit for the first page. */
  cursor?: string;
  /** Maximum number of items to return. */
  limit: number;
  sort?: SortParam<unknown>[];
}

/** Result envelope for a cursor-based query. */
export interface CursorResult<T> {
  items: T[];
  /** Cursor pointing to the next page; `undefined` when `hasMore` is `false`. */
  nextCursor?: string;
  hasMore: boolean;
}

// ---------------------------------------------------------------------------
// Filtering
// ---------------------------------------------------------------------------

/**
 * Comparison operators for a single field value of type `V`.
 * Use these instead of an exact value when you need range or membership tests.
 * @typeParam V - The field's value type.
 */
export interface FieldOperators<V> {
  /** Exact match: `field = value`. */
  eq?: V;
  /** Inequality: `field != value`. */
  ne?: V;
  /** Greater than: `field > value`. */
  gt?: V;
  /** Greater than or equal: `field >= value`. */
  gte?: V;
  /** Less than: `field < value`. */
  lt?: V;
  /** Less than or equal: `field <= value`. */
  lte?: V;
  /** Membership: `field IN (values)`. */
  in?: V[];
  notIn?: V[];
  /** String contains (case-insensitive). Translates to `LIKE %value%`. */
  contains?: string;
  startsWith?: string;
  endsWith?: string;
}

/** Per-field filter: exact match or operator object */
export type FieldFilter<V> = V | FieldOperators<V>;

/** Filter criteria: subset of entity fields, each with optional operators */
export type FilterCriteria<T> = {
  [K in keyof T]?: FieldFilter<T[K]>;
};
