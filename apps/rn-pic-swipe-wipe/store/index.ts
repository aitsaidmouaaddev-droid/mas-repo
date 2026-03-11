/**
 * @packageDocumentation
 * @module store
 * Barrel for the `rn-pic-swipe-wipe` app Redux store.
 *
 * Re-exports all types, selectors, hooks, slice actions and the async thunk.
 *
 * ```ts
 * import { mediaScanActions, scanDevicePhotos, useAppSelector } from '../store';
 * ```
 *
 * @see {@link mediaScanSlice} — the RTK slice
 * @see {@link scanDevicePhotos} — the main async thunk
 */
export * from './types';
export * from './selectors';
export * from './hooks';
export { mediaScanActions, mediaScanSlice, scanDevicePhotos } from './mediaScanSlice';
export type { StoreExtra } from './mediaScanSlice';
