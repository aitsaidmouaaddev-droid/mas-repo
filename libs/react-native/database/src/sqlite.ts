import * as SQLite from 'expo-sqlite';
import type { BindValue, ISQLiteAdapter } from '@mas/mas-sqlite';

/**
 * Concrete `expo-sqlite` driver that satisfies the `ISQLiteAdapter` contract
 * defined in `@mas/mas-sqlite`.
 *
 * Wrap an instance of this class and pass it to `DatabaseManager.mount()` in
 * the app's root layout (`apps/rn-pic-swipe-wipe/app/_layout.tsx`) so that
 * every `BaseSQLiteRepository` in the project — including
 * {@link MediaLedgerRepository} — shares the same open database connection.
 *
 * @example
 * ```tsx
 * // app/_layout.tsx
 * import { ExpoSQLiteAdapter } from '@mas/rn/database';
 * import { DatabaseManager } from '@mas/mas-sqlite';
 *
 * DatabaseManager.mount(new ExpoSQLiteAdapter());
 * await DatabaseManager.open('media.db');
 * ```
 *
 * @see {@link MediaLedgerRepository} for the repository built on top of this adapter
 * @see {@link https://docs.expo.dev/versions/latest/sdk/sqlite/ expo-sqlite docs}
 */
export class ExpoSQLiteAdapter implements ISQLiteAdapter {
  /** Underlying `expo-sqlite` database handle. `null` until {@link open} is called. */
  private _db: SQLite.SQLiteDatabase | null = null;

  /**
   * Opens (or creates) an SQLite database file with the given name.
   *
   * Must be called before any other method. Calling any query method before
   * `open()` will throw a descriptive error.
   *
   * @param name - Database filename (e.g. `"media.db"`). Stored in the app's
   *   document directory on the device.
   */
  async open(name: string): Promise<void> {
    this._db = await SQLite.openDatabaseAsync(name);
  }

  /**
   * Returns the open database handle, or throws if {@link open} has not been called.
   *
   * @throws {Error} When `open()` has not been called yet.
   */
  private get db(): SQLite.SQLiteDatabase {
    if (!this._db) throw new Error('ExpoSQLiteAdapter: call open() before use');
    return this._db;
  }

  /**
   * Executes one or more SQL statements that return no rows (e.g. `CREATE TABLE`,
   * `DROP TABLE`, multi-statement migrations).
   *
   * @param sql - Raw SQL string, may contain multiple statements separated by `;`.
   */
  async exec(sql: string): Promise<void> {
    await this.db.execAsync(sql);
  }

  /**
   * Executes a single parameterised DML statement (`INSERT`, `UPDATE`, `DELETE`).
   *
   * @param sql    - Parameterised SQL with `?` placeholders.
   * @param params - Ordered list of values to bind to the `?` placeholders.
   *   Defaults to an empty array.
   */
  async run(sql: string, params: BindValue[] = []): Promise<void> {
    await this.db.runAsync(sql, params);
  }

  /**
   * Executes a `SELECT` and returns the **first matching row**, or `null`
   * if no row matches.
   *
   * @typeParam T - Expected shape of the returned row.
   * @param sql    - Parameterised `SELECT` statement.
   * @param params - Ordered bind values. Defaults to an empty array.
   * @returns The first row cast to `T`, or `null`.
   */
  async getFirst<T>(sql: string, params: BindValue[] = []): Promise<T | null> {
    const result = await this.db.getFirstAsync<T>(sql, params);
    return result ?? null;
  }

  /**
   * Executes a `SELECT` and returns **all matching rows** as an array.
   *
   * @typeParam T - Expected shape of each returned row.
   * @param sql    - Parameterised `SELECT` statement.
   * @param params - Ordered bind values. Defaults to an empty array.
   * @returns Array of rows cast to `T`. Empty array if no rows match.
   */
  async getAll<T>(sql: string, params: BindValue[] = []): Promise<T[]> {
    return this.db.getAllAsync<T>(sql, params);
  }
}
