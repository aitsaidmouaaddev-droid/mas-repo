/**
 * MIME-level type of a media asset loaded from the device library.
 *
 * Used to determine how to render an item — photos use `<Image>` while
 * videos use a video player component.
 */
export enum AppMediaType {
  /** A static image (JPEG, PNG, HEIC, etc.). */
  PHOTO = 'photo',
  /** A video clip (MP4, MOV, etc.). */
  VIDEO = 'video',
}

/**
 * Media library permission status reported by the OS.
 *
 * Starts as `UNKNOWN` before the permission dialog is shown.
 */
export enum AppPermissionStatus {
  /** Permission has not been requested yet. */
  UNKNOWN = 'unknown',
  /** The user granted access to the media library. */
  GRANTED = 'granted',
  /** The user denied access to the media library. */
  DENIED  = 'denied',
}

/**
 * A single raw media asset loaded from the device library.
 *
 * This is the data shape returned by {@link scanMedia}. It contains only
 * device-level metadata — no application-level concepts such as verdicts,
 * buckets, or review state.
 *
 * @see {@link AppMediaType}
 */
export interface MediaAsset {
  /** Unique identifier — matches the asset ID returned by `expo-media-library`. */
  id: string;
  /** Display name of the asset (filename without path). */
  name: string;
  /** Whether the asset is a photo or a video. Determines the render strategy. */
  type: AppMediaType;
  /** Absolute local URI usable by `<Image>` or a video player. */
  uri: string;
  /**
   * Duration in seconds, only present for video assets.
   * `undefined` for photos.
   */
  duration?: number;
}
