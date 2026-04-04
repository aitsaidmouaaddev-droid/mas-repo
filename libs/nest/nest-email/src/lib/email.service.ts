import { Inject, Injectable } from '@nestjs/common';
import { EMAIL_OPTIONS, EMAIL_PROVIDER } from './email.tokens';
import type { IEmailProvider } from './providers/email-provider.interface';
import type { EmailMessage, EmailModuleOptions } from './email.types';

@Injectable()
export class EmailService {
  constructor(
    @Inject(EMAIL_PROVIDER) private readonly provider: IEmailProvider,
    @Inject(EMAIL_OPTIONS) private readonly options: EmailModuleOptions,
  ) {}

  async send(message: EmailMessage): Promise<void> {
    return this.provider.send(message);
  }

  /**
   * Render a named template with data, then send.
   * Templates are registered via EmailModule.forRootAsync() options.
   */
  async sendTemplate<T = unknown>(
    templateName: string,
    data: T,
    opts: { to: string; subject: string },
  ): Promise<void> {
    const templateFn = this.options.templates?.[templateName];
    if (!templateFn) {
      throw new Error(`Email template "${templateName}" is not registered.`);
    }
    const html = templateFn(data);
    await this.send({ to: opts.to, subject: opts.subject, html });
  }
}
