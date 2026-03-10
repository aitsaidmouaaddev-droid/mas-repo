/**
 * Pagination & filtering types for the frontend DAL.
 * Platform-agnostic — usable from React, Angular, Vue, React Native, etc.
 */

// ---------------------------------------------------------------------------
// Sorting
// ---------------------------------------------------------------------------

export type SortDirection = 'asc' | 'desc';

export interface SortParam<T> {
  field: keyof T;
  direction: SortDirection;
}

// ---------------------------------------------------------------------------
// Pagination — page-based
// ---------------------------------------------------------------------------

export interface PageParams {
  /** 1-based page number */
  page: number;
  pageSize: number;
  sort?: SortParam<unknown>[];
}

export interface PageResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

// ---------------------------------------------------------------------------
// Pagination — cursor-based (infinite scroll / feeds)
// ---------------------------------------------------------------------------

export interface CursorParams {
  cursor?: string;
  limit: number;
  sort?: SortParam<unknown>[];
}

export interface CursorResult<T> {
  items: T[];
  nextCursor?: string;
  hasMore: boolean;
}

// ---------------------------------------------------------------------------
// Filtering
// ---------------------------------------------------------------------------

export interface FieldOperators<V> {
  eq?: V;
  ne?: V;
  gt?: V;
  gte?: V;
  lt?: V;
  lte?: V;
  in?: V[];
  notIn?: V[];
  /** String contains (case-insensitive) */
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
