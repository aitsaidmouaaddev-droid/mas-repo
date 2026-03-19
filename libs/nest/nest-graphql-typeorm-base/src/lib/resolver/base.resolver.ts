import { Args, ID as GraphQLID, Int, Mutation, Query } from '@nestjs/graphql';
import type { Type } from '@nestjs/common';
import type { CursorPage, Page } from '@mas/db-contracts';
import { CursorPageType } from '../types/cursor-page.type';
import { PageType } from '../types/page.type';
import type { IBaseService } from '../service/base.service';

/**
 * Mixin factory that returns an abstract NestJS GraphQL resolver pre-wired
 * with the five standard CRUD operations.
 *
 * The resolver is intentionally thin — it only maps GraphQL operations to
 * service calls, with zero business logic.  All reasoning lives in the service.
 *
 * Query / mutation names are derived from the entity class name to avoid
 * schema conflicts when multiple resolvers are registered (e.g.
 * `findAllQcmQuestion`, `createTdtChallenge`).
 *
 * @typeParam T - Domain entity / GraphQL object type (e.g. `QcmQuestion`).
 * @typeParam I - Create-input type decorated with `\@InputType()`.
 * @typeParam U - Update-input type — **must include an `id` field**.
 *
 * @param classRef    - Runtime class reference for `T` (needed by GraphQL decorators).
 * @param createInput - Runtime class reference for `I`.
 * @param updateInput - Runtime class reference for `U`.
 *
 * @example
 * ```ts
 * \@Resolver(() => QcmQuestion)
 * export class QcmResolver extends BaseResolver(
 *   QcmQuestion,
 *   CreateQcmInput,
 *   UpdateQcmInput,
 * ) {
 *   constructor(private readonly qcmService: QcmService) {
 *     super(qcmService);
 *   }
 *
 *   // Add domain-specific queries / mutations here
 * }
 * ```
 */
export function BaseResolver<T, I, U extends { id: string }>(
  classRef: Type<T>,
  createInput: Type<I>,
  updateInput: Type<U>,
) {
  const entityName = classRef.name;
  const PageClass = PageType(classRef, entityName);
  const CursorPageClass = CursorPageType(classRef, entityName);

  abstract class AbstractResolver {
    constructor(readonly service: IBaseService<T, I, U>) {}

    /**
     * Returns records filtered by `isDeleted = false` by default.
     * Pass `includeDeleted: true` in the query to include soft-deleted records.
     *
     * GraphQL name: `findAll<EntityName>` (e.g. `findAllQcmQuestion`).
     *
     * @example
     * ```graphql
     * query { findAllQcmQuestion(includeDeleted: true) { id question isDeleted } }
     * ```
     */
    @Query(() => [classRef], { name: `findAll${entityName}` })
    findAll(
      @Args('includeDeleted', { type: () => Boolean, nullable: true, defaultValue: false })
      includeDeleted: boolean,
      @Args('populate', { type: () => [String], nullable: true, defaultValue: [] })
      populate: string[],
    ): Promise<T[]> {
      return this.service.findAll(includeDeleted, populate);
    }

    /**
     * Returns records matching a JSON filter object.
     *
     * GraphQL name: `findBy<EntityName>` (e.g. `findByUser`).
     *
     * @example
     * ```graphql
     * query { findByUser(filter: "{\"identityId\":\"abc\"}", populate: ["identity"]) { id firstName identity { email } } }
     * ```
     */
    @Query(() => [classRef], { name: `findBy${entityName}` })
    findBy(
      @Args('filter', { type: () => String }) filter: string,
      @Args('includeDeleted', { type: () => Boolean, nullable: true, defaultValue: false })
      includeDeleted: boolean,
      @Args('populate', { type: () => [String], nullable: true, defaultValue: [] })
      populate: string[],
    ): Promise<T[]> {
      const criteria = JSON.parse(filter) as Record<string, unknown>;
      return this.service.findBy(criteria, includeDeleted, populate);
    }

    /**
     * Returns a single active record by `id`, or `null` if not found or soft-deleted.
     * Pass `includeDeleted: true` to retrieve the record even if soft-deleted.
     *
     * GraphQL name: `findOne<EntityName>` (e.g. `findOneQcmQuestion`).
     *
     * @example
     * ```graphql
     * query { findOneQcmQuestion(id: "abc", populate: ["module"]) { id module { label } } }
     * ```
     */
    @Query(() => classRef, { nullable: true, name: `findOne${entityName}` })
    findOne(
      @Args('id', { type: () => GraphQLID }) id: string,
      @Args('includeDeleted', { type: () => Boolean, nullable: true, defaultValue: false })
      includeDeleted: boolean,
      @Args('populate', { type: () => [String], nullable: true, defaultValue: [] })
      populate: string[],
    ): Promise<T | null> {
      return this.service.findOne(id, includeDeleted, populate);
    }

    /**
     * Returns a page of records with total count, hasNext, hasPrev.
     * Filters `isDeleted = false` by default.
     *
     * GraphQL name: `findPage<EntityName>` (e.g. `findPageQcmQuestion`).
     *
     * @example
     * ```graphql
     * query { findPageQcmQuestion(page: 1, pageSize: 10, populate: ["module"]) { items { id module { label } } total } }
     * ```
     */
    @Query(() => PageClass, { name: `findPage${entityName}` })
    findPage(
      @Args('page', { type: () => Int }) page: number,
      @Args('pageSize', { type: () => Int }) pageSize: number,
      @Args('includeDeleted', { type: () => Boolean, nullable: true, defaultValue: false })
      includeDeleted: boolean,
      @Args('populate', { type: () => [String], nullable: true, defaultValue: [] })
      populate: string[],
    ): Promise<Page<T>> {
      return this.service.findPage(page, pageSize, includeDeleted, populate);
    }

    /**
     * Returns a cursor page of records for keyset pagination.
     * Filters `isDeleted = false` by default.
     *
     * GraphQL name: `findCursor<EntityName>` (e.g. `findCursorQcmQuestion`).
     *
     * @example
     * ```graphql
     * query { findCursorQcmQuestion(limit: 20, cursor: "abc=", populate: ["module"]) { items { id } nextCursor } }
     * ```
     */
    @Query(() => CursorPageClass, { name: `findCursor${entityName}` })
    findCursor(
      @Args('limit', { type: () => Int }) limit: number,
      @Args('cursor', { type: () => String, nullable: true }) cursor: string | undefined,
      @Args('includeDeleted', { type: () => Boolean, nullable: true, defaultValue: false })
      includeDeleted: boolean,
      @Args('populate', { type: () => [String], nullable: true, defaultValue: [] })
      populate: string[],
    ): Promise<CursorPage<T>> {
      return this.service.findCursorPage(cursor, limit, includeDeleted, populate);
    }

    /**
     * Creates a new record from the provided input.
     * GraphQL name: `create<EntityName>` (e.g. `createQcmQuestion`).
     */
    @Mutation(() => classRef, { name: `create${entityName}` })
    create(@Args('input', { type: () => createInput }) input: I): Promise<T> {
      return this.service.create(input);
    }

    /**
     * Updates an existing record.  The `id` inside the update input
     * identifies which record to update.
     * GraphQL name: `update<EntityName>` (e.g. `updateQcmQuestion`).
     */
    @Mutation(() => classRef, { name: `update${entityName}` })
    update(@Args('input', { type: () => updateInput }) input: U): Promise<T> {
      return this.service.update(input.id, input);
    }

    /**
     * Deletes a record by `id`.  Returns `true` on success.
     * GraphQL name: `delete<EntityName>` (e.g. `deleteQcmQuestion`).
     */
    @Mutation(() => Boolean, { name: `delete${entityName}` })
    async delete(@Args('id', { type: () => GraphQLID }) id: string): Promise<boolean> {
      await this.service.delete(id);
      return true;
    }
  }

  return AbstractResolver;
}
