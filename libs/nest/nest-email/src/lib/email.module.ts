import type { DynamicModule, FactoryProvider, ModuleMetadata } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { AzureEmailProvider } from './providers/azure.provider';
import { GmailEmailProvider } from './providers/gmail.provider';
import type { EmailModuleOptions, AzureEmailOptions, GmailEmailOptions } from './email.types';
import type { IEmailProvider, IEmailReceiver } from './providers/email-provider.interface';
import { EMAIL_OPTIONS, EMAIL_PROVIDER, EMAIL_RECEIVER } from './email.tokens';

export { EMAIL_OPTIONS, EMAIL_PROVIDER, EMAIL_RECEIVER } from './email.tokens';

export interface EmailModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: FactoryProvider['inject'];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useFactory: (...args: any[]) => EmailModuleOptions | Promise<EmailModuleOptions>;
}

/**
 * Global provider-based email module.
 *
 * **Azure (default — backward-compatible):**
 * ```ts
 * EmailModule.forRootAsync({
 *   inject: [ConfigService],
 *   useFactory: (cfg: ConfigService) => ({
 *     connectionString: cfg.getOrThrow('ACS_CONNECTION_STRING'),
 *     senderAddress:    cfg.getOrThrow('ACS_SENDER_ADDRESS'),
 *   }),
 * })
 * ```
 *
 * **Gmail (send + receive):**
 * ```ts
 * EmailModule.forRootAsync({
 *   inject: [ConfigService],
 *   useFactory: (cfg: ConfigService) => ({
 *     provider:      'gmail',
 *     clientId:      cfg.getOrThrow('GMAIL_CLIENT_ID'),
 *     clientSecret:  cfg.getOrThrow('GMAIL_CLIENT_SECRET'),
 *     refreshToken:  cfg.getOrThrow('GMAIL_REFRESH_TOKEN'),
 *     userEmail:     cfg.getOrThrow('GMAIL_USER_EMAIL'),
 *   }),
 * })
 * ```
 *
 * Inject `EMAIL_RECEIVER` (with `@Optional()`) to poll inbound messages.
 */
@Global()
@Module({})
export class EmailModule {
  static forRootAsync(options: EmailModuleAsyncOptions): DynamicModule {
    const optionsProvider: FactoryProvider = {
      provide: EMAIL_OPTIONS,
      inject: options.inject ?? [],
      useFactory: options.useFactory,
    };

    const emailProviderFactory: FactoryProvider = {
      provide: EMAIL_PROVIDER,
      inject: [EMAIL_OPTIONS],
      useFactory: (opts: EmailModuleOptions): IEmailProvider => {
        if (opts.provider === 'gmail') {
          return new GmailEmailProvider(opts as GmailEmailOptions);
        }
        return new AzureEmailProvider(opts as AzureEmailOptions);
      },
    };

    const receiverProviderFactory: FactoryProvider = {
      provide: EMAIL_RECEIVER,
      inject: [EMAIL_OPTIONS],
      useFactory: (opts: EmailModuleOptions): IEmailReceiver | null => {
        if (opts.provider === 'gmail') {
          return new GmailEmailProvider(opts as GmailEmailOptions);
        }
        return null;
      },
    };

    return {
      module: EmailModule,
      global: true,
      imports: options.imports ?? [],
      providers: [optionsProvider, emailProviderFactory, receiverProviderFactory, EmailService],
      exports: [EmailService, EMAIL_RECEIVER],
    };
  }
}
