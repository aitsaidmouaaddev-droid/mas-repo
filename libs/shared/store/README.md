# @mas/shared/store

Generic Redux store factory — framework-agnostic.

No business logic, no slices, no reducers. Just a thin wrapper that creates a typed Redux Toolkit store and forwards a dependency-injection object (`extra`) to every thunk.

Works with React, React Native, Angular, Vue, Node.js.

---

## Exports

| Export | Description |
|---|---|
| `createAppStore<TReducers, TExtra>(reducers, extra?)` | Creates a Redux store. `extra` is forwarded to every thunk via `thunkApi.extra`. |
| `AppStore` | Type of the created store (`ReturnType<typeof createAppStore>`). |

---

## Usage

```ts
import { createAppStore } from '@mas/shared/store';

// 1 — define your reducers at the app level
import { mediaScanReducer } from './store/mediaScan.slice';
import { mediaService } from './services/media.service';

// 2 — create the store once, inject dependencies
const store = createAppStore(
  { mediaScan: mediaScanReducer },
  { mediaService },             // available in every thunk as thunkApi.extra
);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

```ts
// In a thunk:
export const scanThunk = createAsyncThunk(
  'mediaScan/scan',
  async (_, { extra }) => {
    const { mediaService } = extra as { mediaService: MediaService };
    return mediaService.scan();
  },
);
```

---

## Architecture

```
@mas/shared/store   (this — store factory only)
       ↓ consumed by
apps/rn-pic-swipe-wipe   (defines reducers + injects services via extra)
```

---

## Repo consumers

| Package | Role |
|---|---|
| `apps/rn-pic-swipe-wipe` | Calls `createAppStore` with `mediaScanReducer` and `mediaService` |

---

## Dependencies

| Package | Role |
|---|---|
| `@reduxjs/toolkit` | Redux store, `configureStore`, async thunks |
