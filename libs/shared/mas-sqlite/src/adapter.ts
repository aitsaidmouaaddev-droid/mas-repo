/**
 * SQLite value types accepted as bind parameters.
 * Matches the common denominator across all SQLite drivers.
 */
export type BindValue = string | number | null;

/**
 * Driver interface that any SQLite implementation must satisfy.
 *
 * Implement this for each platform/driver:
 *   - React Native  → ExpoSQLiteAdapter  (expo-sqlite)
 *   - Browser/Node  → SqlJsAdapter       (sql.js)
 *   - Electron/Node → BetterSqliteAdapter (better-sqlite3)
 */
export interface ISQLiteAdapter {
  /**
   * Open or create the database file identified by `name`.
   * Called once by DatabaseManager during mount.
   */
  open(name: string): Promise<void>;

  /** Execute raw SQL with no return value (PRAGMA, CREATE TABLE…). */
  exec(sql: string): Promise<void>;

  /** Execute a parameterised mutation (INSERT / UPDATE / DELETE). */
  run(sql: string, params?: BindValue[]): Promise<void>;

  /** Return the first row matching the query, or null if empty. */
  getFirst<T>(sql: string, params?: BindValue[]): Promise<T | null>;

  /** Return all rows matching the query. */
  getAll<T>(sql: string, params?: BindValue[]): Promise<T[]>;
}
