import type {
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
import { In } from 'typeorm';

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

  // ─── Read ────────────────────────────────────────────────────────────────────

  async findById(id: ID): Promise<T | null> {
    return this.repo.findOne({
      where: { id } as FindOptionsWhere<T>,
    });
  }

  async findAll(options?: FindOptions<T>): Promise<T[]> {
    return this.repo.find({
      where: options?.filter as FindOptionsWhere<T>,
      order: this.toOrder(options?.sort),
      take: options?.limit,
      skip: options?.offset,
    });
  }

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

  async exists(id: ID): Promise<boolean> {
    const count = await this.repo.count({
      where: { id } as FindOptionsWhere<T>,
    });
    return count > 0;
  }

  async count(filter?: DeepPartial<T>): Promise<number> {
    return this.repo.count({ where: filter as FindOptionsWhere<T> });
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

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  private toOrder(sort?: SortOption<T> | SortOption<T>[]): FindOptionsOrder<T> | undefined {
    if (!sort) return undefined;
    const options = Array.isArray(sort) ? sort : [sort];
    return options.reduce<FindOptionsOrder<T>>((acc, { field, order }) => {
      (acc as Record<string | symbol, string>)[field as string] = order.toUpperCase();
      return acc;
    }, {} as FindOptionsOrder<T>);
  }
}
