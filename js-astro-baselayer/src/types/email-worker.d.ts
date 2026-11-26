/** Local type stubs for the email-cloudflare-resend worker API.
 *  These are kept independent of the submodule so the frontend can type-check
 *  even when integrations/email-cloudflare-resend/ is not initialised.
 */

export interface EmailSendRequest {
  from: string;
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
  website?: string;
  turnstileToken: string;
}

export interface EmailSendResponse {
  ok: boolean;
  id?: string;
  error?: string;
  retryAfterSeconds?: number;
}
