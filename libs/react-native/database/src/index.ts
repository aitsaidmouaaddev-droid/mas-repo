/**
 * @packageDocumentation
 * @module @mas/rn-database
 *
 * React Native / Expo SQLite infrastructure for the MAS monorepo.
 *
 * Provides the `expo-sqlite` adapter that bridges the generic
 * `ISQLiteAdapter` contract (from `@mas/mas-sqlite`) to the Expo SQLite API.
 *
 * This library is **schema-agnostic** — it has no knowledge of any specific
 * table or column. Concrete repository implementations (e.g.
 * `MediaLedgerRepository`) live at the app level and extend
 * `BaseSQLiteRepository` from `@mas/mas-sqlite`.
 *
 * ## Setup (app root layout)
 * ```ts
 * import { ExpoSQLiteAdapter } from '@mas/rn/database';
 * import { DatabaseManager } from '@mas/mas-sqlite';
 * import { dbConfig } from './database.config';
 *
 * DatabaseManager.mount(dbConfig, new ExpoSQLiteAdapter());
 * ```
 *
 * ## Dependencies
 * - `expo-sqlite` (peer)
 * - `@mas/mas-sqlite` — `ISQLiteAdapter` contract + `DatabaseManager`
 */
export { ExpoSQLiteAdapter } from './sqlite';
