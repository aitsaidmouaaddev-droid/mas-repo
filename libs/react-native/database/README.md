# @mas/rn-database

React Native / Expo **database layer** for the MAS monorepo.

Provides an `expo-sqlite` adapter and the `media_ledger` repository that persists user swipe decisions across app restarts.

---

## Exports

| Export                  | Kind      | Description                                                               |
| ----------------------- | --------- | ------------------------------------------------------------------------- |
| `ExpoSQLiteAdapter`     | class     | `expo-sqlite` driver implementing `ISQLiteAdapter` from `@mas/mas-sqlite` |
| `MediaLedgerRepository` | class     | Repository for the `media_ledger` SQLite table                            |
| `mediaLedgerRepository` | singleton | Pre-created instance of `MediaLedgerRepository`                           |

---

## Setup

Mount the adapter once in the app root layout before any repository is used:

```ts
import { ExpoSQLiteAdapter } from '@mas/rn/database';
import { DatabaseManager } from '@mas/mas-sqlite';

// In app/_layout.tsx (before rendering children)
DatabaseManager.mount(new ExpoSQLiteAdapter());
await DatabaseManager.open('media.db');
```

---

## MediaLedgerRepository

Persists and retrieves `MediaDecisionRow` entries in the `media_ledger` table.

```sql
CREATE TABLE IF NOT EXISTS media_ledger (
  id        TEXT PRIMARY KEY,
  verdict   TEXT NOT NULL,
  scannedAt INTEGER
);
```

```ts
import { mediaLedgerRepository } from '@mas/rn/database';
import { MediaVerdict } from '@mas/react-shared';

// Persist a decision
await mediaLedgerRepository.upsert({ id: asset.id, verdict: MediaVerdict.KEEP });

// Load all persisted decisions
const rows = await mediaLedgerRepository.findAll();
```

---

## Dependencies

| Package             | Role                                                        |
| ------------------- | ----------------------------------------------------------- |
| `expo-sqlite`       | Native SQLite driver (peer dep)                             |
| `@mas/mas-sqlite`   | Abstract `ISQLiteAdapter` contract + `BaseSQLiteRepository` |
| `@mas/react-shared` | `MediaDecisionRow` entity type                              |

## Used by

- `@mas/rn-services` — `mediaLedgerRepository` to load/save verdicts during scan
