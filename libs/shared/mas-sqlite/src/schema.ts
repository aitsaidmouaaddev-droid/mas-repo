/**
 * @module schema
 * Schema definition types used by {@link DatabaseManager} to create tables.
 *
 * @see {@link DatabaseManager.mount} — consumes {@link DatabaseConfig}
 */

/** SQLite column affinity types. */
export type ColumnType = 'TEXT' | 'INTEGER' | 'REAL' | 'BLOB' | 'NUMERIC';

export interface ColumnDef {
  name: string;
  type: ColumnType;
  primaryKey?: boolean;
  notNull?: boolean;
  unique?: boolean;
  /** Raw SQL default expression, e.g. "0" or "'unknown'". */
  default?: string;
}

export interface TableSchema {
  name: string;
  columns: ColumnDef[];
}

export interface DatabaseConfig {
  /** SQLite file name, e.g. "myApp.db". Each app defines its own. */
  name: string;
  tables: TableSchema[];
  /**
   * SQLite PRAGMA statements applied at connect time (without the PRAGMA keyword).
   * e.g. ['journal_mode = WAL', 'foreign_keys = ON']
   */
  pragmas?: string[];
}
