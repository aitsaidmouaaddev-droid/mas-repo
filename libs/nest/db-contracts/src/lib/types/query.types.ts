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
