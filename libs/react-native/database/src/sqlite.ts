import * as SQLite from 'expo-sqlite';
import type { BindValue, ISQLiteAdapter } from '@mas/mas-sqlite';

/**
 * expo-sqlite driver for @mas/mas-sqlite.
 *
 * Pass an instance to DatabaseManager.mount() in the app's root layout.
 * Every BaseSQLiteRepository in the app will use this adapter transparently.
 */
export class ExpoSQLiteAdapter implements ISQLiteAdapter {
  private _db: SQLite.SQLiteDatabase | null = null;

  async open(name: string): Promise<void> {
    this._db = await SQLite.openDatabaseAsync(name);
  }

  private get db(): SQLite.SQLiteDatabase {
    if (!this._db) throw new Error('ExpoSQLiteAdapter: call open() before use');
    return this._db;
  }

  async exec(sql: string): Promise<void> {
    await this.db.execAsync(sql);
  }

  async run(sql: string, params: BindValue[] = []): Promise<void> {
    await this.db.runAsync(sql, params);
  }

  async getFirst<T>(sql: string, params: BindValue[] = []): Promise<T | null> {
    const result = await this.db.getFirstAsync<T>(sql, params);
    return result ?? null;
  }

  async getAll<T>(sql: string, params: BindValue[] = []): Promise<T[]> {
    return this.db.getAllAsync<T>(sql, params);
  }
}
