import type { DatabaseConfig } from '@mas/mas-sqlite';

/**
 * pic-swipe-wipe database configuration.
 *
 * Passed to DatabaseManager.mount() at app startup.
 * Add new tables here as the app grows — DatabaseManager handles
 * CREATE TABLE IF NOT EXISTS automatically.
 */
export const dbConfig: DatabaseConfig = {
  name: 'picSwipeWipe.db',
  pragmas: ['journal_mode = WAL'],
  tables: [
    {
      name: 'media_ledger',
      columns: [
        { name: 'id', type: 'TEXT', primaryKey: true, notNull: true },
        { name: 'verdict', type: 'TEXT', notNull: true },
        { name: 'scannedAt', type: 'INTEGER', notNull: true },
      ],
    },
  ],
};
