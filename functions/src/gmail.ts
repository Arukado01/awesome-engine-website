import nodemailer from 'nodemailer';
import { RECIPIENT } from './contact.js';
import type { ContactInput } from './contact.js';

export type DeliveryOutcome = 'accepted' | 'rejected' | 'uncertain';

export function classifySmtpError(error: unknown): DeliveryOutcome {
  if (typeof error !== 'object' || error === null) return 'uncertain';
  const smtp = error as { code?: string; responseCode?: number };
  // These failures occur before the server accepts message DATA.
  if (smtp.code === 'EAUTH' || (smtp.code === 'EENVELOPE' && Number(smtp.responseCode) >= 400)) return 'rejected';
  // A dropped connection after DATA may still mean Gmail delivered the email.
  return 'uncertain';
}

export async function sendGmail(input: ContactInput, createdAt: number, user: string, password: string): Promise<DeliveryOutcome> {
  const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com', port: 465, secure: true,
    auth: { user, pass: password.replace(/\s/g, '') },
    connectionTimeout: 8_000, greetingTimeout: 5_000, socketTimeout: 12_000,
    disableFileAccess: true, disableUrlAccess: true, logger: false, debug: false,
    tls: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
  });
  try {
    const result = await transport.sendMail({
      from: { name: 'Awesome Engine', address: user }, to: RECIPIENT,
      replyTo: { name: input.name, address: input.email },
      subject: `[Awesome Engine] ${input.subject}`,
      text: `Nombre: ${input.name}\nCorreo: ${input.email}\nAsunto: ${input.subject}\nFecha (UTC): ${new Date(createdAt).toISOString()}\n\n${input.message}`,
      date: new Date(createdAt),
      headers: { 'X-Awesome-Engine-Request': input.requestId },
      disableFileAccess: true, disableUrlAccess: true,
    });
    return result.accepted.some((address) => String(address).toLowerCase() === RECIPIENT) ? 'accepted' : 'rejected';
  } catch (error) { return classifySmtpError(error); }
  finally { transport.close(); }
}
