import * as MediaLibrary from 'expo-media-library';
import { AppMediaType, AppPermissionStatus, type MediaAsset } from './types';

/**
 * Options for {@link scanMedia}.
 */
export interface ScanOptions {
  /** Maximum number of assets to load. */
  limit: number;
  /**
   * Media types to include. Defaults to both photos and videos.
   * Pass `[AppMediaType.PHOTO]` to scan photos only.
   */
  mediaTypes?: AppMediaType[];
}

/**
 * Requests the OS media-library permission.
 *
 * @returns The current permission status after the dialog resolves.
 *
 * @example
 * ```ts
 * const status = await requestMediaPermission();
 * if (status !== AppPermissionStatus.GRANTED) return;
 * ```
 */
export async function requestMediaPermission(): Promise<AppPermissionStatus> {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  return status === 'granted' ? AppPermissionStatus.GRANTED : AppPermissionStatus.DENIED;
}

/**
 * Fetches raw media assets from the device library, sorted newest first.
 *
 * This function is agnostic to any application-level concept (verdicts,
 * review state, buckets). It simply reads the device gallery and maps
 * each asset to a {@link MediaAsset}.
 *
 * @param options - {@link ScanOptions}
 * @returns A flat array of {@link MediaAsset} objects.
 *
 * @example
 * ```ts
 * const assets = await scanMedia({ limit: 500 });
 * ```
 */
export async function scanMedia(options: ScanOptions): Promise<MediaAsset[]> {
  const types = options.mediaTypes ?? [AppMediaType.PHOTO, AppMediaType.VIDEO];

  const nativeTypes = types.map((t) =>
    t === AppMediaType.VIDEO ? MediaLibrary.MediaType.video : MediaLibrary.MediaType.photo,
  );

  const page = await MediaLibrary.getAssetsAsync({
    first: options.limit,
    mediaType: nativeTypes,
    sortBy: [[MediaLibrary.SortBy.creationTime, false]],
  });

  return page.assets.map(
    (asset): MediaAsset => ({
      id: asset.id,
      name: asset.filename ?? asset.id,
      uri: asset.uri,
      type:
        asset.mediaType === MediaLibrary.MediaType.video ? AppMediaType.VIDEO : AppMediaType.PHOTO,
      duration: asset.duration > 0 ? asset.duration : undefined,
    }),
  );
}
