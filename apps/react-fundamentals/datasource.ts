import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { resolve } from 'path';
import { AuthModule } from '@mas/auth';
import { LearningModule } from './server/learning/learning.module';

config({ path: resolve(__dirname, '.env') });

export default new DataSource({
  type: 'postgres',
  url: process.env['DATABASE_URL'],
  ssl: process.env['NODE_ENV'] === 'production' ? { rejectUnauthorized: false } : false,
  entities: [...AuthModule.entities, ...LearningModule.entities],
  migrations: ['migrations/*.ts'],
  migrationsTableName: 'typeorm_migrations',
});
