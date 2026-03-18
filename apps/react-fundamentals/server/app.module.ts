import 'reflect-metadata';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DbContractsModule } from '@mas/db-contracts';
import { TypeOrmAdapter } from '@mas/db-typeorm';
import { HealthController } from './health.controller';

/**
 * Root application module.
 *
 * Configuration is loaded from `.env` in the app root (apps/react-fundamentals).
 * Required variables:
 *
 *   DATABASE_URL — full PostgreSQL connection string (Neon, Supabase, etc.)
 *   NODE_ENV     — environment (default: development)
 *   PORT         — server port  (default: 4311)
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DbContractsModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        adapter: new TypeOrmAdapter({
          type: 'postgres',
          url: config.getOrThrow<string>('DATABASE_URL'),
          ssl: { rejectUnauthorized: false },
          synchronize: false,
          logging: config.get('NODE_ENV') !== 'production',
          entities: [],
        }),
      }),
    }),
  ],
  controllers: [HealthController],
})
export class AppModule {}
