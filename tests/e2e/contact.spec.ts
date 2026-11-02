import { test, expect } from '@playwright/test';
import type { Page, Route } from '@playwright/test';

interface Submission {
  name: string;
  email: string;
  subject: string;
  message: string;
  website: string;
  locale: string;
  requestId: string;
  turnstileToken: string;
}

const valid = {
  name: 'Ana María',
  email: 'visitor@example.com',
  subject: 'Consulta sobre el motor',
  message: 'Me interesa conocer la arquitectura y el sistema de escenas de Awesome Engine.',
};

/** Every contact POST and Turnstile script is intercepted: these tests send no email. */
async function contactFixture(
  page: Page,
  respond: (route: Route, attempt: number) => Promise<void>,
  token = true,
  path = '/contacto/',
) {
  const submissions: Submission[] = [];
  await page.route('**/api/contact', async (route) => {
    expect(route.request().method()).toBe('POST');
    submissions.push(route.request().postDataJSON() as Submission);
    await respond(route, submissions.length);
  });
  await page.route('https://challenges.cloudflare.com/turnstile/v0/api.js', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: `(() => {
        let sequence = 1;
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'cf-turnstile-response';
        input.value = ${JSON.stringify(token ? 'stub-token-1' : '')};
        document.querySelector('#contact-form').append(input);
        window.turnstile = {reset() {
          input.value = 'stub-token-' + (++sequence);
          window.aeCaptchaReady?.();
        }};
        // Deliberately do not call the success callback on load. Loading must
        // finish independently of a visitor completing the challenge.
      })();`,
    }),
  );
  await page.route('**/contacto/', async (route) => {
    const response = await route.fetch();
    let html = await response.text();
    // Enable only this intercepted browser fixture; production remains disabled.
    html = html.replace('data-enabled="false"', 'data-enabled="true"');
    if (!html.includes('class="cf-turnstile"')) {
      html = html.replace(
        '</form>',
        '<div class="cf-turnstile" data-sitekey="stub-site-key"></div>' +
          '<div id="captcha-loading">Cargando prueba</div><p id="captcha-error"></p></form>',
      );
    }
    await route.fulfill({ response, body: html });
  });
  await page.goto(path);
  await expect(page.locator('#contact-submit')).toBeEnabled();
  await expect(page.locator('#captcha-loading')).toBeHidden();
  await expect(page.locator('input[name="cf-turnstile-response"]')).toHaveCount(1);
  return submissions;
}

async function fillValid(page: Page) {
  for (const [field, value] of Object.entries(valid)) await page.locator(`#${field}`).fill(value);
}

async function accepted(route: Route) {
  await route.fulfill({ status: 201, json: { ok: true, message: 'Aceptado por SMTP (stub).' } });
}

test('contacto: éxito confirmado, estado de envío y limpieza del formulario', async ({ page }) => {
  let release = () => {};
  const pending = new Promise<void>((resolve) => {
    release = resolve;
  });
  const submissions = await contactFixture(page, async (route) => {
    await pending;
    await accepted(route);
  });
  await fillValid(page);
  await page.locator('#name').fill('  Ana María  ');
  await page.locator('#subject').focus();
  await expect(page.locator('#name')).toHaveValue('  Ana María  ');
  await page.locator('#contact-submit').click();
  await expect(page.locator('#contact-submit')).toBeDisabled();
  await expect(page.locator('#contact-submit')).toHaveAttribute('aria-busy', 'true');
  await expect(page.locator('#message')).toHaveJSProperty('readOnly', true);
  release();
  await expect(page.locator('#form-status')).toHaveClass(/success/);
  await expect(page.locator('#form-status')).toContainText('aceptado por el servicio de correo');
  for (const field of ['name', 'email', 'subject', 'message'])
    await expect(page.locator(`#${field}`)).toHaveValue('');
  await expect(page.locator('#message-count')).toHaveText('0 / 5000');
  await expect(page.locator('#contact-new-attempt')).toBeHidden();
  await expect(page.locator('#contact-submit')).toBeEnabled();
  expect(submissions).toHaveLength(1);
  expect(submissions[0].name).toBe('Ana María');
  expect(submissions[0].website).toBe('');
  expect(submissions[0].locale).toBe('es');
  expect(submissions[0].requestId).toMatch(/^[0-9a-f-]{36}$/);
});

for (const status of [200, 502]) {
  test(`contacto: HTTP ${status} con ok=false nunca muestra éxito`, async ({ page }) => {
    const submissions = await contactFixture(page, (route) =>
      route.fulfill({
        status,
        json: {
          ok: false,
          code: 'smtp_rejected',
          message: 'El servidor de correo rechazó el envío (stub).',
        },
      }),
    );
    await fillValid(page);
    await page.locator('#contact-submit').click();
    await expect(page.locator('#form-status')).toHaveClass(/error/);
    await expect(page.locator('#form-status')).toContainText('rechazó el envío');
    await expect(page.locator('#message')).toHaveValue(valid.message);
    await expect(page.locator('#message')).toBeEditable();
    await expect(page.locator('#contact-submit')).toBeEnabled();
    await expect(page.locator('#contact-new-attempt')).toBeHidden();
    expect(submissions).toHaveLength(1);
  });
}

test('contacto: valida mínimos programáticos y correo antes de realizar un POST', async ({
  page,
}) => {
  const submissions = await contactFixture(page, accepted);
  await fillValid(page);
  await page.evaluate(() => {
    for (const [id, value] of Object.entries({
      name: 'A',
      email: 'invalid',
      subject: 'ab',
      message: 'corto',
    })) {
      (document.querySelector(`#${id}`) as HTMLInputElement | HTMLTextAreaElement).value = value;
    }
  });
  await page.locator('#contact-submit').click();
  for (const field of ['name', 'email', 'subject', 'message']) {
    await expect(page.locator(`#${field}`)).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator(`#${field}-error`)).not.toBeEmpty();
  }
  await expect(page.locator('#name')).toBeFocused();
  expect(submissions).toHaveLength(0);
});

test('contacto: requiere token de verificación sin realizar un POST', async ({ page }) => {
  const submissions = await contactFixture(page, accepted, false);
  await fillValid(page);
  await page.locator('#contact-submit').click();
  await expect(page.locator('#form-status')).toContainText('Completa la verificación');
  expect(submissions).toHaveLength(0);
});

test('contacto: un fallo de red conserva datos y UUID al comprobar el mismo envío', async ({
  page,
}) => {
  const submissions = await contactFixture(page, (route, attempt) =>
    attempt === 1 ? route.abort('failed') : accepted(route),
  );
  await fillValid(page);
  await page.locator('#contact-submit').click();
  await expect(page.locator('#form-status')).toContainText('No pudimos confirmar el envío');
  await expect(page.locator('#message')).toHaveValue(valid.message);
  await expect(page.locator('#message')).toHaveJSProperty('readOnly', true);
  await expect(page.locator('#contact-new-attempt')).toBeVisible();
  await expect(page.locator('#contact-submit')).toHaveText(/Comprobar el mismo envío/);
  await page.locator('#contact-submit').click();
  await expect(page.locator('#form-status')).toHaveClass(/success/);
  expect(submissions).toHaveLength(2);
  expect(submissions[1].requestId).toBe(submissions[0].requestId);
  expect(submissions[1].message).toBe(submissions[0].message);
  expect(submissions[1].turnstileToken).not.toBe(submissions[0].turnstileToken);
});

test('contacto: una respuesta no JSON no simula éxito ni pierde el mensaje', async ({ page }) => {
  const submissions = await contactFixture(page, (route) =>
    route.fulfill({
      status: 502,
      contentType: 'text/html',
      body: '<h1>Gateway unavailable (stub)</h1>',
    }),
  );
  await fillValid(page);
  await page.locator('#contact-submit').click();
  await expect(page.locator('#form-status')).toHaveClass(/error/);
  await expect(page.locator('#form-status')).toContainText('No pudimos confirmar');
  await expect(page.locator('#message')).toHaveValue(valid.message);
  await expect(page.locator('#message')).toHaveJSProperty('readOnly', true);
  expect(submissions).toHaveLength(1);
});

test('contacto: entrega incierta bloquea reenvío y exige confirmar un intento nuevo', async ({
  page,
}) => {
  const submissions = await contactFixture(page, (route, attempt) =>
    attempt === 1
      ? route.fulfill({
          status: 502,
          json: {
            ok: false,
            code: 'delivery_uncertain',
            message: 'No podemos confirmar el envío; no se reenviará (stub).',
          },
        })
      : accepted(route),
  );
  await fillValid(page);
  await page.locator('#contact-submit').click();
  await expect(page.locator('#form-status')).toContainText('no se reenviará');
  await expect(page.locator('#contact-submit')).toBeDisabled();
  await expect(page.locator('#message')).toHaveJSProperty('readOnly', true);
  await page.locator('#contact-form').dispatchEvent('submit');
  expect(submissions).toHaveLength(1);

  page.once('dialog', async (dialog) => {
    expect(dialog.type()).toBe('confirm');
    expect(dialog.message()).toContain('duplicarlo');
    await dialog.dismiss();
  });
  await page.locator('#contact-new-attempt').click();
  await expect(page.locator('#contact-submit')).toBeDisabled();
  await expect(page.locator('#message')).toHaveJSProperty('readOnly', true);
  expect(submissions).toHaveLength(1);

  page.once('dialog', (dialog) => dialog.accept());
  await page.locator('#contact-new-attempt').click();
  await expect(page.locator('#contact-submit')).toBeEnabled();
  await expect(page.locator('#message')).toBeEditable();
  await expect(page.locator('#contact-new-attempt')).toBeHidden();
  await page.locator('#contact-submit').click();
  await expect(page.locator('#form-status')).toHaveClass(/success/);
  expect(submissions).toHaveLength(2);
  expect(submissions[1].requestId).not.toBe(submissions[0].requestId);
});

test('contacto: envía el idioma elegido para la confirmación', async ({ page }) => {
  const submissions = await contactFixture(page, accepted, true, '/en/contacto/');
  await fillValid(page);
  await page.locator('#contact-submit').click();
  await expect(page.locator('#form-status')).toHaveClass(/success/);
  expect(submissions).toHaveLength(1);
  expect(submissions[0].locale).toBe('en');
});
