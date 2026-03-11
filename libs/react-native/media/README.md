# @mas/rn/media

Device media scanning library for React Native / Expo.

**Mission**: scan the device gallery and handle OS permissions. Completely business-agnostic — no knowledge of verdicts, buckets, review workflows, or Redux.

---

## Exports

### Types

| Type                  | Description                                                                    |
| --------------------- | ------------------------------------------------------------------------------ |
| `MediaAsset`          | A single raw device media asset (id, uri, mediaType, duration, width, height…) |
| `AppMediaType`        | `PHOTO \| VIDEO`                                                               |
| `AppPermissionStatus` | `UNKNOWN \| GRANTED \| DENIED`                                                 |
| `ScanOptions`         | Options for `scanMedia` (limit, mediaTypes?)                                   |

### Functions

| Function                   | Description                                                         |
| -------------------------- | ------------------------------------------------------------------- |
| `requestMediaPermission()` | Request OS media-library permission. Returns `AppPermissionStatus`. |
| `scanMedia(options)`       | Fetch raw assets from the device gallery. Returns `MediaAsset[]`.   |

---

## Usage

```ts
import { scanMedia, requestMediaPermission, AppPermissionStatus } from '@mas/rn/media';

const status = await requestMediaPermission();
if (status === AppPermissionStatus.GRANTED) {
  const assets = await scanMedia({ limit: 500 });
}
```

---

## Architecture

This lib is a **mission library**: single responsibility, zero business logic, zero app-level dependencies.

```
@mas/rn/media       (this — scan + permissions only)
       ↓ consumed by
@mas/rn-services    (mediaService — app-level orchestration)
       ↓
apps/rn-pic-swipe-wipe
```

---

## Repo consumers

| Package                  | Role                                                               |
| ------------------------ | ------------------------------------------------------------------ |
| `apps/rn-pic-swipe-wipe` | Uses `scanMedia` + `requestMediaPermission` via `@mas/rn-services` |

---

## Dependencies

| Package              | Role                  |
| -------------------- | --------------------- |
| `expo-media-library` | Native gallery access |
