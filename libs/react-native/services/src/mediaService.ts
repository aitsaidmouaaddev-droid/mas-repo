/**
 * @file mediaService.ts
 * @description Orchestrates media scanning and verdict persistence.
 *              Persistence is delegated to MediaLedgerRepository (IRepository).
 */
import * as MediaLibrary from 'expo-media-library';
import { mediaLedgerRepository } from '@mas/rn/database';
import {
  AppMediaType,
  MediaItem,
  AppPermissionStatus,
  MediaDecisionRow,
  MediaVerdict,
} from '@mas/react-shared';

export { AppMediaType, AppPermissionStatus, MediaVerdict };
export type { MediaItem, MediaDecisionRow };

const mediaService = {
  /**
   * Record a swipe verdict for a media asset.
   */
  async recordDecision(id: string, verdict: MediaVerdict): Promise<void> {
    await mediaLedgerRepository.save({ id, verdict });
  },

  /**
   * Return all processed media IDs as a Map for O(1) lookup during scanning.
   */
  async getCategorizedIds(): Promise<Map<string, MediaVerdict>> {
    const rows = await mediaLedgerRepository.getAll();
    const map = new Map<string, MediaVerdict>();
    rows.forEach((row) => map.set(row.id, row.verdict));
    return map;
  },

  /**
   * Permanently remove entries from the ledger.
   */
  deleteEntries: async (assetIds: string[]): Promise<void> => {
    await mediaLedgerRepository.deleteMany(assetIds);
  },

  /**
   * Full scan: Gallery → SQLite verdicts → categorised MediaItem lists.
   */
  async performFullScan(limit: number): Promise<{
    unknown: MediaItem[];
    trash: MediaItem[];
    keep: MediaItem[];
  }> {
    const page = await MediaLibrary.getAssetsAsync({
      first: limit,
      mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
      sortBy: [[MediaLibrary.SortBy.creationTime, false]],
    });

    const verdictsMap = await this.getCategorizedIds();

    const result: { unknown: MediaItem[]; trash: MediaItem[]; keep: MediaItem[] } = {
      unknown: [],
      trash: [],
      keep: [],
    };

    page.assets.forEach((asset) => {
      const verdict = verdictsMap.get(asset.id) ?? MediaVerdict.UNKNOWN;

      const item: MediaItem = {
        id: asset.id,
        name: asset.filename ?? asset.id,
        type:
          asset.mediaType === MediaLibrary.MediaType.video
            ? AppMediaType.VIDEO
            : AppMediaType.PHOTO,
        uri: asset.uri,
        duration: asset.duration > 0 ? asset.duration : undefined,
        verdict,
      };

      if (verdict === MediaVerdict.UNKNOWN) result.unknown.push(item);
      else if (verdict === MediaVerdict.TRASH) result.trash.push(item);
      else if (verdict === MediaVerdict.KEEP) result.keep.push(item);
    });

    return result;
  },
};

export default mediaService;
