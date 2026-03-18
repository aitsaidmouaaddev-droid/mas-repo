import type { IReadRepository } from './IReadRepository';
import type { IWriteRepository } from './IWriteRepository';

/** Full CRUD contract — read + write. */
export interface IRepository<T, ID = string>
  extends IReadRepository<T, ID>,
    IWriteRepository<T, ID> {}
