import { BaseSQLiteRepository } from '@mas/mas-sqlite';
import type { BindValue } from '@mas/mas-sqlite';
import type { MediaDecisionRow } from '@mas/react-shared';

export class MediaLedgerRepository extends BaseSQLiteRepository<MediaDecisionRow> {
  protected tableName = 'media_ledger';
  protected selectColumns = ['id', 'verdict'];

  protected toRow(entity: MediaDecisionRow): Record<string, BindValue> {
    return { id: entity.id, verdict: entity.verdict, scannedAt: Date.now() };
  }
}

export const mediaLedgerRepository = new MediaLedgerRepository();
