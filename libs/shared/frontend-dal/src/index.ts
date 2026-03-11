/**
 * @packageDocumentation
 * @module @mas/frontend-dal
 *
 * Platform-agnostic repository interfaces and query types for the MAS monorepo.
 *
 * Provides a **database-agnostic contract** that any data layer implementation
 * must satisfy. Concrete implementations (e.g. {@link BaseSQLiteRepository} in
 * `@mas/mas-sqlite`) depend on this package; application code depends on the
 * interfaces — not on the driver.
 *
 * Works with React, React Native, Angular, Vue, Node.js — any environment.
 *
 * ## Exports
 *
 * ### Query types
 * - {@link SortDirection}, {@link SortParam} — sorting
 * - {@link PageParams}, {@link PageResult} — page-based pagination
 * - {@link CursorParams}, {@link CursorResult} — cursor-based pagination
 * - {@link FieldOperators}, {@link FieldFilter}, {@link FilterCriteria} — filtering
 *
 * ### Repository interfaces
 * - {@link IReadRepository} — read-only data access
 * - {@link IWriteRepository} — write operations
 * - {@link IRepository} — full CRUD (extends both above)
 *
 * ## Usage
 * ```ts
 * import type { IRepository, FilterCriteria, PageParams } from '@mas/frontend-dal';
 * ```
 *
 * This package has **no runtime code** — it is types-only.
 */
export type {
  SortDirection,
  SortParam,
  PageParams,
  PageResult,
  CursorParams,
  CursorResult,
  FieldOperators,
  FieldFilter,
  FilterCriteria,
} from './query';

export type {
  IReadRepository,
  IWriteRepository,
  IRepository,
} from './repository';
