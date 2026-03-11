import { scanMedia } from '@mas/rn/media';
import type { IRepository } from '@mas/frontend-dal';
import type { MediaDecisionRow, MediaItem } from '../store/types';
import { MediaVerdict } from '../store/types';
import type { AppMediaType } from '@mas/rn/media';

/**
 * Public API of the media service.
 *
 * Orchestrates device scanning (via `@mas/rn/media`) and verdict persistence
 * (via an injected `IRepository<MediaDecisionRow>`). No knowledge of databases.
 */
export interface MediaService {
  /** Persist a swipe verdict for a single asset. */
  recordDecision(id: string, verdict: MediaVerdict): Promise<void>;

  /** Load all stored verdicts as an O(1) lookup map. */
  getCategorizedIds(): Promise<Map<string, MediaVerdict>>;

  /** Remove verdict entries for a set of asset IDs. */
  deleteEntries(assetIds: string[]): Promise<void>;

  /**
   * Scan the device gallery and return items pre-categorised into three buckets.
   * Verdicts from the repository are merged in so that previously reviewed
   * items land in the correct bucket immediately.
   */
  performFullScan(limit: number): Promise<{
    unknown: MediaItem[];
    trash:   MediaItem[];
    keep:    MediaItem[];
  }>;
}

/**
 * Creates a {@link MediaService} instance bound to the given repository.
 *
 * @param repo - Any `IRepository<MediaDecisionRow>` implementation.
 *   In production: `mediaLedgerRepository` (SQLite).
 *   In tests: a mock or in-memory implementation.
 */
export function createMediaService(
  repo: IRepository<MediaDecisionRow>,
): MediaService {
  return {
    async recordDecision(id, verdict) {
      await repo.save({ id, verdict });
    },

    async getCategorizedIds() {
      const rows = await repo.getAll();
      const map  = new Map<string, MediaVerdict>();
      rows.forEach((row) => map.set(row.id, row.verdict));
      return map;
    },

    async deleteEntries(assetIds) {
      await repo.deleteMany(assetIds);
    },

    async performFullScan(limit) {
      const [assets, verdictsMap] = await Promise.all([
        scanMedia({ limit }),
        this.getCategorizedIds(),
      ]);

      const result: { unknown: MediaItem[]; trash: MediaItem[]; keep: MediaItem[] } = {
        unknown: [],
        trash:   [],
        keep:    [],
      };

      assets.forEach((asset) => {
        const verdict = verdictsMap.get(asset.id) ?? MediaVerdict.UNKNOWN;
        const item: MediaItem = { ...asset, verdict };

        if (verdict === MediaVerdict.UNKNOWN) result.unknown.push(item);
        else if (verdict === MediaVerdict.TRASH) result.trash.push(item);
        else if (verdict === MediaVerdict.KEEP)  result.keep.push(item);
      });

      return result;
    },
  };
}
