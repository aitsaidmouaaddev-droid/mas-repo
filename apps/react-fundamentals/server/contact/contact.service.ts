import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '@mas/nest-email';
import type { ContactInput } from './contact.input';

const RECIPIENT = 'aitsaidmouaad.dev@gmail.com';

function buildContactEmailHtml(input: ContactInput): string {
  const now = new Date().toLocaleString('fr-FR', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Europe/Paris',
  });

  const hasAttachment = !!(input.attachmentBase64 && input.attachmentName);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New portfolio contact</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);padding:36px 40px;text-align:center;">
              <div style="display:inline-block;width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,0.2);line-height:56px;font-size:22px;font-weight:700;color:#fff;margin-bottom:12px;">MA</div>
              <h1 style="margin:0;font-size:22px;font-weight:700;color:#fff;letter-spacing:-0.3px;">New Portfolio Contact</h1>
              <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.75);">${now}</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:36px 40px;">

              <!-- Sender card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9ff;border:1px solid #e5e7ff;border-radius:10px;margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;color:#6366f1;">Sender</p>
                    <p style="margin:0 0 12px;font-size:20px;font-weight:700;color:#1e1b4b;">${escapeHtml(input.name)}</p>
                    <a href="mailto:${escapeHtml(input.email)}"
                       style="display:inline-flex;align-items:center;gap:6px;color:#6366f1;font-size:14px;text-decoration:none;font-weight:500;">
                      ✉ ${escapeHtml(input.email)}
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Message -->
              <p style="margin:0 0 10px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;color:#6b7280;">Message</p>
              <div style="background:#fafafa;border-left:4px solid #6366f1;border-radius:0 8px 8px 0;padding:20px 24px;margin-bottom:28px;">
                <p style="margin:0;font-size:15px;line-height:1.75;color:#374151;white-space:pre-wrap;">${escapeHtml(input.message)}</p>
              </div>

              <!-- Attachment badge -->
              ${
                hasAttachment
                  ? `<div style="display:inline-block;background:#ede9fe;border:1px solid #c4b5fd;border-radius:8px;padding:10px 16px;margin-bottom:28px;">
                <p style="margin:0;font-size:13px;color:#5b21b6;">
                  📎 <strong>${escapeHtml(input.attachmentName!)}</strong> is attached to this email.
                </p>
              </div>`
                  : ''
              }

              <!-- Reply CTA -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
                <tr>
                  <td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:8px;padding:0;">
                    <a href="mailto:${escapeHtml(input.email)}?subject=Re: Your message"
                       style="display:inline-block;padding:13px 28px;color:#fff;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;letter-spacing:0.2px;">
                      ↩ Reply to ${escapeHtml(input.name)}
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8f9ff;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                Sent via the contact form on <strong style="color:#6366f1;">mouaad.dev</strong>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

@Injectable()
export class ContactService {
  constructor(
    private readonly emailService: EmailService,
    private readonly config: ConfigService,
  ) {}

  async send(input: ContactInput): Promise<void> {
    const recipient = this.config.get<string>('ACS_CONTACT_RECIPIENT') ?? RECIPIENT;

    await this.emailService.send({
      to: recipient,
      subject: `[Portfolio] New message from ${input.name}`,
      html: buildContactEmailHtml(input),
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
