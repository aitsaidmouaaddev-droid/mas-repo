/**
 * A function that accepts typed data and returns an HTML string.
 * Define these in the consuming app and pass them via EmailModule.forRootAsync().
 */
export type TemplateFn<T> = (data: T) => string;

/**
 * A file attachment for an outbound email.
 */
export interface EmailAttachment {
  /** Filename shown to the recipient (e.g. "cv-john.pdf"). */
  name: string;
  /** MIME type (e.g. "application/pdf", "image/png"). */
  contentType: string;
  /** File content — either a Buffer or an already-encoded base64 string. */
  content: Buffer | string;
}

/**
 * Describes a single outbound email message.
 */
export interface EmailMessage {
  /** Recipient address. */
  to: string;
  /** Email subject line. */
  subject: string;
  /** HTML body content. */
  html: string;
  /** Optional file attachments. */
  attachments?: EmailAttachment[];
}

// ---------------------------------------------------------------------------
// Provider-specific options
// ---------------------------------------------------------------------------

/**
 * Options for the Azure Communication Services provider.
 * This is the default provider — omitting `provider` defaults to 'azure'.
 * Backward-compatible with existing EmailModule.forRootAsync() consumers.
 */
export interface AzureEmailOptions {
  provider?: 'azure';
  /** Azure Communication Services connection string. */
  connectionString: string;
  /** The verified sender address (e.g. "DoNotReply@<hash>.azurecomm.net"). */
  senderAddress: string;
  /** Optional map of named template functions — each returns an HTML string. */
  templates?: Record<string, TemplateFn<unknown>>;
}

/**
 * Options for the Gmail API provider (OAuth2).
 * Supports both sending emails and polling inbound messages.
 */
export interface GmailEmailOptions {
  provider: 'gmail';
  /** Google OAuth2 client ID. */
  clientId: string;
  /** Google OAuth2 client secret. */
  clientSecret: string;
  /** Long-lived refresh token for the sender account. */
  refreshToken: string;
  /** Gmail address used as the From: sender. */
  userEmail: string;
  /** Optional map of named template functions — each returns an HTML string. */
  templates?: Record<string, TemplateFn<unknown>>;
}

/**
 * Union of all provider-specific option shapes.
 * Used as the return type of EmailModule.forRootAsync() useFactory.
 */
export type EmailModuleOptions = AzureEmailOptions | GmailEmailOptions;
