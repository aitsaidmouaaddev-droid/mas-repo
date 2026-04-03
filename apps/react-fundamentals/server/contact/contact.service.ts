import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '@mas/nest-email';
import type { ContactInput } from './contact.input';

@Injectable()
export class ContactService {
  constructor(
    private readonly emailService: EmailService,
    private readonly config: ConfigService,
  ) {}

  async send(input: ContactInput): Promise<void> {
    const recipient = this.config.getOrThrow<string>('ACS_CONTACT_RECIPIENT');

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New portfolio contact</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 80px;">From</td>
            <td style="padding: 8px;">${input.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Email</td>
            <td style="padding: 8px;"><a href="mailto:${input.email}">${input.email}</a></td>
          </tr>
        </table>
        <hr style="margin: 16px 0; border: none; border-top: 1px solid #eee;" />
        <h3 style="color: #555;">Message</h3>
        <p style="line-height: 1.6; white-space: pre-wrap;">${input.message}</p>
      </div>
    `.trim();

    await this.emailService.send({
      to: recipient,
      subject: `Portfolio contact from ${input.name}`,
      html,
      attachments:
        input.attachmentBase64 && input.attachmentName && input.attachmentType
          ? [
              {
                name: input.attachmentName,
                contentType: input.attachmentType,
                content: input.attachmentBase64,
              },
            ]
          : undefined,
    });
  }
}
