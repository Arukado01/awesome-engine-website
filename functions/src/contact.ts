import { createHmac } from 'node:crypto';

export const RECIPIENT = 'carlosjcortinam@gmail.com';
export const MAX_BODY_BYTES = 16_384;
export const HOUR_MS = 3_600_000;

export interface ContactInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  website: string;
  turnstileToken: string;
  requestId: string;
  locale?: string;
}
export interface ContactConfig {
  gmailPassword: string;
  turnstileKey: string;
  smtpUser: string;
  allowedOrigins: string[];
}
export interface Result {
  status: number;
  body: { ok: boolean; message: string; errors?: Record<string, string>; code?: string };
  retryAfter?: number;
}
export interface Reservation {
  state: 'new' | 'sent' | 'busy' | 'conflict' | 'uncertain';
  createdAt: number;
}
export interface ContactDependencies {
  config: ContactConfig;
  now: () => number;
  fetch: typeof fetch;
  rateLimit: (identity: string, now: number) => Promise<boolean>;
  reserve: (requestId: string, payloadHash: string, now: number) => Promise<Reservation>;
  finish: (requestId: string, state: 'sent' | 'failed' | 'uncertain') => Promise<void>;
  sendMail: (input: ContactInput, createdAt: number) => Promise<'accepted' | 'rejected' | 'uncertain'>;
  sendConfirmation: (input: ContactInput, createdAt: number) => Promise<void>;
}
export interface ContactRequest {
  body: unknown;
  origin: string;
  ip: string;
}

export function keyedHash(value: string, secret: string): string {
  return createHmac('sha256', secret).update(value).digest('hex');
}

export function parseOrigins(value: string, emulator = false): string[] {
  return value.split(',').map((item) => item.trim()).filter((item) => {
    try {
      const url = new URL(item);
      const secure = url.protocol === 'https:';
      const local = emulator && url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname);
      return (secure || local) && url.origin === item;
    } catch { return false; }
  });
}

export function validateInput(body: unknown): { input?: ContactInput; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return { errors: { form: 'Envía un objeto JSON válido.' } };
  }
  const source = body as Record<string, unknown>;
  const read = (key: string) => typeof source[key] === 'string' ? (source[key] as string).trim() : '';
  const input: ContactInput = {
    name: read('name'), email: read('email').toLowerCase(), subject: read('subject'),
    message: read('message').replace(/\r\n/g, '\n'), website: read('website'),
    turnstileToken: read('turnstileToken'), requestId: read('requestId').toLowerCase(),
    locale: read('locale').slice(0, 16),
  };
  for (const [key, min, max] of [['name', 2, 80], ['subject', 3, 160], ['message', 20, 5_000]] as const) {
    if (input[key].length < min || input[key].length > max) errors[key] = `Usa entre ${min} y ${max} caracteres.`;
  }
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/u.test(input.email) || /[\u0000-\u001f\u007f]/u.test(input.email) || input.email.length > 254) {
    errors.email = 'Introduce un correo electrónico válido.';
  }
  if (/[\r\n\u0000-\u001f\u007f]/u.test(input.name)) errors.name = 'El nombre contiene caracteres no válidos.';
  if (/[\r\n\u0000-\u001f\u007f]/u.test(input.subject)) errors.subject = 'El asunto contiene caracteres no válidos.';
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(input.message)) errors.message = 'El mensaje contiene caracteres no válidos.';
  if (!input.turnstileToken || input.turnstileToken.length > 2_048) errors.turnstileToken = 'Completa la verificación contra spam.';
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu.test(input.requestId)) {
    errors.requestId = 'Identificador de envío no válido. Recarga la página.';
  }
  return Object.keys(errors).length ? { errors } : { input, errors };
}

function failure(status: number, message: string, retryAfter?: number, code?: string): Result {
  return { status, body: { ok: false, message, ...(code ? { code } : {}) }, ...(retryAfter ? { retryAfter } : {}) };
}
const success = (): Result => ({ status: 201, body: { ok: true, message: 'Tu mensaje fue aceptado por el servicio de correo. Gracias por escribir.' } });

export async function handleContact(request: ContactRequest, deps: ContactDependencies): Promise<Result> {
  const { config } = deps;
  if (!config.gmailPassword || !config.turnstileKey || !config.smtpUser || !config.allowedOrigins.length) {
    return failure(503, 'El envío de mensajes todavía no está habilitado. Inténtalo más tarde.');
  }
  if (!config.allowedOrigins.includes(request.origin)) return failure(403, 'Este origen no está autorizado.');
  if (!request.ip) return failure(503, 'No pudimos verificar la conexión. Inténtalo de nuevo.');
  const parsed = validateInput(request.body);
  if (!parsed.input) return { status: 400, body: { ok: false, message: 'Revisa los campos indicados.', errors: parsed.errors } };
  const input = parsed.input;
  if (input.website) return failure(403, 'No se pudo validar el envío.');
  const now = deps.now();
  try {
    // Rotate the hash hourly: no raw IP addresses are persisted.
    const identity = keyedHash(`${Math.floor(now / HOUR_MS)}:${request.ip}`, config.turnstileKey);
    if (!(await deps.rateLimit(identity, now))) return failure(429, 'Se alcanzó el límite de envíos. Vuelve a intentarlo en una hora.', 3_600);
  } catch { return failure(503, 'El servicio de contacto no está disponible temporalmente.', 60); }
  try {
    const verification = await deps.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: config.turnstileKey, response: input.turnstileToken, remoteip: request.ip }),
      signal: AbortSignal.timeout(8_000),
    });
    if (!verification.ok) return failure(503, 'La verificación contra spam no está disponible. Inténtalo de nuevo.');
    const verified = await verification.json() as { success?: boolean; hostname?: string; action?: string };
    if (verified.success !== true || verified.hostname !== new URL(request.origin).hostname || verified.action !== 'contact') {
      return failure(403, 'La verificación contra spam expiró o no es válida. Complétala de nuevo.');
    }
  } catch { return failure(503, 'No pudimos conectar con la verificación contra spam. Inténtalo de nuevo.'); }

  const payloadHash = keyedHash(JSON.stringify([input.name, input.email, input.subject, input.message]), config.turnstileKey);
  let reservation: Reservation;
  try { reservation = await deps.reserve(input.requestId, payloadHash, now); }
  catch { return failure(503, 'No pudimos preparar el envío. Inténtalo de nuevo.', 60); }
  if (reservation.state === 'sent') return success();
  if (reservation.state === 'busy') return failure(409, 'Este mensaje ya se está enviando. Espera unos segundos antes de reintentarlo.', 60, 'request_in_progress');
  if (reservation.state === 'conflict') return failure(409, 'Este identificador ya pertenece a otro mensaje. Inicia un nuevo envío.');
  if (reservation.state === 'uncertain') return failure(409, 'No podemos confirmar si este mensaje se envió. Para evitar duplicados, este intento no se reenviará. Espera una respuesta antes de iniciar otro.', undefined, 'delivery_uncertain');

  let delivery: 'accepted' | 'rejected' | 'uncertain';
  try { delivery = await deps.sendMail(input, reservation.createdAt); }
  catch { delivery = 'uncertain'; }
  const state = delivery === 'accepted' ? 'sent' : delivery === 'rejected' ? 'failed' : 'uncertain';
  try { await deps.finish(input.requestId, state); }
  catch {
    // A stale pending lease becomes uncertain, never an automatic SMTP retry.
  }
  if (delivery === 'accepted') {
    try { await deps.sendConfirmation(input, reservation.createdAt); }
    catch { console.warn('Contact confirmation could not be delivered.'); }
    return success();
  }
  if (delivery === 'rejected') return failure(502, 'Gmail rechazó el envío. Conserva tu mensaje e inténtalo más tarde.', undefined, 'smtp_rejected');
  return failure(502, 'No pudimos confirmar si Gmail aceptó el mensaje. Para evitar duplicados, este intento no se reenviará. Espera una respuesta antes de iniciar otro.', undefined, 'delivery_uncertain');
}
