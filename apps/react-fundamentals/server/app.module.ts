import 'reflect-metadata';
import { join } from 'path';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { json, urlencoded } from 'express';
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
import { AgendaModule } from './agenda/agenda.module';

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
      context: ({ req, res }: { req: unknown; res: unknown }) => ({ req, res }),
      // bodyParserConfig: false — body parsing is handled by the NestModule middleware below
      // so Apollo does not add its own parser (which would silently apply a lower default limit
      // with @apollo/server v5 when bodyParserConfig is set to an object).
      bodyParserConfig: false,
    }),

    EmailModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connectionString: config.getOrThrow<string>('ACS_CONNECTION_STRING'),
        senderAddress: config.getOrThrow<string>('ACS_SENDER_ADDRESS'),
        templates: {
          'agenda-otp': (data: unknown) => {
            const { code } = data as { code: string };
            return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"/><title>Code OTP Agenda</title></head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="max-width:480px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.1);">
        <tr><td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px 40px;text-align:center;">
          <h1 style="margin:0;font-size:20px;font-weight:700;color:#fff;">🔐 Code d'accès agenda</h1>
        </td></tr>
        <tr><td style="padding:40px;text-align:center;">
          <p style="margin:0 0 24px;font-size:15px;color:#374151;">Votre code à usage unique (valable 10 minutes) :</p>
          <div style="display:inline-block;background:#f0f0ff;border:2px solid #6366f1;border-radius:12px;padding:16px 40px;margin-bottom:24px;">
            <span style="font-size:36px;font-weight:800;letter-spacing:10px;color:#6366f1;">${code}</span>
          </div>
          <p style="margin:0;font-size:13px;color:#9ca3af;">Ne partagez pas ce code.</p>
        </td></tr>
        <tr><td style="background:#f8f9ff;border-top:1px solid #e5e7eb;padding:16px 40px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">mouaad.dev — Agenda privé</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
          },
          'agenda-reminder': (data: unknown) => {
            const { eventTitle, eventStart } = data as { eventTitle: string; eventStart: string };
            const formatted = new Date(eventStart).toLocaleString('fr-FR', {
              dateStyle: 'full',
              timeStyle: 'short',
              timeZone: 'Europe/Paris',
            });
            return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"/><title>Rappel agenda</title></head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="max-width:480px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.1);">
        <tr><td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px 40px;text-align:center;">
          <h1 style="margin:0;font-size:20px;font-weight:700;color:#fff;">📅 Rappel d'événement</h1>
        </td></tr>
        <tr><td style="padding:40px;">
          <p style="margin:0 0 8px;font-size:20px;font-weight:700;color:#1e1b4b;">${eventTitle}</p>
          <p style="margin:0;font-size:15px;color:#6366f1;">${formatted}</p>
        </td></tr>
        <tr><td style="background:#f8f9ff;border-top:1px solid #e5e7eb;padding:16px 40px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">mouaad.dev — Agenda privé</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
          },
        },
      }),
    }),

    AuthModule.register({ methods: ['local', 'google', 'passwordReset'] }),
    LearningModule,
    GamesModule,
    ContactModule,
    AgendaModule,
  ],
  controllers: [HealthController],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule implements NestModule {
  /** Register body-size limits BEFORE any route handler (including Apollo's sub-router). */
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(json({ limit: '20mb' }), urlencoded({ limit: '20mb', extended: true }))
      .forRoutes('*');
  }
}
