import 'reflect-metadata';
import { join } from 'path';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { DbContractsModule } from '@mas/db-contracts';
import { TypeOrmAdapter } from '@mas/db-typeorm';
import { AuthModule, JwtAuthGuard } from '@mas/auth';
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
          logging: false ,//config.get('NODE_ENV') !== 'production',
          entities: [...AuthModule.entities, ...LearningModule.entities],
          subscribers: config.get('AUDIT_LOG') === 'true' ? [AuditSubscriber] : [],
        }),
      }),
    }),

    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: process.env['NODE_ENV'] === 'production' ? true : join(process.cwd(), 'graphql/schema.gql'),
      playground: true,
      context: ({ req }: { req: unknown }) => ({ req }),
    }),

    AuthModule.register({ methods: ['local', 'google', 'passwordReset'] }),
    LearningModule,
  ],
  controllers: [HealthController],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
