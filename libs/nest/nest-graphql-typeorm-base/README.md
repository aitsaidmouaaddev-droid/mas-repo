# @mas/nest-graphql-typeorm-base

Abstract base classes for NestJS applications that combine **TypeORM** (persistence) and **NestJS GraphQL** (code-first schema) in a single entity class. Provides a mixin-based CRUD layer so every feature module inherits standard operations for free.

---

## What's inside

| Export                      | Description                                                                                               |
| --------------------------- | --------------------------------------------------------------------------------------------------------- |
| `BaseEntity`                | Abstract entity with `id`, `createdAt`, `updatedAt`, `isDeleted` — decorated for both TypeORM and GraphQL |
| `BaseService<T, I, U, ID>`  | Mixin factory returning an abstract service with `findAll`, `findOne`, `create`, `update`, `delete`       |
| `IBaseService<T, I, U, ID>` | Interface for the service — resolvers depend on this, not the class                                       |
| `BaseResolver<T, I, U>`     | Mixin factory returning an abstract GraphQL resolver that delegates to the service                        |

---

## Generic parameters

| Parameter | Stands for                           | Example                  |
| --------- | ------------------------------------ | ------------------------ |
| `T`       | Domain entity                        | `QcmQuestion`            |
| `I`       | Create-input DTO                     | `CreateQcmInput`         |
| `U`       | Update-input DTO (must include `id`) | `UpdateQcmInput`         |
| `ID`      | Primary-key scalar                   | `string` (default, UUID) |

---

## Architecture

```
BaseEntity          ← @ObjectType({ isAbstract: true }) + @PrimaryGeneratedColumn etc.
     ↑ extends
QcmQuestion         ← @ObjectType() + @Entity() + domain fields
                         ↑
                   CreateQcmInput  ← OmitType(QcmQuestion, ['id', 'createdAt', …])
                   UpdateQcmInput  ← IntersectionType(PickType(QcmQuestion, ['id']), PartialType(CreateQcmInput))

BaseService<T,I,U>()   ← mixin factory → AbstractService (CRUD via IRepository)
     ↑ extends
QcmService             ← @Injectable(), injects IRepository<QcmQuestion>

BaseResolver<T,I,U>()  ← mixin factory → AbstractResolver (GraphQL ops)
     ↑ extends
QcmResolver            ← @Resolver(() => QcmQuestion), injects QcmService
```

---

## Usage

### 1. Define the entity + inputs (single file)

```ts
// qcm-question.entity.ts
import {
  ObjectType,
  Field,
  InputType,
  Int,
  IntersectionType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@mas/nest-graphql-typeorm-base';

@ObjectType()
@Entity('qcm_questions')
export class QcmQuestion extends BaseEntity {
  @Field()
  @Column()
  question: string;

  @Field(() => [String])
  @Column('simple-array')
  choices: string[];

  @Field(() => Int)
  @Column()
  answer: number;
}

@InputType()
export class CreateQcmInput extends OmitType(
  QcmQuestion,
  ['id', 'createdAt', 'updatedAt', 'isDeleted'] as const,
  InputType,
) {}

@InputType()
export class UpdateQcmInput extends IntersectionType(
  PickType(QcmQuestion, ['id'] as const, InputType),
  PartialType(CreateQcmInput),
) {}
```

### 2. Create a typed repository token

```ts
// qcm.tokens.ts
import { createToken } from '@mas/db-contracts';
import type { QcmQuestion } from './qcm-question.entity';

export const QCM_REPO = createToken<QcmQuestion>('QcmQuestion');
```

### 3. Define the service

```ts
// qcm.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { BaseService } from '@mas/nest-graphql-typeorm-base';
import type { IRepository } from '@mas/db-contracts';
import { QcmQuestion, CreateQcmInput, UpdateQcmInput } from './qcm-question.entity';
import { QCM_REPO } from './qcm.tokens';

@Injectable()
export class QcmService extends BaseService<QcmQuestion, CreateQcmInput, UpdateQcmInput>() {
  constructor(@Inject(QCM_REPO.token) repo: IRepository<QcmQuestion>) {
    super(repo);
  }

  // Domain-specific additions:
  findByModule(moduleId: string) {
    return this.repo.findMany({ where: { moduleId } as never });
  }
}
```

### 4. Define the resolver

```ts
// qcm.resolver.ts
import { Resolver } from '@nestjs/graphql';
import { BaseResolver } from '@mas/nest-graphql-typeorm-base';
import { QcmQuestion, CreateQcmInput, UpdateQcmInput } from './qcm-question.entity';
import { QcmService } from './qcm.service';

@Resolver(() => QcmQuestion)
export class QcmResolver extends BaseResolver(QcmQuestion, CreateQcmInput, UpdateQcmInput) {
  constructor(private readonly qcmService: QcmService) {
    super(qcmService);
  }
}
```

### 5. Wire the module

```ts
// qcm.module.ts
import { Module } from '@nestjs/common';
import { QcmResolver } from './qcm.resolver';
import { QcmService } from './qcm.service';

@Module({
  providers: [QcmService, QcmResolver],
})
export class QcmModule {}
```

---

## Generated GraphQL operations

For an entity named `QcmQuestion`, the base resolver registers:

| Operation            | Type     | Signature                                |
| -------------------- | -------- | ---------------------------------------- |
| `findAllQcmQuestion` | Query    | `(): [QcmQuestion!]!`                    |
| `findOneQcmQuestion` | Query    | `(id: ID!): QcmQuestion`                 |
| `createQcmQuestion`  | Mutation | `(input: CreateQcmInput!): QcmQuestion!` |
| `updateQcmQuestion`  | Mutation | `(input: UpdateQcmInput!): QcmQuestion!` |
| `deleteQcmQuestion`  | Mutation | `(id: ID!): Boolean!`                    |

Names are derived from `classRef.name` so multiple resolvers never collide in the schema.

---

## Soft delete

`isDeleted` is a plain boolean column (default `false`). Set it to `true` instead of physically removing the row. You must filter active records explicitly in your queries:

```ts
// In a concrete service:
async delete(id: string): Promise<void> {
  await this.repo.save({ id, isDeleted: true } as never);
}

// Filtering active records:
findActive(): Promise<T[]> {
  return this.repo.findMany({ where: { isDeleted: false } as never });
}
```

> If you prefer TypeORM's built-in `softDelete()` / `restore()` / `withDeleted()`, swap `isDeleted` for `@DeleteDateColumn() deletedAt?: Date` in your entity subclass.

---

## Tests

```bash
nx run nest-graphql-typeorm-base:test
```

16 tests — BaseEntity subclassing, BaseService CRUD delegation, BaseResolver delegation, operation naming.
