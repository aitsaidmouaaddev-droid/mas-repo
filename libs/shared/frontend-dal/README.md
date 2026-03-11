# @mas/frontend-dal

Platform-agnostic repository interfaces and query types for the MAS monorepo.

This package is **types-only** — no runtime code. It defines the data-access contract that every frontend (React Native, Angular, web) and every data-layer adapter must agree on.

---

## Exports

### Repository interfaces (`repository.ts`)

| Interface                 | Description                                                                                                      |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `IReadRepository<T, ID>`  | Read-only: `getById`, `getAll`, `paginate`, `paginateCursor`, `filter`, `paginateFilter`, `paginateFilterCursor` |
| `IWriteRepository<T, ID>` | Write-only: `save`, `update`, `delete`, `deleteMany`                                                             |
| `IRepository<T, ID>`      | Full CRUD — extends both above (most common dependency)                                                          |

### Query types (`query.ts`)

| Type                | Description                                                                     |
| ------------------- | ------------------------------------------------------------------------------- |
| `SortDirection`     | `'asc' \| 'desc'`                                                               |
| `SortParam<T>`      | `{ field: keyof T; direction: SortDirection }`                                  |
| `PageParams`        | Page number + page size + optional sort                                         |
| `PageResult<T>`     | Items + total + pagination metadata                                             |
| `CursorParams`      | Opaque cursor + limit + optional sort                                           |
| `CursorResult<T>`   | Items + next cursor + hasMore                                                   |
| `FieldOperators<V>` | Comparison operators: `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `in`, `contains`, … |
| `FieldFilter<V>`    | Exact value or `FieldOperators<V>`                                              |
| `FilterCriteria<T>` | Partial record of entity keys → `FieldFilter`                                   |

---

## Usage

```ts
import type { IRepository, FilterCriteria, PageParams, PageResult } from '@mas/frontend-dal';

class PhotoService {
  constructor(private repo: IRepository<Photo>) {}

  search(criteria: FilterCriteria<Photo>, params: PageParams): Promise<PageResult<Photo>> {
    return this.repo.paginateFilter(criteria, params);
  }
}
```

---

## Architecture

```
@mas/frontend-dal          (this package — interfaces only)
       ↑
@mas/mas-sqlite            (implements IRepository via BaseSQLiteRepository)
       ↑
@mas/rn-database           (concrete MediaLedgerRepository for the app)
       ↑
apps/rn-pic-swipe-wipe     (consumes via @mas/rn-database)
```

Application code depends on `IRepository` — never on the SQLite adapter directly. Swapping the underlying driver requires no changes in app code.

---

## Repo consumers

| Package            | Role                                                   |
| ------------------ | ------------------------------------------------------ |
| `@mas/mas-sqlite`  | Implements `IRepository<T>` via `BaseSQLiteRepository` |
| `@mas/rn-database` | Extends `BaseSQLiteRepository` for `MediaDecisionRow`  |

---

## Dependencies

None — this package has no dependencies.

---

## Testing

```sh
cd libs/shared/frontend-dal
node ../../../node_modules/jest/bin/jest.js --config jest.config.cts --runInBand
```

35 tests covering `SortDirection`, `SortParam`, `PageParams`, `PageResult`, `CursorParams`, `CursorResult`, `FieldOperators`, `FieldFilter`, `FilterCriteria`, and interface-conformance checks for `IReadRepository`, `IWriteRepository`, and `IRepository`.
