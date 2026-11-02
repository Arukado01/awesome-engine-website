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
  name: 'Escribe un nombre de 2 a 80 caracteres.',
  email: 'Escribe un correo electrónico válido.',
  subject: 'El asunto debe tener entre 3 y 160 caracteres.',
  message: 'El mensaje debe tener entre 20 y 5000 caracteres.',
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
        ? 'Enviando mensaje…'
        : uncertainty === 'network'
          ? 'Comprobar el mismo envío'
          : 'Enviar mensaje';
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
  if (error)
    error.textContent =
      'No pudimos cargar la verificación. Revisa tu conexión y vuelve a intentarlo.';
};
window.aeCaptchaExpired = () => {
  const error = document.querySelector('#captcha-error');
  if (error) error.textContent = 'La verificación expiró. Completa una nueva verificación.';
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
  const confirmed = window.confirm(
    'Gmail podría haber recibido tu mensaje anterior. Iniciar otro envío puede duplicarlo. ¿Quieres iniciar un nuevo intento de todos modos?',
  );
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
    showStatus('Revisa los campos indicados antes de enviar.', 'error');
    form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    return;
  }
  if (!enabled) {
    showStatus('El envío todavía no está disponible. No se ha enviado tu mensaje.', 'error');
    return;
  }
  const data = new FormData(form);
  const token = String(data.get('cf-turnstile-response') || '');
  if (!token) {
    showStatus('Completa la verificación de seguridad antes de enviar.', 'error');
    return;
  }
  const payload = {
    name: String(data.get('name') || '').trim(),
    email: String(data.get('email') || '').trim(),
    subject: String(data.get('subject') || '').trim(),
    message: String(data.get('message') || '').trim(),
    website: String(data.get('website') || ''),
  };
  const fingerprint = JSON.stringify(payload);
  if (uncertainty && previousPayload !== fingerprint) {
    showStatus(
      'Conserva el mensaje anterior para comprobar su envío. Para cambiarlo, utiliza «Iniciar otro envío» y confirma el riesgo de duplicarlo.',
      'error',
    );
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
      signal: AbortSignal.timeout(35_000),
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
            if (error) error.textContent = String(value);
            fieldElement(key as FieldName)?.setAttribute('aria-invalid', 'true');
          }
        }
      }
      showStatus(
        typeof result.message === 'string'
          ? result.message
          : 'No pudimos enviar el mensaje. Inténtalo de nuevo más tarde.',
        'error',
      );
      return;
    }
    showStatus(
      'Tu mensaje fue aceptado por el servicio de correo. Gracias por escribir.',
      'success',
    );
    uncertainty = null;
    form.reset();
    requestId = crypto.randomUUID();
    previousPayload = '';
    const count = document.querySelector('#message-count');
    if (count) count.textContent = '0 / 5000';
  } catch {
    // Timeout, offline and non-JSON proxy errors can all hide a successful SMTP send.
    markUncertain('network');
    showStatus(
      'No pudimos confirmar el envío. Conservamos tu mensaje y su identificador. Puedes completar otra verificación y comprobar el mismo envío. Iniciar otro intento podría duplicarlo.',
      'error',
    );
  } finally {
    inFlight = false;
    updateControls();
    window.turnstile?.reset();
  }
});

updateControls();
export {};
