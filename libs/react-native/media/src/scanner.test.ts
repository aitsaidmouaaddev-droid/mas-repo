import { requestMediaPermission, scanMedia } from './scanner';
import { AppMediaType, AppPermissionStatus } from './types';

// ---------------------------------------------------------------------------
// Mock expo-media-library
// ---------------------------------------------------------------------------

const mockGetAssetsAsync = jest.fn();
const mockRequestPermissionsAsync = jest.fn();

jest.mock('expo-media-library', () => {
  return {
    requestPermissionsAsync: (...args: unknown[]) => mockRequestPermissionsAsync(...args),
    getAssetsAsync: (...args: unknown[]) => mockGetAssetsAsync(...args),
    MediaType: {
      photo: 'photo',
      video: 'video',
    },
    SortBy: {
      creationTime: 'creationTime',
    },
  };
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRawAsset(
  overrides: Partial<{
    id: string;
    filename: string;
    uri: string;
    mediaType: string;
    duration: number;
  }> = {},
) {
  return {
    id: 'asset-1',
    filename: 'photo.jpg',
    uri: 'file:///photo.jpg',
    mediaType: 'photo',
    duration: 0,
    ...overrides,
  };
}

beforeEach(() => {
  mockGetAssetsAsync.mockReset();
  mockRequestPermissionsAsync.mockReset();
  mockGetAssetsAsync.mockResolvedValue({ assets: [] });
  mockRequestPermissionsAsync.mockResolvedValue({ status: 'granted' });
});

// ---------------------------------------------------------------------------
// requestMediaPermission
// ---------------------------------------------------------------------------

describe('requestMediaPermission', () => {
  it('returns GRANTED when status is "granted"', async () => {
    mockRequestPermissionsAsync.mockResolvedValueOnce({ status: 'granted' });
    const result = await requestMediaPermission();
    expect(result).toBe(AppPermissionStatus.GRANTED);
  });

  it('returns DENIED when status is "denied"', async () => {
    mockRequestPermissionsAsync.mockResolvedValueOnce({ status: 'denied' });
    const result = await requestMediaPermission();
    expect(result).toBe(AppPermissionStatus.DENIED);
  });

  it('returns DENIED when status is "undetermined"', async () => {
    mockRequestPermissionsAsync.mockResolvedValueOnce({ status: 'undetermined' });
    const result = await requestMediaPermission();
    expect(result).toBe(AppPermissionStatus.DENIED);
  });

  it('returns DENIED when status is any other string', async () => {
    mockRequestPermissionsAsync.mockResolvedValueOnce({ status: 'restricted' });
    const result = await requestMediaPermission();
    expect(result).toBe(AppPermissionStatus.DENIED);
  });

  it('calls requestPermissionsAsync exactly once', async () => {
    await requestMediaPermission();
    expect(mockRequestPermissionsAsync).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// scanMedia — basic structure
// ---------------------------------------------------------------------------

describe('scanMedia — empty results', () => {
  it('returns an empty array when no assets are found', async () => {
    mockGetAssetsAsync.mockResolvedValueOnce({ assets: [] });
    const result = await scanMedia({ limit: 50 });
    expect(result).toEqual([]);
  });

  it('calls getAssetsAsync with correct limit', async () => {
    mockGetAssetsAsync.mockResolvedValueOnce({ assets: [] });
    await scanMedia({ limit: 200 });
    expect(mockGetAssetsAsync).toHaveBeenCalledWith(expect.objectContaining({ first: 200 }));
  });

  it('calls getAssetsAsync sorted by creationTime descending', async () => {
    mockGetAssetsAsync.mockResolvedValueOnce({ assets: [] });
    await scanMedia({ limit: 10 });
    const [opts] = mockGetAssetsAsync.mock.calls[0] as [{ sortBy: unknown[] }];
    expect(opts.sortBy).toEqual([['creationTime', false]]);
  });
});

// ---------------------------------------------------------------------------
// scanMedia — media type mapping
// ---------------------------------------------------------------------------

describe('scanMedia — mediaType mapping', () => {
  it('maps native "photo" mediaType to AppMediaType.PHOTO', async () => {
    mockGetAssetsAsync.mockResolvedValueOnce({
      assets: [makeRawAsset({ mediaType: 'photo' })],
    });
    const [asset] = await scanMedia({ limit: 1 });
    expect(asset.type).toBe(AppMediaType.PHOTO);
  });

  it('maps native "video" mediaType to AppMediaType.VIDEO', async () => {
    mockGetAssetsAsync.mockResolvedValueOnce({
      assets: [makeRawAsset({ mediaType: 'video' })],
    });
    const [asset] = await scanMedia({ limit: 1 });
    expect(asset.type).toBe(AppMediaType.VIDEO);
  });

  it('defaults to PHOTO for unknown mediaType', async () => {
    mockGetAssetsAsync.mockResolvedValueOnce({
      assets: [makeRawAsset({ mediaType: 'unknown' })],
    });
    const [asset] = await scanMedia({ limit: 1 });
    expect(asset.type).toBe(AppMediaType.PHOTO);
  });
});

// ---------------------------------------------------------------------------
// scanMedia — field mapping
// ---------------------------------------------------------------------------

describe('scanMedia — field mapping', () => {
  it('maps asset id correctly', async () => {
    mockGetAssetsAsync.mockResolvedValueOnce({
      assets: [makeRawAsset({ id: 'asset-42' })],
    });
    const [asset] = await scanMedia({ limit: 1 });
    expect(asset.id).toBe('asset-42');
  });

  it('maps asset uri correctly', async () => {
    mockGetAssetsAsync.mockResolvedValueOnce({
      assets: [makeRawAsset({ uri: 'file:///media/photo.jpg' })],
    });
    const [asset] = await scanMedia({ limit: 1 });
    expect(asset.uri).toBe('file:///media/photo.jpg');
  });

  it('uses filename as name when present', async () => {
    mockGetAssetsAsync.mockResolvedValueOnce({
      assets: [makeRawAsset({ filename: 'IMG_001.jpg' })],
    });
    const [asset] = await scanMedia({ limit: 1 });
    expect(asset.name).toBe('IMG_001.jpg');
  });

  it('falls back to id as name when filename is null/undefined', async () => {
    // scanner uses `??` so only null/undefined triggers the fallback
    const rawAsset = {
      ...makeRawAsset({ id: 'fallback-id' }),
      filename: undefined as unknown as string,
    };
    mockGetAssetsAsync.mockResolvedValueOnce({ assets: [rawAsset] });
    const [asset] = await scanMedia({ limit: 1 });
    expect(asset.name).toBe('fallback-id');
  });

  it('sets duration for video assets with duration > 0', async () => {
    mockGetAssetsAsync.mockResolvedValueOnce({
      assets: [makeRawAsset({ mediaType: 'video', duration: 12.5 })],
    });
    const [asset] = await scanMedia({ limit: 1 });
    expect(asset.duration).toBe(12.5);
  });

  it('sets duration to undefined when duration is 0 (photo)', async () => {
    mockGetAssetsAsync.mockResolvedValueOnce({
      assets: [makeRawAsset({ mediaType: 'photo', duration: 0 })],
    });
    const [asset] = await scanMedia({ limit: 1 });
    expect(asset.duration).toBeUndefined();
  });

  it('sets duration to undefined when duration is 0 for video', async () => {
    mockGetAssetsAsync.mockResolvedValueOnce({
      assets: [makeRawAsset({ mediaType: 'video', duration: 0 })],
    });
    const [asset] = await scanMedia({ limit: 1 });
    expect(asset.duration).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// scanMedia — multiple assets
// ---------------------------------------------------------------------------

describe('scanMedia — multiple assets', () => {
  it('returns all assets in the response', async () => {
    const rawAssets = [
      makeRawAsset({ id: '1', filename: 'a.jpg' }),
      makeRawAsset({ id: '2', filename: 'b.mp4', mediaType: 'video', duration: 5 }),
      makeRawAsset({ id: '3', filename: 'c.png' }),
    ];
    mockGetAssetsAsync.mockResolvedValueOnce({ assets: rawAssets });
    const result = await scanMedia({ limit: 3 });
    expect(result).toHaveLength(3);
  });

  it('preserves order from getAssetsAsync response', async () => {
    const rawAssets = [
      makeRawAsset({ id: 'first' }),
      makeRawAsset({ id: 'second' }),
      makeRawAsset({ id: 'third' }),
    ];
    mockGetAssetsAsync.mockResolvedValueOnce({ assets: rawAssets });
    const result = await scanMedia({ limit: 3 });
    expect(result[0].id).toBe('first');
    expect(result[1].id).toBe('second');
    expect(result[2].id).toBe('third');
  });
});

// ---------------------------------------------------------------------------
// scanMedia — mediaTypes option
// ---------------------------------------------------------------------------

describe('scanMedia — mediaTypes option', () => {
  it('requests only photo type when mediaTypes=[PHOTO]', async () => {
    mockGetAssetsAsync.mockResolvedValueOnce({ assets: [] });
    await scanMedia({ limit: 10, mediaTypes: [AppMediaType.PHOTO] });
    const [opts] = mockGetAssetsAsync.mock.calls[0] as [{ mediaType: string[] }];
    expect(opts.mediaType).toEqual(['photo']);
  });

  it('requests only video type when mediaTypes=[VIDEO]', async () => {
    mockGetAssetsAsync.mockResolvedValueOnce({ assets: [] });
    await scanMedia({ limit: 10, mediaTypes: [AppMediaType.VIDEO] });
    const [opts] = mockGetAssetsAsync.mock.calls[0] as [{ mediaType: string[] }];
    expect(opts.mediaType).toEqual(['video']);
  });

  it('requests both types when mediaTypes=[PHOTO, VIDEO]', async () => {
    mockGetAssetsAsync.mockResolvedValueOnce({ assets: [] });
    await scanMedia({ limit: 10, mediaTypes: [AppMediaType.PHOTO, AppMediaType.VIDEO] });
    const [opts] = mockGetAssetsAsync.mock.calls[0] as [{ mediaType: string[] }];
    expect(opts.mediaType).toContain('photo');
    expect(opts.mediaType).toContain('video');
  });

  it('defaults to both PHOTO and VIDEO when mediaTypes is not provided', async () => {
    mockGetAssetsAsync.mockResolvedValueOnce({ assets: [] });
    await scanMedia({ limit: 10 });
    const [opts] = mockGetAssetsAsync.mock.calls[0] as [{ mediaType: string[] }];
    expect(opts.mediaType).toContain('photo');
    expect(opts.mediaType).toContain('video');
  });
});
