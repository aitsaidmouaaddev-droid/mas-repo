import { Logger } from '@nestjs/common';
import { EmailClient } from '@azure/communication-email';
import type { IEmailProvider } from './email-provider.interface';
import type { AzureEmailOptions, EmailMessage } from '../email.types';

/**
 * Email provider backed by Azure Communication Services.
 * Used by react-fundamentals and any app that configures provider: 'azure'.
 */
export class AzureEmailProvider implements IEmailProvider {
  private readonly client: EmailClient;
  private readonly logger = new Logger(AzureEmailProvider.name);

  constructor(private readonly options: AzureEmailOptions) {
    this.client = new EmailClient(options.connectionString);
  }

  async send(message: EmailMessage): Promise<void> {
    const attachments = message.attachments?.map((a) => ({
      name: a.name,
      contentType: a.contentType,
      contentInBase64: Buffer.isBuffer(a.content) ? a.content.toString('base64') : a.content,
    }));

    const poller = await this.client.beginSend({
      senderAddress: this.options.senderAddress,
      recipients: { to: [{ address: message.to }] },
      content: { subject: message.subject, html: message.html },
      ...(attachments?.length ? { attachments } : {}),
    });

    const result = await poller.pollUntilDone();

    if (result.status === 'Failed') {
      this.logger.error(`Email send failed: ${result.error?.message}`);
      throw new Error(`Email send failed: ${result.error?.message}`);
    }

    this.logger.log(`Email sent to ${message.to} (id: ${result.id})`);
  }
}
