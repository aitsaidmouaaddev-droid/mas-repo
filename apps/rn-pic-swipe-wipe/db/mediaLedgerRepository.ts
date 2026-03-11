import { BaseSQLiteRepository } from '@mas/mas-sqlite';
import type { BindValue } from '@mas/mas-sqlite';
import type { MediaDecisionRow } from '../store/types';

/**
 * Repository that persists and retrieves user swipe decisions in the
 * `media_ledger` SQLite table.
 *
 * Extends {@link BaseSQLiteRepository} from `@mas/mas-sqlite`, which provides
 * generic `save`, `getAll`, and `deleteMany` operations. Only the
 * table-specific configuration and row mapping are defined here.
 *
 * The table schema is declared in `database.config.ts` and applied by
 * `DatabaseManager.mount()` at app startup.
 *
 * @see {@link MediaDecisionRow} for the entity shape
 * @see {@link mediaLedgerRepository} for the singleton instance
 */
export class MediaLedgerRepository extends BaseSQLiteRepository<MediaDecisionRow> {
  /** SQLite table name targeted by all queries. */
  protected tableName = 'media_ledger';

  /** Column names returned by `SELECT` queries. */
  protected selectColumns = ['id', 'verdict'];

  /**
   * Maps a {@link MediaDecisionRow} entity to bind parameters for
   * `INSERT` / `UPDATE`, adding a `scannedAt` Unix-ms timestamp.
   */
  protected toRow(entity: MediaDecisionRow): Record<string, BindValue> {
    return { id: entity.id, verdict: entity.verdict, scannedAt: Date.now() };
  }
}

/**
 * Singleton instance of {@link MediaLedgerRepository}.
 *
 * Import this directly — do not instantiate the class.
 * The underlying connection is shared via `DatabaseManager` and is
 * initialised once in the app root layout.
 *
 * @example
 * ```ts
 * import { mediaLedgerRepository } from '../db/mediaLedgerRepository';
 *
 * await mediaLedgerRepository.save({ id: asset.id, verdict: MediaVerdict.KEEP });
 * const rows = await mediaLedgerRepository.getAll();
 * ```
 */
export const mediaLedgerRepository = new MediaLedgerRepository();
