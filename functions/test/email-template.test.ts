import test from 'node:test';
import nodemailer from 'nodemailer';
import assert from 'node:assert/strict';
import { buildContactEmail, normalizeMailLocale } from '../src/email-template.js';
import type { ContactInput } from '../src/contact.js';

const input: ContactInput = {
  name: 'Alicia <script>alert(1)</script>', email: 'alice@example.com',
  subject: 'Consulta & dudas', message: 'Primera línea\n<img src=x onerror=alert(1)>\nÚltima línea',
  website: '', turnstileToken: 'test', requestId: 'a987fbc9-4bed-4078-8f07-9141ba07c9f3', locale: 'en',
};
const timestamp = Date.UTC(2026, 10, 2, 13, 30);

test('owner mail retains reply-to and safely escapes all submitted HTML', () => {
  const mail = buildContactEmail(input, timestamp, 'carlosjcortinam@gmail.com', 'owner');
  assert.equal(mail.to, 'carlosjcortinam@gmail.com');
  assert.deepEqual(mail.replyTo, { name: input.name, address: input.email });
  assert.equal(mail.subject, '[Awesome Engine] Consulta & dudas');
  assert.ok(mail.text.includes(input.message));
  assert.ok(mail.html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
  assert.ok(mail.html.includes('&lt;img src=x onerror=alert(1)&gt;'));
  assert.ok(mail.html.includes('Consulta &amp; dudas'));
  assert.ok(mail.html.includes('Primera línea<br>'));
  assert.ok(!mail.html.includes('<script>alert(1)</script>'));
  assert.ok(!mail.html.includes('<img src=x onerror=alert(1)>'));
  assert.equal(mail.headers['X-Awesome-Engine-Request'], input.requestId);
});

test('confirmation is addressed to the visitor with a complete copy and localized text', () => {
  const mail = buildContactEmail(input, timestamp, 'carlosjcortinam@gmail.com', 'confirmation');
  assert.equal(mail.to, input.email);
  assert.equal(mail.replyTo.address, 'carlosjcortinam@gmail.com');
  assert.match(mail.subject, /Your message confirmation/);
  assert.ok(mail.text.includes(input.message));
  assert.ok(mail.html.includes('Message sent'));
  assert.ok(mail.html.includes('&lt;img src=x onerror=alert(1)&gt;'));
  assert.equal(mail.date.toISOString(), '2026-11-02T13:30:00.000Z');
});

test('all supported locales have a confirmation and unknown locales fall back to Spanish', () => {
  const expected = { es:'Mensaje enviado', en:'Message sent', pt:'Mensagem enviada', fr:'Message envoyé', de:'Nachricht gesendet', ja:'メッセージを送信しました', zh:'消息已发送' };
  for (const [locale, title] of Object.entries(expected)) {
    const mail = buildContactEmail({ ...input, locale }, timestamp, 'carlosjcortinam@gmail.com', 'confirmation');
    assert.ok(mail.html.includes(title), locale);
  }
  assert.equal(normalizeMailLocale('pt-BR'), 'pt');
  assert.equal(normalizeMailLocale('zh-Hans'), 'zh');
  assert.equal(normalizeMailLocale('unknown'), 'es');
});
test('both emails produce multipart text and HTML with the intended reply-to header', async () => {
  const transport = nodemailer.createTransport({ streamTransport: true, buffer: true, newline: 'unix' });
  for (const kind of ['owner', 'confirmation'] as const) {
    const result = await transport.sendMail(buildContactEmail(input, timestamp, 'carlosjcortinam@gmail.com', kind));
    const mime = (result.message as Buffer).toString('utf8');
    assert.match(mime, /Content-Type: multipart\/alternative/i);
    assert.match(mime, /Content-Type: text\/plain/i);
    assert.match(mime, /Content-Type: text\/html/i);
    assert.ok(mime.includes(kind === 'owner' ? 'alice@example.com' : 'carlosjcortinam@gmail.com'));
    assert.match(mime, /Reply-To:/i);
  }
  transport.close();
});