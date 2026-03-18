/** Recursive partial — every nested property is optional. */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

/** Sort direction. */
export type SortOrder = 'asc' | 'desc';

/** Single sort field + direction. */
export interface SortOption<T> {
  field: keyof T;
  order: SortOrder;
}

/** Options for a simple list query — no pagination. */
export interface FindOptions<T> {
  filter?: DeepPartial<T>;
  sort?: SortOption<T> | SortOption<T>[];
  limit?: number;
  offset?: number;
}

/** Options for a paginated query. */
export interface FindManyOptions<T> extends FindOptions<T> {
  page: number;
  pageSize: number;
}

/** Paginated result envelope. */
export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Options for cursor-based (keyset) pagination.
 * The cursor is an opaque base64-encoded string representing the last seen
 * value of `cursorField`.  Omit `cursor` to start from the beginning.
 */
export interface CursorOptions<T> {
  /** Opaque cursor returned by a previous {@link CursorPage}. */
  cursor?: string;
  /** Maximum number of items to return. */
  limit: number;
  /** Column to use as the cursor key. Defaults to `'id'`. */
  cursorField?: keyof T;
  /** Optional sort applied alongside the cursor field. */
  sort?: SortOption<T> | SortOption<T>[];
}

/** Result envelope for cursor-based pagination. */
export interface CursorPage<T> {
  items: T[];
  /** Cursor to pass as `cursor` in the next request. `null` when no more pages. */
  nextCursor: string | null;
  hasNext: boolean;
}
