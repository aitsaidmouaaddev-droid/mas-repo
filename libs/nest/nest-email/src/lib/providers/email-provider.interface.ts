/**
 * Contract for outbound email sending.
 * Implemented by AzureEmailProvider and GmailEmailProvider.
 */
export interface IEmailProvider {
  send(message: import('../email.types').EmailMessage): Promise<void>;
}

/**
 * Contract for inbound email polling.
 * Only implemented by GmailEmailProvider.
 */
export interface IEmailReceiver {
  /**
   * Poll for new messages received after `since`.
   * Returns an array of parsed inbound emails (newest first).
   */
  pollNewMessages(since: Date): Promise<InboundEmail[]>;

  /** Signal to the provider that this message has been processed. */
  markProcessed(messageId: string): Promise<void>;
}

/**
 * A parsed inbound email message.
 */
export interface InboundEmail {
  /** Gmail message ID */
  messageId: string;
  /** Gmail thread ID — used to group conversations */
  threadId: string;
  /** Sender address */
  from: string;
  /** Email subject */
  subject: string;
  /** Plain-text body (preferred for instruction parsing) */
  bodyText?: string;
  /** HTML body */
  bodyHtml?: string;
  /** UTC timestamp when the message was received */
  receivedAt: Date;
}
