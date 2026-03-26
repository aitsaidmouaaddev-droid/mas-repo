# `@mas/db-typeorm`

TypeORM adapter for `@mas/db-contracts`.

Implements `IDbAdapter<DataSource>` using TypeORM — connect any TypeORM-supported database (PostgreSQL, Neon, MySQL, SQLite, MSSQL, CockroachDB…) to the `@mas/db-contracts` interface layer without changing a single service.

---

## Table of Contents

- [Installation](#installation)
- [Quick start](#quick-start)
- [TypeOrmAdapter](#typeormadapter)
  - [connect / disconnect](#connect--disconnect)
  - [getRepository](#getrepository)
  - [getConnection](#getconnection)
- [TypeOrmRepository](#typeormrepository)
  - [Read operations](#read-operations)
  - [Write operations](#write-operations)
  - [Subclassing for custom queries](#subclassing-for-custom-queries)
- [Supported databases](#supported-databases)
  - [Neon (serverless PostgreSQL)](#neon-serverless-postgresql)
  - [Local PostgreSQL](#local-postgresql)
  - [SQLite (tests / dev)](#sqlite-tests--dev)
- [Migrations](#migrations)
- [Testing with in-memory SQLite](#testing-with-in-memory-sqlite)
- [Running tests](#running-tests)

---

## Installation

`typeorm` and `reflect-metadata` are listed as dependencies and installed with the monorepo:

```bash
npm install
```

For PostgreSQL / Neon you also need the `pg` driver:

```bash
npm install pg --save
npm install @types/pg --save-dev
```

---

## Quick start

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
        migrations: ['dist/migrations/*.js'],
        migrationsRun: true,
        synchronize: false,
      }),
    }),
  ],
})
export class AppModule {}
```

`DbContractsModule` calls `adapter.connect()` after bootstrap and `adapter.disconnect()` on shutdown automatically.

---

## `TypeOrmAdapter`

### `connect` / `disconnect`

```ts
await adapter.connect(); // calls dataSource.initialize() — idempotent
await adapter.disconnect(); // calls dataSource.destroy()    — idempotent
```

Both are idempotent — safe to call multiple times.

### `getRepository`

Returns a `TypeOrmRepository<T, ID>` for the given entity class.

```ts
const userRepo = adapter.getRepository(UserEntity);
// → TypeOrmRepository<UserEntity, string>
```

String entity names are **not** supported — always pass the class constructor.

### `getConnection`

Returns the underlying `DataSource` for raw queries or TypeORM-specific operations:

```ts
const ds: DataSource = adapter.getConnection();
await ds.query('SELECT NOW()');

// Use TypeORM QueryBuilder
const result = await ds
  .getRepository(UserEntity)
  .createQueryBuilder('user')
  .where('user.role = :role', { role: 'admin' })
  .getMany();
```

---

## `TypeOrmRepository`

Generic implementation of `IRepository<T, ID>` over any TypeORM entity. One instance per entity, created by `TypeOrmAdapter.getRepository`.

### Read operations

```ts
// Find by primary key
const user = await repo.findById('uuid-here'); // → User | null

// List all with optional filtering, sorting, pagination
const users = await repo.findAll({
  filter: { role: 'admin' },
  sort: { field: 'createdAt', order: 'desc' },
  limit: 100,
  offset: 0,
});

// Paginated query — returns Page<T>
const page = await repo.findMany({
  page: 2,
  pageSize: 20,
  filter: { isActive: true },
  sort: [
    { field: 'lastName', order: 'asc' },
    { field: 'firstName', order: 'asc' },
  ],
});
// page.items, page.total, page.hasNext, page.hasPrev

// Check existence
const exists = await repo.exists('uuid-here'); // → boolean

// Count with optional filter
const total = await repo.count();
const admins = await repo.count({ role: 'admin' });
```

### Write operations

```ts
// Upsert — inserts if new, updates if ID exists
const saved = await repo.save(userEntity);

// Batch upsert
const saved = await repo.saveMany([user1, user2]);

// Delete by primary key
await repo.delete('uuid-here');

// Batch delete
await repo.deleteMany(['uuid-1', 'uuid-2', 'uuid-3']);
```

### Subclassing for custom queries

`TypeOrmRepository` is designed to be extended. The underlying TypeORM `Repository<T>` is exposed as `protected repo`:

```ts
import { TypeOrmRepository } from '@mas/db-typeorm';
import { IRepository } from '@mas/db-contracts';

export interface IUserRepository extends IRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  findAdmins(): Promise<User[]>;
}

export class UserRepository extends TypeOrmRepository<User> implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  async findAdmins(): Promise<User[]> {
    return this.repo
      .createQueryBuilder('user')
      .where('user.role = :role', { role: 'admin' })
      .orderBy('user.createdAt', 'DESC')
      .getMany();
  }
}
```

Wire it in your feature module:

```ts
{
  provide: USER_REPO.token,
  inject: [DB_ADAPTER],
  useFactory: (adapter: IDbAdapter) =>
    new UserRepository(UserEntity, adapter.getConnection().manager),
}
```

---

## Supported databases

### Neon (serverless PostgreSQL)

Use the **direct** connection URL (port 5432) — not the pooled URL (port 6432).
TypeORM manages its own connection pool via `pg`; double-pooling through PgBouncer breaks prepared statements.

```ts
new TypeOrmAdapter({
  type: 'postgres',
  url: process.env.DATABASE_URL, // neon direct: postgres://user:pass@ep-xxx.us-east-2.aws.neon.tech/dbname
  ssl: { rejectUnauthorized: false },
  entities: [UserEntity],
  migrationsRun: true,
  synchronize: false,
});
```

### Local PostgreSQL

```ts
new TypeOrmAdapter({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'mydb',
  entities: [UserEntity],
  synchronize: true, // ok in local dev
});
```

### SQLite (tests / dev)

```ts
new TypeOrmAdapter({
  type: 'better-sqlite3',
  database: ':memory:',
  entities: [UserEntity],
  synchronize: true,
  dropSchema: true,
});
```

---

## Migrations

Generate a migration after changing entities:

```bash
npx typeorm migration:generate src/migrations/AddUserTable -d src/data-source.ts
```

`src/data-source.ts`:

```ts
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
});
```

Run migrations:

```bash
npx typeorm migration:run -d src/data-source.ts
```

In production set `migrationsRun: true` in `TypeOrmAdapter` options and TypeORM runs them automatically on `connect()`.

---

## Testing with in-memory SQLite

Unit-test your services without a real database — wire `TypeOrmAdapter` with SQLite in-memory:

```ts
import { Test } from '@nestjs/testing';
import { DbContractsModule } from '@mas/db-contracts';
import { TypeOrmAdapter } from '@mas/db-typeorm';

describe('UserService', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        DbContractsModule.forRoot({
          adapter: new TypeOrmAdapter({
            type: 'better-sqlite3',
            database: ':memory:',
            entities: [UserEntity],
            synchronize: true,
            dropSchema: true,
          }),
        }),
        UserModule,
      ],
    }).compile();

    await app.init();
  });

  afterAll(() => app.close());

  it('saves and retrieves a user', async () => {
    const service = app.get(UserService);
    const user = await service.createUser({ name: 'Alice', email: 'alice@example.com' });
    expect(await service.getUser(user.id)).toMatchObject({ name: 'Alice' });
  });
});
```

---

## Running tests

```bash
nx test db-typeorm
```
