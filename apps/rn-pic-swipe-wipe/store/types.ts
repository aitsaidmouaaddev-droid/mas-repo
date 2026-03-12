import type { MediaAsset, AppPermissionStatus } from '@mas/rn/media';

/**
 * Verdict assigned to a media item after the user reviews it.
 *
 * - `UNKNOWN` — not reviewed yet (default)
 * - `KEEP`    — user swiped right
 * - `TRASH`   — user swiped left
 */
export enum MediaVerdict {
  UNKNOWN = 'unknown',
  KEEP = 'keep',
  TRASH = 'trash',
}

/**
 * Persisted row in the `media_ledger` SQLite table.
 * Stores only the minimum data needed to restore verdicts across restarts.
 */
export interface MediaDecisionRow {
  /** Asset ID — links back to a {@link MediaItem}. */
  id: string;
  /** The persisted verdict for this asset. */
  verdict: MediaVerdict;
}

/**
 * A media asset augmented with an application-level review verdict.
 *
 * Extends the raw {@link MediaAsset} from `@mas/rn-media` with
 * a `verdict` that tracks the user's keep/trash decision.
 */
export interface MediaItem extends MediaAsset {
  /**
   * Current review verdict.
   * Starts as {@link MediaVerdict.UNKNOWN} and is updated by swipe actions.
   */
  verdict: MediaVerdict;
}

/**
 * A named collection of media items with a circular cursor.
 *
 * The three buckets (`unknown`, `trash`, `keep`) inside {@link MediaScanState}
 * each follow this shape. The `cursor` points to the currently visible item.
 */
export interface MediaBucket {
  /** Ordered array of media items in this bucket. */
  items: MediaItem[];
  /**
   * Index of the currently visible item.
   * Wraps around: `nextCursor = (cursor + 1) % items.length`.
   */
  cursor: number;
}

/**
 * Shape of the `mediaScan` Redux slice state.
 */
export interface MediaScanState {
  /** OS media-library permission status. */
  permission: AppPermissionStatus;
  /** `true` while the async scan thunk is in flight. */
  isScanning: boolean;
  /** Scan progress (0–1). */
  progress: number;
  /** Items not yet reviewed — the swipe deck source. */
  unknown: MediaBucket;
  /** Items the user marked for deletion. */
  trash: MediaBucket;
  /** Items the user decided to keep. */
  keep: MediaBucket;
  /** Error message if the scan thunk rejects. */
  error?: string;
}

/**
 * Minimal Redux root-state shape required by selectors and typed hooks.
 */
export interface MediaScanRootState {
  mediaScan: MediaScanState;
}
