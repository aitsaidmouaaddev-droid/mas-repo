import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  DeleteDateColumn,
} from 'typeorm';

/**
 * Abstract base entity shared by every domain entity in the system.
 *
 * Combines TypeORM column decorators with GraphQL field decorators so a single
 * class definition drives both the database schema and the GraphQL type system.
 *
 * ## Fields
 * | Field       | TypeORM                           | GraphQL        |
 * |-------------|-----------------------------------|----------------|
 * | `id`        | `@PrimaryGeneratedColumn('uuid')` | `ID` scalar    |
 * | `createdAt` | `@CreateDateColumn()`             | `Date`         |
 * | `updatedAt` | `@UpdateDateColumn()`             | `Date`         |
 * | `isDeleted` | `@Column({ default: false })`     | `Boolean`      |
 * | `deletedAt` | `@DeleteDateColumn()`             | nullable `Date` |
 *
 * ## Usage
 * ```ts
 * \@ObjectType()
 * \@Entity('qcm_questions')
 * export class QcmQuestion extends BaseEntity {
 *   \@Field()
 *   \@Column()
 *   question: string;
 * }
 * ```
 *
 * @remarks
 * - `@ObjectType({ isAbstract: true })` tells NestJS GraphQL to inherit the
 *   fields on subclasses without registering `BaseEntity` itself in the schema.
 * - `isDeleted` is a manual boolean flag. Filtering active records must be
 *   done explicitly (e.g. `WHERE isDeleted = false`) — TypeORM's built-in
 *   `softDelete()` is NOT used since it requires `@DeleteDateColumn`.
 */
@ObjectType({ isAbstract: true })
export abstract class BaseEntity {
  /** UUID primary key — generated automatically on insert. */
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /** Timestamp set automatically when the row is first inserted. */
  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  /** Timestamp updated automatically on every `save()` call. */
  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;

  /**
   * Soft-delete flag.
   * `false` means the record is active; `true` means it has been soft-deleted.
   */
  @Field()
  @Column({ default: false })
  isDeleted!: boolean;

  /**
   * Soft-delete timestamp.
   * Set automatically by TypeORM's `softDelete()` / `SoftDeleteQueryBuilder`.
   * `null` means the record is active.
   */
  @Field({ nullable: true })
  @DeleteDateColumn()
  deletedAt?: Date;
}
