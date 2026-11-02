import { ui } from '../i18n/client';
declare global {
  interface Window {
    aeCaptchaReady?: () => void;
    aeCaptchaError?: () => void;
    aeCaptchaExpired?: () => void;
    turnstile?: { reset: () => void };
  }
}

const form = document.querySelector<HTMLFormElement>('#contact-form');
const fields = ['name', 'email', 'subject', 'message'] as const;
type FieldName = (typeof fields)[number];
const limits: Record<FieldName, readonly [number, number]> = {
  name: [2, 80],
  email: [3, 254],
  subject: [3, 160],
  message: [20, 5000],
};
const labels: Record<FieldName, string> = {
  name: ui('nameError'),
  email: ui('emailError'),
  subject: ui('subjectError'),
  message: ui('messageError'),
};
const button = document.querySelector<HTMLButtonElement>('#contact-submit');
const newAttempt = document.querySelector<HTMLButtonElement>('#contact-new-attempt');
const status = document.querySelector<HTMLElement>('#form-status');
const enabled = form?.dataset.enabled === 'true';
let requestId = crypto.randomUUID();
let previousPayload = '';
let inFlight = false;
let uncertainty: 'network' | 'delivery' | null = null;

function showStatus(message: string, kind: 'error' | 'success') {
  if (!status) return;
  status.hidden = false;
  status.textContent = message;
  status.className = `form-status ${kind}`;
  status.focus();
}

function fieldElement(name: FieldName) {
  return form?.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null;
}

function validateField(name: FieldName) {
  const field = fieldElement(name);
  if (!field) return false;
  const value = field.value.trim();
  const [min, max] = limits[name];
  // Native minlength does not reliably validate values assigned programmatically.
  // Never rewrite the field while the visitor is typing or leaving it.
  const validLength = value.length >= min && value.length <= max;
  const hasControl = Array.from(value).some(
    (char) => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127,
  );
  const validEmail =
    name !== 'email' || (!hasControl && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/u.test(value));
  const valid = validLength && validEmail && field.checkValidity();
  field.setAttribute('aria-invalid', String(!valid));
  const error = document.querySelector(`#${name}-error`);
  if (error) error.textContent = valid ? '' : labels[name];
  return valid;
}

function updateControls() {
  fields.forEach((name) => {
    const field = fieldElement(name);
    if (field) field.readOnly = uncertainty !== null || inFlight;
  });
  if (button) {
    button.disabled = !enabled || inFlight || uncertainty === 'delivery';
    if (inFlight) button.setAttribute('aria-busy', 'true');
    else button.removeAttribute('aria-busy');
    const label = button.querySelector('span');
    if (label)
      label.textContent = inFlight
        ? ui('sending')
        : uncertainty === 'network'
          ? ui('retrySame')
          : ui('send');
  }
  if (newAttempt) {
    newAttempt.hidden = uncertainty === null;
    newAttempt.disabled = inFlight;
  }
}

function markUncertain(kind: 'network' | 'delivery') {
  // Once SMTP explicitly reports uncertainty, another request cannot resolve it.
  if (uncertainty !== 'delivery') uncertainty = kind;
  updateControls();
}

fields.forEach((name) => {
  const field = fieldElement(name);
  field?.addEventListener('blur', () => validateField(name));
  field?.addEventListener('input', () => {
    if (field.getAttribute('aria-invalid') === 'true') validateField(name);
  });
});
const message = document.querySelector<HTMLTextAreaElement>('#message');
message?.addEventListener('input', () => {
  const count = document.querySelector('#message-count');
  if (count) count.textContent = `${message.value.length} / 5000`;
});

function captchaLoadingDone() {
  document.querySelector('#captcha-loading')?.setAttribute('hidden', '');
}
window.aeCaptchaReady = () => {
  captchaLoadingDone();
  const error = document.querySelector('#captcha-error');
  if (error) error.textContent = '';
};
window.aeCaptchaError = () => {
  captchaLoadingDone();
  const error = document.querySelector('#captcha-error');
  if (error) error.textContent = ui('captchaError');
};
window.aeCaptchaExpired = () => {
  const error = document.querySelector('#captcha-error');
  if (error) error.textContent = ui('captchaExpired');
};

if (enabled && document.querySelector('.cf-turnstile')) {
  // Register callbacks before loading Turnstile, including from the browser cache.
  const script = document.createElement('script');
  script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
  script.async = true;
  script.defer = true;
  const timer = window.setTimeout(() => window.aeCaptchaError?.(), 20_000);
  script.addEventListener('load', () => {
    window.clearTimeout(timer);
    // Loading and completing the CAPTCHA are separate states.
    window.aeCaptchaReady?.();
  });
  script.addEventListener('error', () => {
    window.clearTimeout(timer);
    window.aeCaptchaError?.();
  });
  document.head.append(script);
}

newAttempt?.addEventListener('click', () => {
  if (inFlight) return;
  const confirmed = window.confirm(ui('duplicateConfirm'));
  if (!confirmed) return;
  uncertainty = null;
  requestId = crypto.randomUUID();
  previousPayload = '';
  if (status) status.hidden = true;
  updateControls();
  fieldElement('name')?.focus();
});

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (inFlight || uncertainty === 'delivery') return;
  const valid = fields.map(validateField).every(Boolean);
  if (!valid) {
    showStatus(ui('invalidFields'), 'error');
    form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    return;
  }
  if (!enabled) {
    showStatus(ui('contactDisabled'), 'error');
    return;
  }
  const data = new FormData(form);
  const token = String(data.get('cf-turnstile-response') || '');
  if (!token) {
    showStatus(ui('captchaRequired'), 'error');
    return;
  }
  const payload = {
    name: String(data.get('name') || '').trim(),
    email: String(data.get('email') || '').trim(),
    subject: String(data.get('subject') || '').trim(),
    message: String(data.get('message') || '').trim(),
    website: String(data.get('website') || ''),
    locale: document.documentElement.lang,
  };
  const fingerprint = JSON.stringify(payload);
  if (uncertainty && previousPayload !== fingerprint) {
    showStatus(ui('keepMessage'), 'error');
    return;
  }
  if (previousPayload && previousPayload !== fingerprint) requestId = crypto.randomUUID();
  previousPayload = fingerprint;
  inFlight = true;
  updateControls();
  if (status) status.hidden = true;
  try {
    const response = await fetch(form.dataset.endpoint || '/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, requestId, turnstileToken: token }),
      signal: AbortSignal.timeout(50_000),
    });
    const result = await response.json();
    if (!response.ok || result.ok !== true) {
      if (response.status >= 500 && response.status !== 503 && result.code !== 'smtp_rejected')
        markUncertain('network');
      if (result.code === 'delivery_uncertain') markUncertain('delivery');
      if (result.code === 'request_in_progress') markUncertain('network');
      if (result.code === 'smtp_rejected') uncertainty = null;
      if (result.errors && typeof result.errors === 'object') {
        for (const [key, value] of Object.entries(result.errors)) {
          if (fields.includes(key as FieldName)) {
            const error = document.querySelector(`#${key}-error`);
            if (error)
              error.textContent =
                document.documentElement.lang === 'es' ? String(value) : labels[key as FieldName];
            fieldElement(key as FieldName)?.setAttribute('aria-invalid', 'true');
          }
        }
      }
      showStatus(
        document.documentElement.lang === 'es' && typeof result.message === 'string'
          ? result.message
          : ui(
              result.code === 'delivery_uncertain'
                ? 'deliveryUncertain'
                : result.code === 'request_in_progress'
                  ? 'requestInProgress'
                  : response.status === 429
                    ? 'rateLimit'
                    : response.status === 403
                      ? 'securityError'
                      : result.errors
                        ? 'invalidFields'
                        : 'sendError',
            ),
        'error',
      );
      return;
    }
    showStatus(ui('sendSuccess'), 'success');
    uncertainty = null;
    form.reset();
    requestId = crypto.randomUUID();
    previousPayload = '';
    const count = document.querySelector('#message-count');
    if (count) count.textContent = '0 / 5000';
  } catch {
    // Timeout, offline and non-JSON proxy errors can all hide a successful SMTP send.
    markUncertain('network');
    showStatus(ui('sendUncertain'), 'error');
  } finally {
    inFlight = false;
    updateControls();
    window.turnstile?.reset();
  }
});

updateControls();
export {};
