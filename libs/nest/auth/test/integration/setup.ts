import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Identity } from '../../src/lib/modules/identity/identity.entity';
import { User } from '../../src/lib/modules/user/user.entity';
import { IdentityProvider } from '../../src/lib/modules/provider/identity-provider.entity';
import { RefreshToken } from '../../src/lib/modules/token/refresh-token.entity';

/**
 * Shared DataSource for all integration tests.
 * Reads DATABASE_URL from the environment.
 *
 * Usage in each test file:
 *   import { getDataSource } from './setup';
 *   beforeAll(() => getDataSource().initialize());
 *   afterAll(() => getDataSource().destroy());
 */
let ds: DataSource;

export function getDataSource(): DataSource {
  if (!ds) {
    const url = process.env['DATABASE_URL'];
    if (!url) throw new Error('DATABASE_URL must be set for integration tests');

    ds = new DataSource({
      type: 'postgres',
      url,
      ssl: { rejectUnauthorized: false },
      synchronize: true, // auto-creates tables for tests
      dropSchema: false,
      logging: false,
      entities: [Identity, User, IdentityProvider, RefreshToken],
    });
  }
  return ds;
}
