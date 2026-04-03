export { EmailModule, EMAIL_OPTIONS, EMAIL_PROVIDER, EMAIL_RECEIVER } from './lib/email.module';
export type { EmailModuleAsyncOptions } from './lib/email.module';
export { EmailService } from './lib/email.service';
export type {
  EmailModuleOptions,
  AzureEmailOptions,
  GmailEmailOptions,
  EmailMessage,
  EmailAttachment,
  TemplateFn,
} from './lib/email.types';
export type {
  IEmailProvider,
  IEmailReceiver,
  InboundEmail,
} from './lib/providers/email-provider.interface';
