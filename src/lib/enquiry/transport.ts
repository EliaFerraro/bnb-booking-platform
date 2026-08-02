import nodemailer, { type Transporter } from "nodemailer";

/**
 * The only Gmail/nodemailer-specific file. Swapping to Resend (or anything
 * else) once a custom domain exists means rewriting this module and nothing
 * above it.
 */

let cachedTransport: Transporter | null = null;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/** Gmail requires the From address to be the authenticated account. */
export function senderAddress(): string {
  return requireEnv("SMTP_USER");
}

export function hostInbox(): string {
  return process.env.ENQUIRY_TO || senderAddress();
}

export function structureName(): string {
  return process.env.STRUCTURE_NAME || "Il Respiro del Borgo";
}

function getTransport(): Transporter {
  if (!cachedTransport) {
    cachedTransport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: requireEnv("SMTP_USER"),
        pass: requireEnv("SMTP_APP_PASSWORD"),
      },
    });
  }
  return cachedTransport;
}

export interface OutgoingMail {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}

export async function sendMail({ to, subject, text, replyTo }: OutgoingMail) {
  await getTransport().sendMail({
    from: `"${structureName()}" <${senderAddress()}>`,
    to,
    subject,
    text,
    replyTo,
  });
}
