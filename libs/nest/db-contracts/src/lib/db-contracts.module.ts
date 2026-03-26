/**
 * @mas/db-contracts — NestJS dynamic module + database-agnostic repository contracts.
 *
 * ## What this module does
 * 1. Accepts a concrete {@link IDbAdapter} (Neon, CosmosDB, TypeORM, …).
 * 2. Calls `adapter.connect()` on bootstrap and `adapter.disconnect()` on shutdown.
 * 3. Exposes the adapter globally so any feature module can inject repositories
 *    without re-importing `DbContractsModule`.
 *
 * ## Usage — synchronous
 * ```ts
 * @Module({
 *   imports: [
 *     DbContractsModule.forRoot({
 *       adapter: new NeonAdapter({ connectionString: process.env.DATABASE_URL }),
 *     }),
 *   ],
 * })
 * export class AppModule {}
 * ```
 *
 * ## Usage — async (with ConfigService)
 * ```ts
 * DbContractsModule.forRootAsync({
 *   inject: [ConfigService],
 *   useFactory: (config: ConfigService) => ({
 *     adapter: new NeonAdapter({ connectionString: config.get('DATABASE_URL') }),
 *   }),
 * })
 * ```
 *
 * ## Injecting a repository in a service
 * ```ts
 * export const USER_REPO = createToken<IUserRepository>('User');
 *
 * // In the feature module provider list:
 * { provide: USER_REPO.token, useFactory: (a: IDbAdapter) => a.getRepository(UserEntity), inject: [DB_ADAPTER] }
 *
 * // In the service:
 * constructor(@Inject(USER_REPO.token) private users: IUserRepository) {}
 * ```
 */

import type { DynamicModule, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { Global, Inject, Module } from '@nestjs/common';
import type { DbConfig, DbConfigAsync } from './config/db-config';
import { DB_ADAPTER, DB_CONFIG } from './config/db-config';
import type { IDbAdapter } from './adapter/IDbAdapter';

// ─── Internal service that manages lifecycle ─────────────────────────────────

@Global()
@Module({})
class DbLifecycleService implements OnApplicationBootstrap, OnApplicationShutdown {
  constructor(@Inject(DB_ADAPTER) private readonly adapter: IDbAdapter) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.adapter.connect();
  }

  async onApplicationShutdown(): Promise<void> {
    await this.adapter.disconnect();
  }
}

// ─── Dynamic module ───────────────────────────────────────────────────────────

@Global()
@Module({})
export class DbContractsModule {
  /**
   * Register the DB layer synchronously.
   * Use when you can construct the adapter before the NestJS container starts.
   */
  static forRoot(config: DbConfig): DynamicModule {
    const adapterProvider = {
      provide: DB_ADAPTER,
      useValue: config.adapter,
    };

    const configProvider = {
      provide: DB_CONFIG,
      useValue: config,
    };

    return {
      module: DbContractsModule,
      global: true,
      providers: [adapterProvider, configProvider, DbLifecycleService],
      exports: [DB_ADAPTER, DB_CONFIG],
    };
  }

  /**
   * Register the DB layer asynchronously.
   * Use when adapter construction depends on other providers (e.g. `ConfigService`).
   */
  static forRootAsync(options: DbConfigAsync): DynamicModule {
    const configProvider = {
      provide: DB_CONFIG,
      inject: options.inject ?? [],
      useFactory: options.useFactory,
    };

    const adapterProvider = {
      provide: DB_ADAPTER,
      inject: [DB_CONFIG],
      useFactory: (cfg: DbConfig) => cfg.adapter,
    };

    return {
      module: DbContractsModule,
      global: true,
      imports: options.imports ?? [],
      providers: [configProvider, adapterProvider, DbLifecycleService],
      exports: [DB_ADAPTER, DB_CONFIG],
    };
  }
}

// ─── Re-export everything consumers need ─────────────────────────────────────

export * from './adapter/IDbAdapter';
export * from './config/db-config';
export * from './repository/IReadRepository';
export * from './repository/IWriteRepository';
export * from './repository/IRepository';
export * from './types/query.types';
export * from './tokens/create-token.util';
