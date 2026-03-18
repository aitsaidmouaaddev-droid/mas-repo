import type { DeepPartial, FindManyOptions, FindOptions, Page } from '../types/query.types';

/** Read-only contract for any data store. */
export interface IReadRepository<T, ID = string> {
  findById(id: ID): Promise<T | null>;
  findAll(options?: FindOptions<T>): Promise<T[]>;
  findMany(options: FindManyOptions<T>): Promise<Page<T>>;
  exists(id: ID): Promise<boolean>;
  count(filter?: DeepPartial<T>): Promise<number>;
}
