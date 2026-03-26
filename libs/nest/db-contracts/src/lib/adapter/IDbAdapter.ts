import type { IRepository } from '../repository/IRepository';

/**
 * Contract every concrete database adapter must fulfil.
 *
 * An adapter is responsible for:
 * - holding / managing the underlying DB connection
 * - instantiating repository implementations for a given entity class/name
 *
 * Adapter libs (`@mas/db-neon`, `@mas/db-cosmos`, `@mas/db-typeorm`, …)
 * each export a class that implements this interface and is passed to
 * `DbContractsModule.forRoot({ adapter: new NeonAdapter(config) })`.
 *
 * @typeParam TConn - the native connection/client type exposed by this adapter
 *                    (useful for escape-hatching to raw queries).
 */
export interface IDbAdapter<TConn = unknown> {
  /**
   * Called once by `DbContractsModule` after the NestJS app bootstraps.
   * Use this to open connections, run migrations, warm up pools, etc.
   */
  connect(): Promise<void>;

  /**
   * Called when the NestJS app shuts down (`onApplicationShutdown`).
   * Release connections, close pools, flush buffers.
   */
  disconnect(): Promise<void>;

  /**
   * Returns a repository instance for the given entity.
   *
   * @param entity - the entity class constructor **or** a unique string name
   *                 (useful for document stores that don't have TS classes).
   */
  getRepository<T, ID = string>(entity: (new () => T) | string): IRepository<T, ID>;

  /**
   * Escape hatch — returns the underlying native connection.
   * Type depends on the concrete adapter (e.g. `Pool` for Neon, `DataSource` for TypeORM).
   */
  getConnection(): TConn;
}
