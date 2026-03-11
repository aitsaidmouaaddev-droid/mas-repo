# rn-pic-swipe-wipe

React Native / Expo app to sort thousands of photos and videos through a gesture-driven UI. Swipe to keep or trash, with a transactional SQLite ledger so the session can always be resumed.

---

## Stack

| Technology | Version |
|---|---|
| Expo SDK | 54 |
| React Native | 0.81.5 |
| Expo Router | v6 |
| Redux Toolkit | latest |
| React Native Reanimated | v4 |
| SQLite | expo-sqlite |
| expo-media-library | latest |

---

## Architecture

Strict separation of concerns — no layer knows about the layer above it:

```
screens / components      (UI only — dispatches actions, reads selectors)
       ↓
store (Redux slices)      (state + thunks — calls services via thunkApi.extra)
       ↓
services                  (orchestration — uses libs, knows nothing of UI)
       ↓
@mas/rn/media             (device gallery scan + permissions — business-agnostic)
@mas/rn/database          (SQLite adapter + MediaLedgerRepository)
```

### Key directories

```
app/
  (tabs)/                 # Tab navigator (Expo Router)
  _layout.tsx             # Root layout — mounts DB, wraps with Redux Provider + ThemeProvider
  screens/                # Full-screen views
  components/             # Screen-scoped components
store/                    # Redux slices + selectors
services/                 # mediaService (scan orchestration)
database.config.ts        # SQLite schema + DatabaseConfig
db/                       # MediaLedgerRepository
hooks/                    # useMedia, useResultedStyle
```

### DI pattern

Services are injected into the Redux store via `createAppStore(reducers, { mediaService })` from `@mas/shared/store`. Thunks access them through `thunkApi.extra` — zero coupling between layers.

---

## Shared libs used

| Lib | Role |
|---|---|
| `@mas/rn/ui` | All UI components + ThemeProvider |
| `@mas/rn/media` | Gallery scan + permissions |
| `@mas/rn/database` | SQLite adapter + MediaLedgerRepository |
| `@mas/shared/store` | Redux store factory |
| `@mas/shared/types` | ThemeTokens, StylesOverride |
| `@mas/frontend-dal` | IRepository interface |
| `@mas/mas-sqlite` | BaseSQLiteRepository, DatabaseManager |

---

## Commands

```bash
# Start (Expo Go / dev client)
nx run rn-pic-swipe-wipe:start

# Android
nx run rn-pic-swipe-wipe:android

# Typecheck
nx run rn-pic-swipe-wipe:typecheck

# Tests
nx run rn-pic-swipe-wipe:test

# Lint
nx run rn-pic-swipe-wipe:lint

# Storybook (via launcher)
npm run storybook
```

---

## Roadmap

- ✅ Gallery scan + MediaItem normalisation
- ✅ Gesture deck (swipe keep/trash)
- ✅ SQLite ledger + resume sorting
- ⏳ "Commit screen": Keep/Trash summary + confirmation
- ⏳ Filters: screenshots, short videos, sizes, dates
- ⏳ "Review Trash" mode before final deletion
- ⏳ Ledger export/backup
