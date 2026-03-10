import { AppMediaType, AppPermissionStatus, MediaVerdict } from './enums';

export interface MediaItem {
  id: string;
  name: string;
  type: AppMediaType;
  uri: string;
  duration?: number;
  verdict: MediaVerdict;
}

export interface MediaDecisionRow {
  id: string;
  verdict: MediaVerdict;
}

export interface MediaBucket {
  items: MediaItem[];
  cursor: number;
}

export interface MediaScanState {
  permission: AppPermissionStatus;
  isScanning: boolean;
  progress: number;
  unknown: MediaBucket;
  trash: MediaBucket;
  keep: MediaBucket;
  error?: string;
}

export interface MediaScanRootState {
  mediaScan: MediaScanState;
}
