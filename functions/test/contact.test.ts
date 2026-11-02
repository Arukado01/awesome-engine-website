import test from 'node:test';
import assert from 'node:assert/strict';
import { handleContact, parseOrigins, validateInput } from '../src/contact.js';
import { classifySmtpError } from '../src/gmail.js';
import type { ContactDependencies, ContactInput } from '../src/contact.js';

const input: ContactInput = {
  name: 'Carlos Demo', email: 'demo@example.com', subject: 'Consulta del motor',
  message: 'Quiero conocer mejor el sistema de escenas del motor.', website: '',
  turnstileToken: 'test-token-never-used-in-production', requestId: 'a987fbc9-4bed-4078-8f07-9141ba07c9f3',
};
const origin = 'https://engine.example.com';
function setup(options: { verified?: unknown; delivery?: 'accepted' | 'rejected' | 'uncertain' } = {}) {
  const calls: { url: string; init?: RequestInit }[] = [];
  const finishes: string[] = [];
  const mail: { input: ContactInput; createdAt: number }[] = [];
  const deps: ContactDependencies = {
    config: { gmailPassword: 'test-app-password', turnstileKey: 'test-turnstile-key', smtpUser: 'carlosjcortinam@gmail.com', allowedOrigins: [origin] },
    now: () => Date.UTC(2026, 10, 1, 12), rateLimit: async () => true,
    reserve: async () => ({ state: 'new', createdAt: Date.UTC(2026, 10, 1, 12) }),
    finish: async (_id, state) => { finishes.push(state); },
    sendMail: async (input, createdAt) => { mail.push({ input, createdAt }); return options.delivery ?? 'accepted'; },
    sendConfirmation: async () => {},
    fetch: (async (url: string | URL | Request, init?: RequestInit) => {
      calls.push({ url: String(url), init });
      return Response.json(options.verified ?? { success: true, hostname: 'engine.example.com', action: 'contact' });
    }) as typeof fetch,
  };
  return { deps, calls, finishes, mail, request: { body: input, origin, ip: '192.0.2.1' } };
}

test('rejects invalid fields and header injection before contacting services', async () => {
  const { deps, calls, request, mail } = setup();
  request.body = { ...input, email: 'invalid', subject: 'Hi\r\nBcc: victim@example.com', message: 'short' };
  const result = await handleContact(request, deps);
  assert.equal(result.status, 400);
  assert.deepEqual(Object.keys(result.body.errors ?? {}).sort(), ['email', 'message', 'subject']);
  assert.equal(calls.length, 0);
  assert.equal(mail.length, 0);
});

test('fails closed when Gmail credentials are absent', async () => {
  const { deps, calls, request, mail } = setup();
  deps.config.gmailPassword = '';
  const result = await handleContact(request, deps);
  assert.equal(result.status, 503);
  assert.equal(result.body.ok, false);
  assert.equal(calls.length, 0);
  assert.equal(mail.length, 0);
});

test('enforces exact origin and honeypot', async () => {
  const { deps, calls, request, mail } = setup();
  assert.equal((await handleContact({ ...request, origin: 'https://engine.example.com.evil.test' }, deps)).status, 403);
  assert.equal((await handleContact({ ...request, body: { ...input, website: 'bot' } }, deps)).status, 403);
  assert.equal(calls.length, 0);
  assert.equal(mail.length, 0);
});

test('global or client limit blocks CAPTCHA and email', async () => {
  const { deps, calls, request, mail } = setup();
  deps.rateLimit = async () => false;
  const result = await handleContact(request, deps);
  assert.equal(result.status, 429);
  assert.equal(result.retryAfter, 3600);
  assert.equal(calls.length, 0);
  assert.equal(mail.length, 0);
});

test('rate storage failure blocks sending', async () => {
  const { deps, calls, request } = setup();
  deps.rateLimit = async () => { throw new Error('storage unavailable'); };
  assert.equal((await handleContact(request, deps)).status, 503);
  assert.equal(calls.length, 0);
});

for (const verified of [
  { success: false, hostname: 'engine.example.com', action: 'contact' },
  { success: true, hostname: 'evil.test', action: 'contact' },
  { success: true, hostname: 'engine.example.com', action: 'login' },
]) test(`rejects invalid CAPTCHA ${JSON.stringify(verified)}`, async () => {
  const { deps, mail, request } = setup({ verified });
  assert.equal((await handleContact(request, deps)).status, 403);
  assert.equal(mail.length, 0);
});

test('returns success only after SMTP adapter confirms acceptance', async () => {
  const { deps, mail, finishes, request } = setup();
  const result = await handleContact(request, deps);
  assert.equal(result.status, 201);
  assert.equal(result.body.ok, true);
  assert.equal(mail.length, 1);
  assert.equal(mail[0]?.createdAt, Date.UTC(2026, 10, 1, 12));
  assert.deepEqual(finishes, ['sent']);
});

test('explicit SMTP rejection is never reported as success and remains retryable', async () => {
  const { deps, request, finishes } = setup({ delivery: 'rejected' });
  assert.equal((await handleContact(request, deps)).status, 502);
  assert.deepEqual(finishes, ['failed']);
});

test('ambiguous SMTP failure is persisted as uncertain to prevent duplicate delivery', async () => {
  const { deps, request, finishes } = setup({ delivery: 'uncertain' });
  const result = await handleContact(request, deps);
  assert.equal(result.status, 502);
  assert.match(result.body.message, /no se reenviará/);
  assert.equal(result.body.code, 'delivery_uncertain');
  assert.deepEqual(finishes, ['uncertain']);
});

test('unhandled SMTP error is treated as uncertain, not retryable', async () => {
  const { deps, request, finishes } = setup();
  deps.sendMail = async () => { throw new Error('connection lost after DATA'); };
  assert.equal((await handleContact(request, deps)).status, 502);
  assert.deepEqual(finishes, ['uncertain']);
});

test('previous accepted message is not sent twice', async () => {
  const { deps, request, mail } = setup();
  deps.reserve = async () => ({ state: 'sent', createdAt: 0 });
  assert.equal((await handleContact(request, deps)).status, 201);
  assert.equal(mail.length, 0);
});

for (const state of ['busy', 'conflict', 'uncertain'] as const) test(`${state} request does not send again`, async () => {
  const { deps, request, mail } = setup();
  deps.reserve = async () => ({ state, createdAt: 0 });
  assert.equal((await handleContact(request, deps)).status, 409);
  assert.equal(mail.length, 0);
});

test('SMTP classifications permit retry only for explicit pre-DATA rejection', () => {
  assert.equal(classifySmtpError({ code: 'EAUTH', responseCode: 535 }), 'rejected');
  assert.equal(classifySmtpError({ code: 'EENVELOPE', responseCode: 550 }), 'rejected');
  assert.equal(classifySmtpError({ code: 'ETIMEDOUT' }), 'uncertain');
  assert.equal(classifySmtpError({ code: 'ECONNECTION' }), 'uncertain');
  assert.equal(classifySmtpError({ code: 'EMESSAGE', responseCode: 451 }), 'uncertain');
  assert.equal(classifySmtpError('unrecognized'), 'uncertain');
});

test('does not persist raw IPs in rate-limit identity', async () => {
  const { deps, request } = setup();
  let identity = '';
  deps.rateLimit = async (value) => { identity = value; return true; };
  await handleContact(request, deps);
  assert.match(identity, /^[a-f0-9]{64}$/);
  assert.ok(!identity.includes(request.ip));
});

test('origin configuration refuses insecure origins and paths in production', () => {
  assert.deepEqual(parseOrigins('https://engine.example.com,http://localhost:4321,https://engine.example.com/path,*'), [origin]);
  assert.deepEqual(parseOrigins('http://localhost:4321', true), ['http://localhost:4321']);
});

test('rejects oversized fields, missing token, invalid UUID and non-object bodies', () => {
  assert.ok(validateInput(null).errors.form);
  assert.ok(validateInput([]).errors.form);
  const result = validateInput({ ...input, name: 'x'.repeat(81), message: 'x'.repeat(5001), requestId: '../../unsafe', turnstileToken: '' });
  assert.deepEqual(Object.keys(result.errors).sort(), ['message', 'name', 'requestId', 'turnstileToken']);
});

test('confirmation is attempted only after the accepted primary message is recorded', async () => {
  const { deps, request } = setup();
  const events: string[] = [];
  deps.sendMail = async () => { events.push('primary'); return 'accepted'; };
  deps.finish = async (_id, state) => { events.push(state); };
  deps.sendConfirmation = async () => { events.push('confirmation'); };
  assert.equal((await handleContact(request, deps)).status, 201);
  assert.deepEqual(events, ['primary', 'sent', 'confirmation']);
});

test('confirmation failure does not turn a successful primary delivery into a retry', async () => {
  const { deps, request, finishes } = setup();
  deps.sendConfirmation = async () => { throw new Error('simulated confirmation failure'); };
  const result = await handleContact(request, deps);
  assert.equal(result.status, 201);
  assert.deepEqual(finishes, ['sent']);
});

test('confirmation is not sent when primary delivery fails or was already handled', async () => {
  const failed = setup({ delivery: 'rejected' });
  let confirmations = 0;
  failed.deps.sendConfirmation = async () => { confirmations++; };
  assert.equal((await handleContact(failed.request, failed.deps)).status, 502);
  const repeated = setup();
  repeated.deps.reserve = async () => ({ state: 'sent', createdAt: 0 });
  repeated.deps.sendConfirmation = async () => { confirmations++; };
  assert.equal((await handleContact(repeated.request, repeated.deps)).status, 201);
  assert.equal(confirmations, 0);
});