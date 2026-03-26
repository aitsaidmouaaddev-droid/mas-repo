# `@mas/db-contracts`

Database-agnostic repository contracts and NestJS dynamic module.

This library defines the **interfaces** and **tokens** your NestJS services depend on — never a concrete database driver. Swap TypeORM for Prisma, MongoDB, or anything else without touching a single service.

---

## Table of Contents

- [Architecture](#architecture)
- [Contracts](#contracts)
  - [IReadRepository](#ireadrepository)
  - [IWriteRepository](#iwriterepository)
  - [IRepository](#irepository)
  - [IDbAdapter](#idbadapter)
- [Query types](#query-types)
- [NestJS integration](#nestjs-integration)
  - [forRoot — synchronous](#forroot--synchronous)
  - [forRootAsync — with ConfigService](#forrootasync--with-configservice)
- [Typed DI tokens](#typed-di-tokens)
- [Wiring a repository in a feature module](#wiring-a-repository-in-a-feature-module)
- [Writing an adapter](#writing-an-adapter)
- [Running tests](#running-tests)

---

## Architecture

```
                 ┌──────────────────────────────────┐
                 │          Your NestJS app          │
                 │                                   │
                 │  UserService                      │
                 │    @Inject(USER_REPO.token)        │
                 │    private repo: IRepository<User>│  ← depends on interface only
                 └─────────────────┬────────────────┘
                                   │
                 ┌─────────────────▼────────────────┐
                 │         @mas/db-contracts         │
                 │                                   │
                 │  IRepository<T>                   │
                 │  IReadRepository<T>               │
                 │  IWriteRepository<T>              │
                 │  IDbAdapter<TConn>                │
                 │  DbContractsModule                │
                 │  createToken<T>()                 │
                 └─────────────────┬────────────────┘
                                   │  implemented by
                 ┌─────────────────▼────────────────┐
                 │          @mas/db-typeorm           │
                 │  TypeOrmAdapter                   │
                 │  TypeOrmRepository<T>             │
                 └──────────────────────────────────┘
```

`@mas/db-contracts` has **zero runtime dependencies** except `@nestjs/common` for the module decorator.

---

## Contracts

### `IReadRepository<T, ID>`

Read-only access to any data store.

```ts
interface IReadRepository<T, ID = string> {
  findById(id: ID): Promise<T | null>;
  findAll(options?: FindOptions<T>): Promise<T[]>;
  findMany(options: FindManyOptions<T>): Promise<Page<T>>;
  exists(id: ID): Promise<boolean>;
  count(filter?: DeepPartial<T>): Promise<number>;
}
```

### `IWriteRepository<T, ID>`

Write-only access to any data store.

```ts
interface IWriteRepository<T, ID = string> {
  save(entity: T): Promise<T>;
  saveMany(entities: T[]): Promise<T[]>;
  delete(id: ID): Promise<void>;
  deleteMany(ids: ID[]): Promise<void>;
}
```

### `IRepository<T, ID>`

Full CRUD — extends both read and write contracts.

```ts
interface IRepository<T, ID = string> extends IReadRepository<T, ID>, IWriteRepository<T, ID> {}
```

### `IDbAdapter<TConn>`

Contract every concrete database adapter must implement.

```ts
interface IDbAdapter<TConn = unknown> {
  connect(): Promise<void>; // called on app bootstrap
  disconnect(): Promise<void>; // called on app shutdown
  getRepository<T, ID = string>(entity: (new () => T) | string): IRepository<T, ID>;
  getConnection(): TConn; // escape hatch to the native connection
}
```

---

## Query types

### `FindOptions<T>` — simple list query

```ts
interface FindOptions<T> {
  filter?: DeepPartial<T>;
  sort?: SortOption<T> | SortOption<T>[];
  limit?: number;
  offset?: number;
}
```

### `FindManyOptions<T>` — paginated query

Extends `FindOptions<T>` and adds pagination:

```ts
interface FindManyOptions<T> extends FindOptions<T> {
  page: number; // 1-based
  pageSize: number;
}
```

### `Page<T>` — paginated result envelope

```ts
interface Page<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
}
```

### `SortOption<T>`

```ts
interface SortOption<T> {
  field: keyof T;
  order: 'asc' | 'desc';
}
```

### `DeepPartial<T>`

Recursive partial — every nested property is optional. Useful for filter objects.

```ts
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
```

---

## NestJS integration

`DbContractsModule` is a **global dynamic module**. Import it once in your root `AppModule` — all feature modules can inject `DB_ADAPTER` without re-importing.

### `forRoot` — synchronous

Use when you can construct the adapter before the NestJS container starts:

```ts
import { DbContractsModule } from '@mas/db-contracts';
import { TypeOrmAdapter } from '@mas/db-typeorm';

@Module({
  imports: [
    DbContractsModule.forRoot({
      adapter: new TypeOrmAdapter({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        entities: [UserEntity, PostEntity],
        migrationsRun: true,
        synchronize: false,
      }),
    }),
  ],
})
export class AppModule {}
```

### `forRootAsync` — with ConfigService

Use when adapter construction depends on other providers:

```ts
import { DbContractsModule } from '@mas/db-contracts';
import { TypeOrmAdapter } from '@mas/db-typeorm';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DbContractsModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        adapter: new TypeOrmAdapter({
          type: 'postgres',
          url: config.get<string>('DATABASE_URL'),
          ssl: { rejectUnauthorized: false },
          entities: [UserEntity],
          migrationsRun: true,
          synchronize: false,
        }),
      }),
    }),
  ],
})
export class AppModule {}
```

**Lifecycle** — the module automatically calls:

- `adapter.connect()` on `onApplicationBootstrap` (after all modules are initialised)
- `adapter.disconnect()` on `onApplicationShutdown` (graceful shutdown)

---

## Typed DI tokens

`createToken<T>(name)` creates a typed DI injection symbol. The generic `T` is phantom — it carries the repository type at compile time with zero runtime overhead.

```ts
import { createToken } from '@mas/db-contracts';

export const USER_REPO = createToken<IUserRepository>('User');
// USER_REPO.token → Symbol('REPOSITORY:User')
// USER_REPO.name  → 'User'
```

Each call to `createToken` produces a **unique** symbol even if the name is the same — treat the exported constant as the identity, not the string.

---

## Wiring a repository in a feature module

```ts
import { DB_ADAPTER, IDbAdapter, IRepository, createToken } from '@mas/db-contracts';

// 1. Define the typed token for this entity
export const USER_REPO = createToken<IRepository<User>>('User');

// 2. Provide it in the feature module
@Module({
  providers: [
    {
      provide: USER_REPO.token,
      inject: [DB_ADAPTER],
      useFactory: (adapter: IDbAdapter) => adapter.getRepository(UserEntity),
    },
    UserService,
  ],
  exports: [UserService],
})
export class UserModule {}

// 3. Inject in the service — zero TypeORM dependency
@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPO.token)
    private readonly users: IRepository<User>,
  ) {}

  async getUser(id: string): Promise<User | null> {
    return this.users.findById(id);
  }

  async listUsers(page: number): Promise<Page<User>> {
    return this.users.findMany({ page, pageSize: 20 });
  }

  async searchUsers(name: string): Promise<User[]> {
    return this.users.findAll({
      filter: { name },
      sort: { field: 'createdAt', order: 'desc' },
      limit: 50,
    });
  }
}
```

### Injecting `DB_ADAPTER` directly (escape hatch for raw queries)

```ts
import { DB_ADAPTER, IDbAdapter } from '@mas/db-contracts';
import { DataSource } from 'typeorm';

@Injectable()
export class RawQueryService {
  constructor(
    @Inject(DB_ADAPTER)
    private readonly adapter: IDbAdapter<DataSource>,
  ) {}

  async rawQuery() {
    const ds = this.adapter.getConnection(); // → TypeORM DataSource
    return ds.query('SELECT NOW()');
  }
}
```

---

## Writing an adapter

Implement `IDbAdapter<TConn>` to support any database:

```ts
import { IDbAdapter, IRepository } from '@mas/db-contracts';

export class MyCustomAdapter implements IDbAdapter<MyConnection> {
  private conn!: MyConnection;

  constructor(private readonly options: { url: string }) {}

  async connect(): Promise<void> {
    this.conn = await MyDriver.connect(this.options.url);
  }

  async disconnect(): Promise<void> {
    await this.conn.close();
  }

  getRepository<T, ID = string>(entity: (new () => T) | string): IRepository<T, ID> {
    return new MyCustomRepository<T, ID>(entity, this.conn);
  }

  getConnection(): MyConnection {
    return this.conn;
  }
}
```

---

## Running tests

```bash
nx test db-contracts
```
