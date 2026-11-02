import { RECIPIENT } from './contact.js';
import type { ContactInput } from './contact.js';

export type MailLocale = 'es' | 'en' | 'pt' | 'fr' | 'de' | 'ja' | 'zh';
type Copy = {
  title: string; intro: string; from: string; email: string; subject: string;
  message: string; date: string; footer: string; subjectLine: string;
};
const owner: Copy = {
  title: 'Nuevo mensaje', intro: 'Has recibido una consulta desde el sitio web.',
  from: 'Nombre', email: 'Correo', subject: 'Asunto', message: 'Mensaje', date: 'Fecha',
  footer: 'Responde a este correo para contestar directamente al remitente.', subjectLine: '[Awesome Engine]',
};
const confirmations: Record<MailLocale, Copy> = {
  es: { title: 'Mensaje enviado', intro: 'Tu mensaje fue enviado correctamente a Awesome Engine. Aquí tienes una copia.', from: 'Nombre', email: 'Correo', subject: 'Asunto', message: 'Tu mensaje', date: 'Fecha', footer: 'Gracias por escribirnos. Responderemos a tu consulta lo antes posible.', subjectLine: 'Confirmación de tu mensaje' },
  en: { title: 'Message sent', intro: 'Your message was sent to Awesome Engine. Here is a copy for your records.', from: 'Name', email: 'Email', subject: 'Subject', message: 'Your message', date: 'Date', footer: 'Thanks for writing. We will reply to your inquiry as soon as possible.', subjectLine: 'Your message confirmation' },
  pt: { title: 'Mensagem enviada', intro: 'Sua mensagem foi enviada ao Awesome Engine. Aqui está uma cópia.', from: 'Nome', email: 'E-mail', subject: 'Assunto', message: 'Sua mensagem', date: 'Data', footer: 'Obrigado por escrever. Responderemos à sua consulta assim que possível.', subjectLine: 'Confirmação da sua mensagem' },
  fr: { title: 'Message envoyé', intro: 'Votre message a été envoyé à Awesome Engine. En voici une copie.', from: 'Nom', email: 'Adresse e-mail', subject: 'Objet', message: 'Votre message', date: 'Date', footer: 'Merci de nous avoir écrit. Nous répondrons à votre demande dès que possible.', subjectLine: 'Confirmation de votre message' },
  de: { title: 'Nachricht gesendet', intro: 'Deine Nachricht wurde an Awesome Engine gesendet. Hier ist eine Kopie.', from: 'Name', email: 'E-Mail', subject: 'Betreff', message: 'Deine Nachricht', date: 'Datum', footer: 'Danke für deine Nachricht. Wir antworten so bald wie möglich.', subjectLine: 'Bestätigung deiner Nachricht' },
  ja: { title: 'メッセージを送信しました', intro: 'Awesome Engine にメッセージを送信しました。内容のコピーをお送りします。', from: 'お名前', email: 'メールアドレス', subject: '件名', message: 'メッセージ', date: '日時', footer: 'お問い合わせありがとうございます。できるだけ早くお返事いたします。', subjectLine: 'メッセージ送信の確認' },
  zh: { title: '消息已发送', intro: '你的消息已发送至 Awesome Engine。以下是消息副本。', from: '姓名', email: '邮箱', subject: '主题', message: '你的消息', date: '日期', footer: '感谢你的来信，我们会尽快回复。', subjectLine: '消息发送确认' },
};

export function normalizeMailLocale(value: unknown): MailLocale {
  const code = typeof value === 'string' ? value.toLowerCase().split('-')[0] : '';
  return code && Object.hasOwn(confirmations, code) ? code as MailLocale : 'es';
}
function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] || char);
}

export function buildContactEmail(input: ContactInput, createdAt: number, sender: string, kind: 'owner' | 'confirmation') {
  const locale = kind === 'confirmation' ? normalizeMailLocale(input.locale) : 'es';
  const copy = kind === 'owner' ? owner : confirmations[locale];
  const recipient = kind === 'owner' ? RECIPIENT : input.email;
  const replyTo = kind === 'owner' ? { name: input.name, address: input.email } : { name: 'Awesome Engine', address: sender };
  const date = new Date(createdAt);
  const localeTags: Record<MailLocale, string> = { es: 'es-CO', en: 'en-US', pt: 'pt-BR', fr: 'fr-FR', de: 'de-DE', ja: 'ja-JP', zh: 'zh-CN' };
  const timestamp = new Intl.DateTimeFormat(localeTags[locale], { timeZone: 'America/Bogota', year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(date) + ' (Bogotá)';
  const safeName = escapeHtml(input.name);
  const safeEmail = escapeHtml(input.email);
  const safeSubject = escapeHtml(input.subject);
  const safeMessage = escapeHtml(input.message).replace(/\r\n|\r|\n/g, '<br>');
  const subject = kind === 'owner' ? `${copy.subjectLine} ${input.subject}` : `[Awesome Engine] ${copy.subjectLine}: ${input.subject}`;
  const text = `${copy.title}\n${copy.intro}\n\n${copy.from}: ${input.name}\n${copy.email}: ${input.email}\n${copy.subject}: ${input.subject}\n${copy.date}: ${timestamp}\n\n${copy.message}:\n${input.message}\n\n${copy.footer}\nhttps://awesomeengine.tech/`;
  const html = `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(copy.title)}</title></head>
<body style="margin:0;padding:0;background-color:#ececf2;font-family:Arial,Helvetica,sans-serif;color:#20222b;">
<table role="presentation" style="width:100%;border-collapse:collapse;background-color:#ececf2;"><tr><td align="center" style="padding:32px 12px;">
<table role="presentation" style="width:100%;max-width:600px;border-collapse:separate;border-spacing:0;background-color:#ffffff;border-radius:12px;overflow:hidden;">
<tr><td style="background-color:#101218;padding:26px 32px;border-bottom:3px solid #c2b2ff;">
<table role="presentation" style="border-collapse:collapse;"><tr><td style="padding-right:12px;"><img src="https://awesomeengine.tech/images/awesome-engine-logo.png" width="36" height="36" alt="" style="display:block;width:36px;height:36px;border:0;"></td><td style="font-size:16px;line-height:20px;font-weight:bold;letter-spacing:0.08em;color:#f2f2f5;">AWESOME<br><span style="font-size:10px;letter-spacing:0.24em;color:#c2b2ff;">ENGINE</span></td></tr></table>
</td></tr><tr><td style="padding:32px 32px 12px;">
<p style="margin:0 0 12px;font-size:11px;font-weight:bold;letter-spacing:0.13em;text-transform:uppercase;color:#6240c3;">AWESOME ENGINE / CONTACT</p>
<h1 style="margin:0 0 12px;font-size:28px;line-height:1.2;color:#20222b;">${escapeHtml(copy.title)}</h1>
<p style="margin:0;font-size:15px;line-height:1.6;color:#5c6171;">${escapeHtml(copy.intro)}</p>
</td></tr><tr><td style="padding:16px 32px 8px;">
<table role="presentation" style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.5;">
<tr><td style="padding:9px 12px;border-bottom:1px solid #e3e4ec;color:#5c6171;width:100px;">${escapeHtml(copy.from)}</td><td style="padding:9px 12px;border-bottom:1px solid #e3e4ec;color:#20222b;overflow-wrap:anywhere;word-break:break-word;">${safeName}</td></tr>
<tr><td style="padding:9px 12px;border-bottom:1px solid #e3e4ec;color:#5c6171;">${escapeHtml(copy.email)}</td><td style="padding:9px 12px;border-bottom:1px solid #e3e4ec;color:#20222b;overflow-wrap:anywhere;word-break:break-word;">${safeEmail}</td></tr>
<tr><td style="padding:9px 12px;border-bottom:1px solid #e3e4ec;color:#5c6171;">${escapeHtml(copy.subject)}</td><td style="padding:9px 12px;border-bottom:1px solid #e3e4ec;color:#20222b;overflow-wrap:anywhere;word-break:break-word;">${safeSubject}</td></tr>
<tr><td style="padding:9px 12px;color:#5c6171;">${escapeHtml(copy.date)}</td><td style="padding:9px 12px;color:#20222b;">${timestamp}</td></tr>
</table></td></tr><tr><td style="padding:16px 32px 32px;">
<p style="margin:0 0 10px;font-size:11px;font-weight:bold;letter-spacing:0.1em;text-transform:uppercase;color:#6240c3;">${escapeHtml(copy.message)}</p>
<div style="padding:18px 20px;border-left:3px solid #a68dff;background-color:#f5f4fb;color:#20222b;font-size:15px;line-height:1.7;overflow-wrap:anywhere;word-break:break-word;">${safeMessage}</div>
</td></tr><tr><td style="padding:22px 32px;background-color:#171a22;color:#c5c8d3;font-size:12px;line-height:1.6;">${escapeHtml(copy.footer)}<br><a href="https://awesomeengine.tech/" style="color:#c2b2ff;text-decoration:none;">awesomeengine.tech</a></td></tr>
</table></td></tr></table></body></html>`;
  return { from: { name: 'Awesome Engine', address: sender }, to: recipient, replyTo, subject, text, html, date, headers: { 'X-Awesome-Engine-Request': input.requestId }, disableFileAccess: true as const, disableUrlAccess: true as const };
}