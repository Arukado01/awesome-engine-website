import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { defineSecret, defineString } from 'firebase-functions/params';
import { onRequest } from 'firebase-functions/v2/https';
import { handleContact, HOUR_MS, MAX_BODY_BYTES, parseOrigins } from './contact.js';
import type { Reservation } from './contact.js';
import { sendGmail, sendContactConfirmation } from './gmail.js';

const gmailPassword = defineSecret('GMAIL_APP_PASSWORD');
const turnstileKey = defineSecret('TURNSTILE_SECRET_KEY');
const smtpUser = defineString('SMTP_USER', { default: 'carlosjcortinam@gmail.com' });
const allowedOrigins = defineString('ALLOWED_ORIGINS', { default: '' });
if (!getApps().length) initializeApp();
const db = getFirestore();
const DAY_MS = 24 * HOUR_MS;

async function rateLimit(identity: string, now: number): Promise<boolean> {
  const perClient = db.collection('contactLimits').doc(`client_${identity}`);
  const perDay = db.collection('contactLimits').doc(`global_${Math.floor(now / DAY_MS)}`);
  return db.runTransaction(async (transaction) => {
    const [client, global] = await Promise.all([transaction.get(perClient), transaction.get(perDay)]);
    const clientCount = Number(client.data()?.count ?? 0);
    const globalCount = Number(global.data()?.count ?? 0);
    // These are attempt limits, so invalid CAPTCHA requests consume quota too.
    if (clientCount >= 5 || globalCount >= 200) return false;
    const expiresAt = Timestamp.fromMillis(now + 2 * DAY_MS);
    transaction.set(perClient, { count: clientCount + 1, expiresAt });
    transaction.set(perDay, { count: globalCount + 1, expiresAt });
    return true;
  });
}

async function reserve(requestId: string, payloadHash: string, now: number): Promise<Reservation> {
  const ref = db.collection('contactRequests').doc(requestId);
  return db.runTransaction(async (transaction) => {
    const existing = (await transaction.get(ref)).data();
    if (existing) {
      const createdAt = Number(existing.createdAt);
      if (existing.payloadHash !== payloadHash) return { state: 'conflict', createdAt };
      if (existing.status === 'sent') return { state: 'sent', createdAt };
      if (existing.status === 'uncertain') return { state: 'uncertain', createdAt };
      if (existing.status === 'pending' && Number(existing.lockUntil) <= now) return { state: 'uncertain', createdAt };
      if (Number(existing.lockUntil) > now) return { state: 'busy', createdAt };
      transaction.update(ref, { status: 'pending', lockUntil: now + 60_000 });
      return { state: 'new', createdAt };
    }
    transaction.create(ref, {
      payloadHash, status: 'pending', createdAt: now, lockUntil: now + 60_000,
      expiresAt: Timestamp.fromMillis(now + 7 * DAY_MS),
    });
    return { state: 'new', createdAt: now };
  });
}

async function finish(requestId: string, state: 'sent' | 'failed' | 'uncertain'): Promise<void> {
  await db.collection('contactRequests').doc(requestId).update({ status: state, lockUntil: 0 });
}

export const contact = onRequest({
  region: 'us-central1',
  memory: '256MiB',
  timeoutSeconds: 45,
  minInstances: 0,
  maxInstances: 2,
  concurrency: 10,
  cors: false,
  invoker: 'public',
  secrets: [gmailPassword, turnstileKey],
}, async (request, response) => {
  const origins = parseOrigins(allowedOrigins.value(), process.env.FUNCTIONS_EMULATOR === 'true');
  const origin = request.get('origin') ?? '';
  response.set('Cache-Control', 'no-store, max-age=0');
  response.set('X-Content-Type-Options', 'nosniff');
  response.set('Vary', 'Origin');
  if (origins.includes(origin)) {
    response.set('Access-Control-Allow-Origin', origin);
    response.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.set('Access-Control-Allow-Headers', 'Content-Type');
    response.set('Access-Control-Max-Age', '600');
  }
  if (request.method === 'OPTIONS') {
    response.status(origins.includes(origin) ? 204 : 403).end();
    return;
  }
  if (request.method !== 'POST') {
    response.set('Allow', 'POST, OPTIONS');
    response.status(405).json({ ok: false, message: 'Usa POST para enviar el formulario.' });
    return;
  }
  if (!request.is('application/json')) {
    response.status(415).json({ ok: false, message: 'El contenido debe ser JSON.' });
    return;
  }
  if ((request.rawBody?.byteLength ?? 0) > MAX_BODY_BYTES) {
    response.status(413).json({ ok: false, message: 'El mensaje supera el tamaño permitido.' });
    return;
  }
  const result = await handleContact({
    body: request.body, origin,
    // Do not read a client-provided X-Forwarded-For header directly.
    ip: request.ip || request.socket.remoteAddress || '',
  }, {
    config: { gmailPassword: gmailPassword.value(), turnstileKey: turnstileKey.value(), smtpUser: smtpUser.value(), allowedOrigins: origins },
    now: Date.now, fetch, rateLimit, reserve, finish,
    sendMail: (input, createdAt) => sendGmail(input, createdAt, smtpUser.value(), gmailPassword.value()),
    sendConfirmation: (input, createdAt) => sendContactConfirmation(input, createdAt, smtpUser.value(), gmailPassword.value()),
  });
  if (result.retryAfter) response.set('Retry-After', String(result.retryAfter));
  response.status(result.status).json(result.body);
});
