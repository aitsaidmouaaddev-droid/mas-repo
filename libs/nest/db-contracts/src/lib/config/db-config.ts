import type { InjectionToken } from '@nestjs/common';
import type { IDbAdapter } from '../adapter/IDbAdapter';

/**
 * Synchronous configuration object passed to `DbContractsModule.forRoot`.
 */
export interface DbConfig {
  /**
   * The concrete adapter that handles the actual DB connection and queries.
   * Instantiate it in your app module and pass it here.
   *
   * @example
   * ```ts
   * DbContractsModule.forRoot({
   *   adapter: new NeonAdapter({ connectionString: process.env.DATABASE_URL }),
   * })
   * ```
   */
  adapter: IDbAdapter;
}

/**
 * Asynchronous factory options — use when config depends on other providers
 * (e.g. `ConfigService`, secrets manager, etc.).
 */
export interface DbConfigAsync {
  /**
   * Modules whose providers should be available to `useFactory`.
   * Use this when the factory depends on providers from another module
   * (e.g. `ConfigModule` when injecting `ConfigService`).
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  imports?: any[];

  /**
   * NestJS providers to inject into `useFactory`.
   * Declare them here so NestJS can resolve them before calling the factory.
   */
  inject?: InjectionToken[];

  /**
   * Factory that returns `DbConfig` (or a Promise of it).
   * All values listed in `inject` are passed in order as arguments.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useFactory: (...args: any[]) => DbConfig | Promise<DbConfig>;
}

/** DI token for the resolved `DbConfig` object. */
export const DB_CONFIG = Symbol('DB_CONFIG');

/** DI token for the resolved `IDbAdapter` instance. */
export const DB_ADAPTER = Symbol('DB_ADAPTER');
