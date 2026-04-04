import { Logger } from '@nestjs/common';
import { google } from 'googleapis';
import type { gmail_v1 } from 'googleapis';
import type { IEmailProvider, IEmailReceiver, InboundEmail } from './email-provider.interface';
import type { EmailMessage, GmailEmailOptions } from '../email.types';

/**
 * Email provider backed by Gmail API (OAuth2).
 * Implements both IEmailProvider (send) and IEmailReceiver (poll inbound).
 *
 * Used by mas-videos-generator for the full email workflow:
 *   - Sending trigger / review / notification emails
 *   - Polling replies for the revision loop
 */
export class GmailEmailProvider implements IEmailProvider, IEmailReceiver {
  private readonly gmail: gmail_v1.Gmail;
  private readonly logger = new Logger(GmailEmailProvider.name);

  constructor(private readonly options: GmailEmailOptions) {
    const auth = new google.auth.OAuth2(options.clientId, options.clientSecret);
    auth.setCredentials({ refresh_token: options.refreshToken });
    this.gmail = google.gmail({ version: 'v1', auth });
  }

  // ---------------------------------------------------------------------------
  // IEmailProvider
  // ---------------------------------------------------------------------------

  async send(message: EmailMessage): Promise<void> {
    const raw = this.buildRawMime(message);
    await this.gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw },
    });
    this.logger.log(`Gmail: sent email to ${message.to} — "${message.subject}"`);
  }

  // ---------------------------------------------------------------------------
  // IEmailReceiver
  // ---------------------------------------------------------------------------

  async pollNewMessages(since: Date): Promise<InboundEmail[]> {
    const afterSeconds = Math.floor(since.getTime() / 1000);
    const query = `in:inbox after:${afterSeconds}`;

    const listRes = await this.gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults: 50,
    });

    const messageIds = listRes.data.messages ?? [];
    if (messageIds.length === 0) return [];

    const emails = await Promise.all(messageIds.map((m) => this.fetchMessage(m.id as string)));

    return emails.filter((e): e is InboundEmail => e !== null);
  }

  async markProcessed(messageId: string): Promise<void> {
    await this.gmail.users.messages.modify({
      userId: 'me',
      id: messageId,
      requestBody: { removeLabelIds: ['UNREAD'] },
    });
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private buildRawMime(message: EmailMessage): string {
    const boundary = `boundary_${Date.now()}`;
    const lines: string[] = [
      `From: ${this.options.userEmail}`,
      `To: ${message.to}`,
      `Subject: ${message.subject}`,
      'MIME-Version: 1.0',
      `Content-Type: multipart/mixed; boundary="${boundary}"`,
      '',
      `--${boundary}`,
      'Content-Type: text/html; charset=utf-8',
      'Content-Transfer-Encoding: base64',
      '',
      Buffer.from(message.html, 'utf-8').toString('base64'),
    ];

    if (message.attachments?.length) {
      for (const att of message.attachments) {
        const content = Buffer.isBuffer(att.content) ? att.content.toString('base64') : att.content;
        lines.push(
          `--${boundary}`,
          `Content-Type: ${att.contentType}; name="${att.name}"`,
          'Content-Transfer-Encoding: base64',
          `Content-Disposition: attachment; filename="${att.name}"`,
          '',
          content,
        );
      }
    }

    lines.push(`--${boundary}--`);
    return Buffer.from(lines.join('\r\n'), 'utf-8')
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  private async fetchMessage(messageId: string): Promise<InboundEmail | null> {
    try {
      const res = await this.gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'full',
      });

      const msg = res.data;
      const headers = msg.payload?.headers ?? [];
      const get = (name: string) =>
        headers.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value ?? '';

      const from = get('From');
      const subject = get('Subject');
      const dateHeader = get('Date');
      const receivedAt = dateHeader ? new Date(dateHeader) : new Date();

      const { bodyText, bodyHtml } = this.extractBodies(msg.payload);

      return {
        messageId: msg.id as string,
        threadId: msg.threadId as string,
        from,
        subject,
        bodyText,
        bodyHtml,
        receivedAt,
      };
    } catch {
      this.logger.warn(`Gmail: failed to fetch message ${messageId}`);
      return null;
    }
  }

  private extractBodies(payload: gmail_v1.Schema$MessagePart | undefined): {
    bodyText?: string;
    bodyHtml?: string;
  } {
    if (!payload) return {};

    const decode = (data?: string | null) =>
      data
        ? Buffer.from(data.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8')
        : undefined;

    if (payload.mimeType === 'text/plain') {
      return { bodyText: decode(payload.body?.data) };
    }
    if (payload.mimeType === 'text/html') {
      return { bodyHtml: decode(payload.body?.data) };
    }

    let bodyText: string | undefined;
    let bodyHtml: string | undefined;

    for (const part of payload.parts ?? []) {
      if (part.mimeType === 'text/plain' && !bodyText) {
        bodyText = decode(part.body?.data);
      } else if (part.mimeType === 'text/html' && !bodyHtml) {
        bodyHtml = decode(part.body?.data);
      } else if (part.parts?.length) {
        const nested = this.extractBodies(part);
        if (!bodyText && nested.bodyText) bodyText = nested.bodyText;
        if (!bodyHtml && nested.bodyHtml) bodyHtml = nested.bodyHtml;
      }
    }

    return { bodyText, bodyHtml };
  }
}
