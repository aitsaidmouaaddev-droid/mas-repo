/**
 * @module manager
 * Database lifecycle manager for the `@mas/mas-sqlite` package.
 *
 * @see {@link DatabaseManager} — the singleton that manages the adapter
 * @see {@link ISQLiteAdapter} — the driver contract
 * @see {@link DatabaseConfig} — the configuration passed to {@link DatabaseManager.mount}
 */
import type { ISQLiteAdapter } from './adapter';
import type { ColumnDef, DatabaseConfig } from './schema';

function buildCreateTableSql(name: string, columns: ColumnDef[]): string {
  const defs = columns.map((col) => {
    let def = `${col.name} ${col.type}`;
    if (col.primaryKey) def += ' PRIMARY KEY';
    if (col.notNull) def += ' NOT NULL';
    if (col.unique) def += ' UNIQUE';
    if (col.default !== undefined) def += ` DEFAULT ${col.default}`;
    return def;
  });
  return `CREATE TABLE IF NOT EXISTS ${name} (${defs.join(', ')});`;
}

/**
 * Manages the SQLite connection lifecycle for an app.
 *
 * Usage (once, at app startup):
 *   await DatabaseManager.mount(dbConfig, new ExpoSQLiteAdapter());
 *
 * After that, any BaseSQLiteRepository method will automatically wait for the
 * adapter to be ready via DatabaseManager.ensureReady().
 */
export class DatabaseManager {
  private static _adapter: ISQLiteAdapter | null = null;
  private static _resolve: (() => void) | null = null;
  private static _ready: Promise<void> = new Promise((resolve) => {
    DatabaseManager._resolve = resolve;
  });

  /**
   * Open the database, apply pragmas, create tables, and mark the manager ready.
   * Call this once in your root layout / app entry point.
   */
  static async mount(config: DatabaseConfig, adapter: ISQLiteAdapter): Promise<void> {
    await adapter.open(config.name);

    // Apply pragmas
    if (config.pragmas?.length) {
      const pragmaSql = config.pragmas.map((p) => `PRAGMA ${p};`).join('\n');
      await adapter.exec(pragmaSql);
    }

    // Create tables
    for (const table of config.tables) {
      await adapter.exec(buildCreateTableSql(table.name, table.columns));
    }

    DatabaseManager._adapter = adapter;
    DatabaseManager._resolve?.();
  }

  /**
   * Returns the adapter, waiting for mount to complete if it hasn't yet.
   * Called internally by BaseSQLiteRepository — not needed in app code.
   */
  static async ensureReady(): Promise<ISQLiteAdapter> {
    await DatabaseManager._ready;
    return DatabaseManager._adapter!;
  }
}
