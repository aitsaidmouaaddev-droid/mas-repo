# @mas/mas-sqlite

SQLite adapter contract and abstract repository base for the MAS monorepo.

Bridges `@mas/frontend-dal` (the interface contract) and the platform-specific SQLite driver (e.g. `expo-sqlite`). Application code extends `BaseSQLiteRepository` and never touches the driver directly.

---

## Exports

| Export                        | Description                                                                         |
| ----------------------------- | ----------------------------------------------------------------------------------- |
| `ISQLiteAdapter`              | Driver contract — implement once per platform/driver                                |
| `BindValue`                   | `string \| number \| null` — accepted bind-parameter types                          |
| `DatabaseManager`             | Singleton that opens the DB, applies PRAGMAs, creates tables, and vends the adapter |
| `BaseSQLiteRepository<T, ID>` | Abstract class that implements `IRepository<T, ID>` over any `ISQLiteAdapter`       |
| `ColumnType`                  | `'TEXT' \| 'INTEGER' \| 'REAL' \| 'BLOB' \| 'NUMERIC'`                              |
| `ColumnDef`                   | Column definition (name, type, constraints)                                         |
| `TableSchema`                 | `{ name: string; columns: ColumnDef[] }`                                            |
| `DatabaseConfig`              | `{ name, tables, pragmas? }` — passed to `DatabaseManager.mount`                    |

---

## Usage

### 1 — Implement `ISQLiteAdapter` for your driver

```ts
import { ISQLiteAdapter, BindValue } from '@mas/mas-sqlite';
import * as SQLite from 'expo-sqlite';

export class ExpoSQLiteAdapter implements ISQLiteAdapter {
  private db!: SQLite.SQLiteDatabase;

  async open(name: string) {
    this.db = await SQLite.openDatabaseAsync(name);
  }
  async exec(sql: string) {
    await this.db.execAsync(sql);
  }
  async run(sql: string, params: BindValue[] = []) {
    await this.db.runAsync(sql, params);
  }
  async getFirst<T>(sql: string, params: BindValue[] = []) {
    return this.db.getFirstAsync<T>(sql, params);
  }
  async getAll<T>(sql: string, params: BindValue[] = []) {
    return this.db.getAllAsync<T>(sql, params);
  }
}
```

### 2 — Mount the database at app startup

```ts
import { DatabaseManager } from '@mas/mas-sqlite';
import { ExpoSQLiteAdapter } from './ExpoSQLiteAdapter';
import { DB_CONFIG } from './config'; // your DatabaseConfig

await DatabaseManager.mount(DB_CONFIG, new ExpoSQLiteAdapter());
```

### 3 — Extend `BaseSQLiteRepository` for each entity

```ts
import { BaseSQLiteRepository, BindValue } from '@mas/mas-sqlite';
import type { MediaDecisionRow } from '@mas/react-shared';

export class MediaLedgerRepository extends BaseSQLiteRepository<MediaDecisionRow> {
  protected tableName = 'media_ledger';
  protected selectColumns = ['id', 'verdict', 'scannedAt'];

  protected toRow(entity: MediaDecisionRow): Record<string, BindValue> {
    return { id: entity.id, verdict: entity.verdict, scannedAt: Date.now() };
  }
}
```

---

## Architecture

```
@mas/frontend-dal           (IRepository interface)
       ↑
@mas/mas-sqlite             (this package — BaseSQLiteRepository)
       ↑
@mas/rn-database            (MediaLedgerRepository — concrete entity repo)
       ↑
apps/rn-pic-swipe-wipe      (app, uses @mas/rn-database)
```

---

## Repo consumers

| Package            | Role                                                                                |
| ------------------ | ----------------------------------------------------------------------------------- |
| `@mas/rn-database` | Extends `BaseSQLiteRepository` for `MediaDecisionRow`, provides `ExpoSQLiteAdapter` |

---

## Dependencies

| Package             | Role                                              |
| ------------------- | ------------------------------------------------- |
| `@mas/frontend-dal` | `IRepository`, `FilterCriteria`, pagination types |

---

## Testing

```sh
cd libs/shared/mas-sqlite
node ../../../node_modules/jest/bin/jest.js --config jest.config.cts --runInBand
```

55 tests covering `DatabaseManager.mount` (SQL generation for all column constraints), `DatabaseManager.ensureReady`, and all `BaseSQLiteRepository` methods (`getById`, `getAll`, `paginate`, `paginateCursor`, `filter`, `paginateFilter`, `save`, `update`, `delete`, `deleteMany`).
