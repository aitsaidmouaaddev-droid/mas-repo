import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { resolve } from 'path';
import { ALL_ENTITIES } from './server/all-entities';

config({ path: resolve(__dirname, '.env') });

export default new DataSource({
  type: 'postgres',
  url: process.env['DATABASE_URL'],
  ssl: process.env['NODE_ENV'] === 'production' ? { rejectUnauthorized: false } : false,
  entities: [...ALL_ENTITIES],
  migrations: ['migrations/*.ts'],
  migrationsTableName: 'typeorm_migrations',
});
