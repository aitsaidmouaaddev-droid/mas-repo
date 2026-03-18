import { Field, ObjectType } from '@nestjs/graphql';
import type { Type } from '@nestjs/common';

/**
 * Factory that produces a concrete `@ObjectType` cursor-page envelope class for
 * a given entity.  Each call with a different `classRef` produces a **distinct**
 * named GraphQL type (e.g. `QcmQuestionCursorPage`) so the schema is collision-free.
 *
 * @param classRef   - The entity class decorated with `@ObjectType`.
 * @param entityName - The entity class name (used as the GraphQL type name suffix).
 *
 * @example
 * ```ts
 * const QcmCursor = CursorPageType(QcmQuestion, 'QcmQuestion');
 * // Registers `QcmQuestionCursorPage` in the GraphQL schema with:
 * //   items: [QcmQuestion]!, nextCursor: String, hasNext: Boolean!
 * ```
 */
export function CursorPageType<T>(classRef: Type<T>, entityName: string) {
  @ObjectType(`${entityName}CursorPage`)
  class EntityCursorPage {
    @Field(() => [classRef])
    items!: T[];

    @Field(() => String, { nullable: true })
    nextCursor!: string | null;

    @Field()
    hasNext!: boolean;
  }

  return EntityCursorPage;
}

/** Instance type produced by {@link CursorPageType}. */
export type CursorPageTypeInstance<T> = InstanceType<ReturnType<typeof CursorPageType<T>>>;
