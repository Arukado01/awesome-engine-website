import nodemailer from 'nodemailer';
import { RECIPIENT } from './contact.js';
import { buildContactEmail } from './email-template.js';
import type { ContactInput } from './contact.js';

export type DeliveryOutcome = 'accepted' | 'rejected' | 'uncertain';

export function classifySmtpError(error: unknown): DeliveryOutcome {
  if (typeof error !== 'object' || error === null) return 'uncertain';
  const smtp = error as { code?: string; responseCode?: number };
  // These failures occur before the server accepts message DATA.
  if (smtp.code === 'EAUTH' || (smtp.code === 'EENVELOPE' && Number(smtp.responseCode) >= 400)) return 'rejected';
  return 'uncertain';
}

function createTransport(user: string, password: string) {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com', port: 465, secure: true,
    auth: { user, pass: password.replace(/\s/g, '') },
    connectionTimeout: 8_000, greetingTimeout: 5_000, socketTimeout: 12_000,
    disableFileAccess: true, disableUrlAccess: true, logger: false, debug: false,
    tls: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
  });
}

export async function sendGmail(input: ContactInput, createdAt: number, user: string, password: string): Promise<DeliveryOutcome> {
  const transport = createTransport(user, password);
  try {
    const result = await transport.sendMail(buildContactEmail(input, createdAt, user, 'owner'));
    return result.accepted.some((address) => String(address).toLowerCase() === RECIPIENT) ? 'accepted' : 'rejected';
  } catch (error) { return classifySmtpError(error); }
  finally { transport.close(); }
}

export async function sendContactConfirmation(input: ContactInput, createdAt: number, user: string, password: string): Promise<void> {
  const transport = createTransport(user, password);
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const deadline = new Promise<never>((_resolve, reject) => {
      timer = setTimeout(() => reject(new Error('Confirmation timed out')), 7_000);
    });
    const result = await Promise.race([transport.sendMail(buildContactEmail(input, createdAt, user, 'confirmation')), deadline]);
    if (!result.accepted.some((address) => String(address).toLowerCase() === input.email.toLowerCase())) throw new Error('Confirmation was rejected');
  } finally {
    if (timer) clearTimeout(timer);
    transport.close();
  }
}