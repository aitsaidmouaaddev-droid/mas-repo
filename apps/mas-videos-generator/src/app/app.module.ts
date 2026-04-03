import 'reflect-metadata';
import { join } from 'path';
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { ScheduleModule } from '@nestjs/schedule';
import { DbContractsModule } from '@mas/db-contracts';
import { TypeOrmAdapter } from '@mas/db-typeorm';
import { EmailModule } from '@mas/nest-email';
import { ALL_ENTITIES } from '../all-entities';
import { SubjectModule } from '../subject/subject.module';
import { VideoJobModule } from '../video-job/video-job.module';
import { EmailEventModule } from '../email-event/email-event.module';
import { SchedulerModule } from '../scheduler/scheduler.module';
import { JobVersionModule } from '../job-version/job-version.module';
import { ClaudeModule } from '../claude/claude.module';
import { ReviewModule } from '../review/review.module';
import { JobAssetModule } from '../job-asset/job-asset.module';
import { RenderModule } from '../render/render.module';
import { WebhookEventModule } from '../webhook-event/webhook-event.module';
import { UploadModule } from '../upload/upload.module';
import { JobLogModule } from '../job-log/job-log.module';
import { StatusTransitionModule } from '../status-transition/status-transition.module';
import { PipelineModule } from '../pipeline/pipeline.module';
import { AppController } from './app.controller';
import { IpWhitelistMiddleware } from './ip-whitelist.middleware';

/**
 * Root application module for mas-videos-generator.
 *
 * Required environment variables (.env at app root):
 *   DATABASE_URL          — full PostgreSQL connection string (video-automizer-db)
 *   JWT_SECRET            — JWT signing secret
 *   NODE_ENV              — environment (development | staging | production)
 *   PORT                  — server port (default: 4444)
 *   GMAIL_CLIENT_ID       — Google OAuth2 client ID
 *   GMAIL_CLIENT_SECRET   — Google OAuth2 client secret
 *   GMAIL_REFRESH_TOKEN   — long-lived refresh token for the sender account
 *   GMAIL_USER_EMAIL      — Gmail address used as From: sender
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
          ssl: (() => {
            const url = config.get<string>('DATABASE_URL') ?? '';
            return url.includes('sslmode=require') || config.get('NODE_ENV') === 'production'
              ? { rejectUnauthorized: false }
              : false;
          })(),
          synchronize: false,
          logging: false,
          entities: [...ALL_ENTITIES],
        }),
      }),
    }),

    EmailModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        provider: 'gmail' as const,
        clientId: cfg.getOrThrow<string>('GMAIL_CLIENT_ID'),
        clientSecret: cfg.getOrThrow<string>('GMAIL_CLIENT_SECRET'),
        refreshToken: cfg.getOrThrow<string>('GMAIL_REFRESH_TOKEN'),
        userEmail: cfg.getOrThrow<string>('GMAIL_USER_EMAIL'),
      }),
    }),

    ScheduleModule.forRoot(),

    SubjectModule,
    VideoJobModule,
    JobVersionModule,
    EmailEventModule,
    SchedulerModule,
    ClaudeModule,
    ReviewModule,
    JobAssetModule,
    WebhookEventModule,
    UploadModule,
    RenderModule,
    JobLogModule,
    StatusTransitionModule,
    PipelineModule,

    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile:
        process.env['NODE_ENV'] === 'production' ? true : join(process.cwd(), 'graphql/schema.gql'),
      playground: true,
      context: ({ req }: { req: unknown }) => ({ req }),
    }),
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IpWhitelistMiddleware).forRoutes('*');
  }
}
