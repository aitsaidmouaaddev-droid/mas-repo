/**
 * @packageDocumentation
 * @module @mas/mas-sqlite
 *
 * Platform-agnostic SQLite infrastructure for the MAS monorepo.
 *
 * Provides:
 * - {@link ISQLiteAdapter} — driver contract (implement per platform)
 * - {@link DatabaseManager} — singleton connection lifecycle manager
 * - {@link BaseSQLiteRepository} — abstract CRUD base class over any adapter
 * - Schema types: {@link DatabaseConfig}, {@link TableSchema}, {@link ColumnDef}
 *
 * Platform adapters (implement {@link ISQLiteAdapter}):
 * - React Native / Expo → `ExpoSQLiteAdapter` in `@mas/rn/database`
 * - Browser / Node → implement your own (sql.js, better-sqlite3, etc.)
 *
 * ## Setup (app root)
 * ```ts
 * import { ExpoSQLiteAdapter } from '@mas/rn/database';
 * import { DatabaseManager } from '@mas/mas-sqlite';
 *
 * await DatabaseManager.mount(dbConfig, new ExpoSQLiteAdapter());
 * ```
 *
 * After `mount()` resolves, any {@link BaseSQLiteRepository} subclass will
 * automatically wait for the adapter via {@link DatabaseManager.ensureReady}.
 */
export type { BindValue, ISQLiteAdapter } from './adapter';
export type { ColumnType, ColumnDef, TableSchema, DatabaseConfig } from './schema';
export { DatabaseManager } from './manager';
export { BaseSQLiteRepository } from './repository';
