import type { IDbAdapter, IRepository } from '@mas/db-contracts';
import { DataSource, type DataSourceOptions, type ObjectLiteral } from 'typeorm';
import { TypeOrmRepository } from './typeorm-repository';

/**
 * Options accepted by {@link TypeOrmAdapter}.
 *
 * Extends TypeORM's own `DataSourceOptions` so any TypeORM-supported database
 * (Postgres, MySQL, SQLite, MariaDB, …) works out of the box — just change `type`.
 *
 * @example
 * ```ts
 * DbContractsModule.forRoot({
 *   adapter: new TypeOrmAdapter({
 *     type: 'postgres',
 *     url: process.env.DATABASE_URL,
 *     entities: [UserEntity, PostEntity],
 *     migrations: [__dirname + '/migrations/*.js'],
 *     synchronize: false,   // always false in production
 *     migrationsRun: true,
 *   }),
 * })
 * ```
 */
export type TypeOrmAdapterOptions = DataSourceOptions;

/**
 * Concrete {@link IDbAdapter} backed by TypeORM.
 *
 * Handles connection lifecycle (`connect` / `disconnect`) and vends
 * {@link TypeOrmRepository} instances for any registered entity class.
 *
 * Supported databases: PostgreSQL, MySQL, MariaDB, SQLite, MSSQL,
 * CockroachDB, Oracle, MongoDB (via TypeORM's Mongo driver), and more.
 */
export class TypeOrmAdapter implements IDbAdapter<DataSource> {
  private dataSource: DataSource | null = null;
  private readonly options: TypeOrmAdapterOptions;

  constructor(options: TypeOrmAdapterOptions) {
    this.options = options;
  }

  async connect(): Promise<void> {
    if (!this.dataSource) {
      this.dataSource = new DataSource(this.options);
    }
    if (!this.dataSource.isInitialized) {
      await this.dataSource.initialize();
    }
  }

  async disconnect(): Promise<void> {
    if (this.dataSource?.isInitialized) {
      await this.dataSource.destroy();
    }
  }

  getRepository<T, ID = string>(entity: (new () => T) | string): IRepository<T, ID> {
    if (!this.dataSource) {
      throw new Error(
        `TypeOrmAdapter.getRepository: adapter is not connected. Call connect() first.`,
      );
    }
    if (typeof entity === 'string') {
      throw new Error(
        `TypeOrmAdapter.getRepository: string entity names are not supported. ` +
          `Pass the entity class constructor directly (e.g. UserEntity).`,
      );
    }
    // TypeORM requires ObjectLiteral — entities decorated with @Entity satisfy this
    // at runtime; the cast is safe for all real entity classes.
    return new TypeOrmRepository<T & ObjectLiteral, ID>(
      entity as new () => T & ObjectLiteral,
      this.dataSource.manager,
    ) as IRepository<T, ID>;
  }

  getConnection(): DataSource {
    if (!this.dataSource) {
      throw new Error(
        `TypeOrmAdapter.getConnection: adapter is not connected. Call connect() first.`,
      );
    }
    return this.dataSource;
  }
}
