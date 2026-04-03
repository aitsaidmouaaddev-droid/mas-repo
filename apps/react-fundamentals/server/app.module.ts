import 'reflect-metadata';
import { join } from 'path';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { ThrottlerModule } from '@nestjs/throttler';
import { DbContractsModule } from '@mas/db-contracts';
import { TypeOrmAdapter } from '@mas/db-typeorm';
import { AuthModule, JwtAuthGuard } from '@mas/auth';
import { GamesModule } from '@mas/nest-games';
import { EmailModule } from '@mas/nest-email';
import { ALL_ENTITIES } from './all-entities';
import { HealthController } from './health.controller';
import { AuditSubscriber } from './audit.subscriber';
import { LearningModule } from './learning/learning.module';
import { ContactModule } from './contact/contact.module';

/**
 * Root application module.
 *
 * Configuration is loaded from `.env` in the app root (apps/react-fundamentals).
 * Required variables:
 *
 *   DATABASE_URL           — full PostgreSQL connection string
 *   JWT_SECRET             — secret used to sign / verify JWT tokens
 *   JWT_EXPIRES_IN         — access token lifetime (default: 15m)
 *   NODE_ENV               — environment (default: development)
 *   PORT                   — server port  (default: 4311)
 *   ACS_CONNECTION_STRING  — Azure Communication Services connection string
 *   ACS_SENDER_ADDRESS     — verified ACS sender address
 *   ACS_CONTACT_RECIPIENT  — recipient for portfolio contact form emails
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    ThrottlerModule.forRoot([{ ttl: 600_000, limit: 3 }]),

    DbContractsModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        adapter: new TypeOrmAdapter({
          type: 'postgres',
          url: config.getOrThrow<string>('DATABASE_URL'),
          ssl: { rejectUnauthorized: false },
          synchronize: config.get('NODE_ENV') !== 'production',
          logging: false,
          entities: [...ALL_ENTITIES],
          subscribers: config.get('AUDIT_LOG') === 'true' ? [AuditSubscriber] : [],
        }),
      }),
    }),

    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile:
        process.env['NODE_ENV'] === 'production' ? true : join(process.cwd(), 'graphql/schema.gql'),
      playground: true,
      context: ({ req }: { req: unknown }) => ({ req }),
    }),

    EmailModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connectionString: config.getOrThrow<string>('ACS_CONNECTION_STRING'),
        senderAddress: config.getOrThrow<string>('ACS_SENDER_ADDRESS'),
      }),
    }),

    AuthModule.register({ methods: ['local', 'google', 'passwordReset'] }),
    LearningModule,
    GamesModule,
    ContactModule,
  ],
  controllers: [HealthController],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
