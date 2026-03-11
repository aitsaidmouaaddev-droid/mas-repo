import type { MediaScanRootState } from './types';
import type { MediaItem } from './types';

/** All un-reviewed items in the `unknown` bucket. */
export function selectItems(state: MediaScanRootState): MediaItem[] {
  return state.mediaScan.unknown.items;
}

/** Current cursor index of the `unknown` bucket. */
export function selectCursor(state: MediaScanRootState): number {
  return state.mediaScan.unknown.cursor;
}

/** Top card of the swipe deck, or `undefined` if the bucket is empty. */
export function selectFrontItem(state: MediaScanRootState): MediaItem | undefined {
  const { items, cursor } = state.mediaScan.unknown;
  if (items.length === 0) return undefined;
  return items[cursor];
}

/** Card behind the top card, or `undefined` if the bucket is empty. */
export function selectBackItem(state: MediaScanRootState): MediaItem | undefined {
  const { items, cursor } = state.mediaScan.unknown;
  const n = items.length;
  if (n === 0) return undefined;
  return items[(cursor + 1) % n];
}
