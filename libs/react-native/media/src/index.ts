/**
 * @packageDocumentation
 * @module @mas/rn-media
 *
 * Device media scanning library for React Native / Expo.
 *
 * **Mission:** scan the device gallery and handle OS permissions.
 * This library is completely agnostic to application-level concepts —
 * it has no knowledge of verdicts, buckets, review workflows, or Redux.
 *
 * ## Exports
 *
 * ### Types
 * - {@link MediaAsset} — a single raw device media asset
 * - {@link AppMediaType} — `PHOTO | VIDEO`
 * - {@link AppPermissionStatus} — `UNKNOWN | GRANTED | DENIED`
 * - {@link ScanOptions} — options for {@link scanMedia}
 *
 * ### Functions
 * - {@link requestMediaPermission} — request OS media-library permission
 * - {@link scanMedia} — fetch raw assets from the device gallery
 *
 * ## Usage
 * ```ts
 * import { scanMedia, requestMediaPermission, AppPermissionStatus } from '@mas/rn/media';
 *
 * const status = await requestMediaPermission();
 * if (status === AppPermissionStatus.GRANTED) {
 *   const assets = await scanMedia({ limit: 500 });
 * }
 * ```
 */
export * from './types';
export * from './scanner';
