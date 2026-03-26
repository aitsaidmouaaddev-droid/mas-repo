import { Field, Int, ObjectType } from '@nestjs/graphql';
import type { Type } from '@nestjs/common';

/**
 * Factory that produces a concrete `@ObjectType` page-envelope class for a
 * given entity.  Each call with a different `classRef` produces a **distinct**
 * named GraphQL type (e.g. `QcmQuestionPage`) so the schema stays collision-free.
 *
 * @param classRef   - The entity class decorated with `@ObjectType`.
 * @param entityName - The entity class name (used as the GraphQL type name suffix).
 *
 * @example
 * ```ts
 * const QcmPage = PageType(QcmQuestion, 'QcmQuestion');
 * // Registers `QcmQuestionPage` in the GraphQL schema with:
 * //   items: [QcmQuestion]!, total: Int!, page: Int!,
 * //   pageSize: Int!, hasNext: Boolean!, hasPrev: Boolean!
 * ```
 */
export function PageType<T>(classRef: Type<T>, entityName: string) {
  @ObjectType(`${entityName}Page`)
  class EntityPage {
    @Field(() => [classRef])
    items!: T[];

    @Field(() => Int)
    total!: number;

    @Field(() => Int)
    page!: number;

    @Field(() => Int)
    pageSize!: number;

    @Field()
    hasNext!: boolean;

    @Field()
    hasPrev!: boolean;
  }

  return EntityPage;
}

/** Instance type produced by {@link PageType}. */
export type PageTypeInstance<T> = InstanceType<ReturnType<typeof PageType<T>>>;
