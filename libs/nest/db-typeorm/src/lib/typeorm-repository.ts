import type {
  CursorOptions,
  CursorPage,
  DeepPartial,
  FindManyOptions,
  FindOptions,
  IRepository,
  Page,
  SortOption,
} from '@mas/db-contracts';
import type {
  DeepPartial as TypeOrmDeepPartial,
  EntityManager,
  FindOptionsOrder,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { In, MoreThan } from 'typeorm';

/**
 * Generic TypeORM implementation of {@link IRepository}.
 *
 * One instance is created per entity class by {@link TypeOrmAdapter.getRepository}.
 * You can subclass this to add entity-specific queries while keeping the
 * standard CRUD contract from `@mas/db-contracts`.
 */
export class TypeOrmRepository<T extends ObjectLiteral, ID = string> implements IRepository<T, ID> {
  protected readonly repo: Repository<T>;

  constructor(
    protected readonly entity: new () => T,
    protected readonly manager: EntityManager,
  ) {
    this.repo = manager.getRepository(entity);
  }

  // ─── By ID ───────────────────────────────────────────────────────────────────

  async findById(id: ID): Promise<T | null> {
    return this.repo.findOne({
      where: { id } as FindOptionsWhere<T>,
    });
  }

  async exists(id: ID): Promise<boolean> {
    const count = await this.repo.count({
      where: { id } as FindOptionsWhere<T>,
    });
    return count > 0;
  }

  // ─── List / filter ───────────────────────────────────────────────────────────

  async findAll(options?: FindOptions<T>): Promise<T[]> {
    return this.repo.find({
      where: options?.filter as FindOptionsWhere<T>,
      order: this.toOrder(options?.sort),
      take: options?.limit,
      skip: options?.offset,
    });
  }

  async filter(criteria: DeepPartial<T>, options?: Omit<FindOptions<T>, 'filter'>): Promise<T[]> {
    return this.findAll({ filter: criteria, ...options });
  }

  async count(filter?: DeepPartial<T>): Promise<number> {
    return this.repo.count({ where: filter as FindOptionsWhere<T> });
  }

  // ─── Page-based pagination ───────────────────────────────────────────────────

  async findMany(options: FindManyOptions<T>): Promise<Page<T>> {
    const { page, pageSize } = options;
    const [items, total] = await this.repo.findAndCount({
      where: options.filter as FindOptionsWhere<T>,
      order: this.toOrder(options.sort),
      take: pageSize,
      skip: (page - 1) * pageSize,
    });

    return {
      items,
      total,
      page,
      pageSize,
      hasNext: page * pageSize < total,
      hasPrev: page > 1,
    };
  }

  async paginateFilter(
    criteria: DeepPartial<T>,
    options: Omit<FindManyOptions<T>, 'filter'>,
  ): Promise<Page<T>> {
    return this.findMany({ filter: criteria, ...options });
  }

  // ─── Cursor-based pagination ─────────────────────────────────────────────────

  async findCursor(options: CursorOptions<T>): Promise<CursorPage<T>> {
    return this.runCursor({}, options);
  }

  async filterCursor(criteria: DeepPartial<T>, options: CursorOptions<T>): Promise<CursorPage<T>> {
    return this.runCursor(criteria, options);
  }

  // ─── Write ───────────────────────────────────────────────────────────────────

  async save(entity: T): Promise<T> {
    return this.repo.save(entity as TypeOrmDeepPartial<T>);
  }

  async saveMany(entities: T[]): Promise<T[]> {
    return this.repo.save(entities as TypeOrmDeepPartial<T>[]);
  }

  async delete(id: ID): Promise<void> {
    await this.repo.delete(id as string | number);
  }

  async deleteMany(ids: ID[]): Promise<void> {
    await this.repo.delete({ id: In(ids) } as unknown as FindOptionsWhere<T>);
  }

  // ─── Internals ───────────────────────────────────────────────────────────────

  /**
   * Shared keyset pagination logic used by {@link findCursor} and {@link filterCursor}.
   *
   * The cursor is a base64-encoded string of the last seen value of `cursorField`
   * (defaults to `'id'`).  One extra row is fetched to determine `hasNext`
   * without a separate `COUNT` query.
   */
  private async runCursor(
    criteria: DeepPartial<T>,
    options: CursorOptions<T>,
  ): Promise<CursorPage<T>> {
    const { cursor, limit, cursorField = 'id' as keyof T, sort } = options;

    const after = cursor ? Buffer.from(cursor, 'base64').toString('utf8') : undefined;

    const where: FindOptionsWhere<T> = {
      ...(criteria as FindOptionsWhere<T>),
      ...(after ? { [cursorField]: MoreThan(after) } : {}),
    } as FindOptionsWhere<T>;

    const items = await this.repo.find({
      where,
      order: {
        ...this.toOrder(sort),
        [cursorField]: 'ASC',
      } as FindOptionsOrder<T>,
      take: limit + 1,
    });

    const hasNext = items.length > limit;
    if (hasNext) items.pop();

    const lastItem = items[items.length - 1];
    const nextCursor =
      hasNext && lastItem
        ? Buffer.from(String((lastItem as Record<keyof T, unknown>)[cursorField])).toString(
            'base64',
          )
        : null;

    return { items, nextCursor, hasNext };
  }

  private toOrder(sort?: SortOption<T> | SortOption<T>[]): FindOptionsOrder<T> | undefined {
    if (!sort) return undefined;
    const options = Array.isArray(sort) ? sort : [sort];
    return options.reduce<FindOptionsOrder<T>>((acc, { field, order }) => {
      (acc as Record<string | symbol, string>)[field as string] = order.toUpperCase();
      return acc;
    }, {} as FindOptionsOrder<T>);
  }
}
