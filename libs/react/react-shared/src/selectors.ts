import type { MediaScanRootState } from './types';

export function selectItems(state: MediaScanRootState) {
  return state.mediaScan.unknown.items;
}

export function selectCursor(state: MediaScanRootState) {
  return state.mediaScan.unknown.cursor;
}

export function selectFrontItem(state: MediaScanRootState) {
  const bucket = state.mediaScan.unknown;
  const items = bucket.items;
  const n = items.length;
  if (n === 0) return undefined;
  return items[bucket.cursor];
}

export function selectBackItem(state: MediaScanRootState) {
  const bucket = state.mediaScan.unknown;
  const items = bucket.items;
  const n = items.length;
  if (n === 0) return undefined;
  return items[(bucket.cursor + 1) % n];
}
