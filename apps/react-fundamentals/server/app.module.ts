import 'reflect-metadata';
import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { DbContractsModule } from '@mas/db-contracts';
import { TypeOrmAdapter } from '@mas/db-typeorm';
import { AuthModule } from '@mas/auth';
import { HealthController } from './health.controller';
import { AuditSubscriber } from './audit.subscriber';
import { LearningModule } from './learning/learning.module';

/**
 * Root application module.
 *
 * Configuration is loaded from `.env` in the app root (apps/react-fundamentals).
 * Required variables:
 *
 *   DATABASE_URL   — full PostgreSQL connection string
 *   JWT_SECRET     — secret used to sign / verify JWT tokens
 *   JWT_EXPIRES_IN — access token lifetime (default: 15m)
 *   NODE_ENV       — environment (default: development)
 *   PORT           — server port  (default: 4311)
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
          synchronize: config.get('NODE_ENV') !== 'production',
          logging: config.get('NODE_ENV') !== 'production',
          entities: [...AuthModule.entities, ...LearningModule.entities],
          subscribers: config.get('AUDIT_LOG') === 'true' ? [AuditSubscriber] : [],
        }),
      }),
    }),

    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'graphql/schema.gql'),
      playground: true,
    }),

    AuthModule.register({ methods: ['local', 'google', 'passwordReset'] }),
    LearningModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
