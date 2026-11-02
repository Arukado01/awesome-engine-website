import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
async function chooseTheme(page: Page, name: string) {
  await page.getByRole('button', { name: /^Cambiar tema/ }).click();
  await page.getByRole('radio', { name, exact: true }).check();
  await page.keyboard.press('Escape');
}
const routes = [
  '/',
  '/motor/',
  '/docs/',
  '/docs/introduccion/',
  '/docs/instalacion/',
  '/docs/configuracion/',
  '/docs/arquitectura/',
  '/docs/renderizado/',
  '/docs/recursos/',
  '/docs/escenas/',
  '/docs/entrada-audio/',
  '/docs/problemas/',
  '/evolucion/',
  '/contacto/',
  '/privacidad/',
  '/showcase/',
];
test('todas las páginas cargan sin errores de JavaScript ni enlaces internos rotos', async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const links = new Set<string>();
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    for (const link of await page
      .locator('a[href^="/"]')
      .evaluateAll((nodes) => nodes.map((n) => n.getAttribute('href') || '')))
      links.add(link.split('#')[0]);
    for (const img of await page.locator('img:visible').all()) {
      await img.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          img.evaluate(
            (e) => (e as HTMLImageElement).complete && (e as HTMLImageElement).naturalWidth > 0,
          ),
        )
        .toBeTruthy();
    }
  }
  for (const link of links) {
    if (link) expect((await request.get(link)).ok(), link).toBeTruthy();
  }
  expect(errors).toEqual([]);
});
for (const width of [320, 390, 768, 1440, 1920])
  test(`sin desbordamiento horizontal a ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      '/',
      '/motor/',
      '/docs/arquitectura/',
      '/evolucion/',
      '/contacto/',
      '/showcase/',
    ]) {
      await page.goto(route);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
        route,
      ).toBeTruthy();
    }
  });
test('temas claro, oscuro y sistema persisten y reaccionan al dispositivo', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await chooseTheme(page, 'Claro');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await chooseTheme(page, 'Oscuro');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await chooseTheme(page, 'Sistema');
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});
test('menú móvil y navegación por teclado', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: /navegación/ });
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page.locator('#main-nav').getByRole('link', { name: 'Documentación' }).click();
  await expect(page).toHaveURL(/\/docs\/$/);
  await page.locator('.docs-nav summary').click();
  await expect(page.locator('.docs-nav')).toHaveAttribute('open', '');
});
test('búsquedas, filtros y estados vacíos', async ({ page }) => {
  await page.goto('/docs/');
  await page.getByLabel('Buscar una guía').fill('renderizado');
  await expect(page.locator('[data-doc-card]:visible')).not.toHaveCount(0);
  await page.getByLabel('Buscar una guía').fill('zzzzsinresultados');
  await expect(page.locator('#docs-empty')).toBeVisible();
  await page.goto('/evolucion/');
  await page.getByLabel('Categoría', { exact: true }).selectOption('Juegos');
  await expect(page.locator('[data-update]:visible')).not.toHaveCount(0);
  await page.getByLabel('Buscar una mejora').fill('zzzzsinresultados');
  await expect(page.locator('#updates-empty')).toBeVisible();
  await page.getByRole('button', { name: 'Restablecer filtros' }).click();
  await expect(page.locator('[data-update]:visible')).toHaveCount(14);
  await page.locator('.timeline-entry summary').first().click();
  await expect(page.locator('.change-details').first()).toBeVisible();
});
test('formulario deshabilitado informa y valida campos sin enviar solicitudes', async ({
  page,
}) => {
  let posts = 0;
  page.on('request', (r) => {
    if (r.method() === 'POST' && r.url().includes('/api/contact')) posts++;
  });
  await page.goto('/contacto/');
  await expect(page.getByRole('button', { name: 'Enviar mensaje' })).toBeDisabled();
  await page.getByLabel('Nombre', { exact: false }).fill('A');
  await page.getByLabel('Correo electrónico', { exact: false }).fill('invalid');
  await page.getByLabel('Asunto', { exact: false }).fill('a');
  await page.getByLabel('Mensaje', { exact: false }).fill('corto');
  await page.getByLabel('Nombre', { exact: false }).focus();
  await expect(page.locator('#name-error')).not.toBeEmpty();
  await expect(page.locator('#email-error')).not.toBeEmpty();
  await expect(page.locator('#message-error')).not.toBeEmpty();
  expect(posts).toBe(0);
});
for (const theme of ['light', 'dark'])
  test(`accesibilidad WCAG AA en tema ${theme}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const route of [
      '/',
      '/motor/',
      '/docs/',
      '/docs/arquitectura/',
      '/evolucion/',
      '/contacto/',
      '/showcase/',
    ]) {
      await page.goto(route);
      await chooseTheme(page, theme === 'light' ? 'Claro' : 'Oscuro');
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(
        results.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
        route,
      ).toEqual([]);
    }
  });
test('galerías accesibles y cuatro videos reales se pueden reproducir', async ({ page }) => {
  await page.goto('/showcase/');
  const triggers = page.locator('[data-gallery]');
  expect(await triggers.count()).toBeGreaterThanOrEqual(4);
  await triggers.first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('#gallery-count')).toContainText('1 /');
  await page.getByRole('button', { name: 'Captura siguiente' }).click();
  await expect(page.locator('#gallery-count')).toContainText('2 /');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(triggers.first()).toBeFocused();
  const videos = page.locator('video');
  await expect(videos).toHaveCount(4);
  for (const video of await videos.all()) {
    await video.scrollIntoViewIfNeeded();
    await video.evaluate(async (v) => {
      (v as HTMLVideoElement).muted = true;
      await (v as HTMLVideoElement).play();
    });
    await expect
      .poll(() => video.evaluate((v) => (v as HTMLVideoElement).currentTime))
      .toBeGreaterThan(0);
    expect(await video.evaluate((v) => (v as HTMLVideoElement).videoWidth)).toBeGreaterThanOrEqual(
      800,
    );
    await video.evaluate((v) => (v as HTMLVideoElement).pause());
  }
});
test('404 conserva una salida clara', async ({ page }) => {
  await page.goto('/404.html');
  await expect(page.getByRole('heading', { name: /Este camino/ })).toBeVisible();
  await page.getByRole('link', { name: 'Volver al inicio' }).click();
  await expect(page).toHaveURL(/\/$/);
});
for (const width of [390, 768]) {
  test(`galería y reproducción en pantalla de ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/showcase/');
    await page.locator('[data-gallery="plagetale"]').first().click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: 'Captura siguiente' }).click();
    await expect(page.locator('#gallery-count')).toContainText('2 /');
    await page.getByRole('button', { name: 'Cerrar galería' }).click();
    for (const video of await page.locator('video').all()) {
      await video.scrollIntoViewIfNeeded();
      await video.evaluate(async (node) => {
        const v = node as HTMLVideoElement;
        v.muted = true;
        await v.play();
      });
      await expect
        .poll(() => video.evaluate((v) => (v as HTMLVideoElement).currentTime))
        .toBeGreaterThan(0);
      await video.evaluate((v) => (v as HTMLVideoElement).pause());
    }
  });
}

test('selector de tema: teclado, cierre, foco y panel accesible en móvil', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 780 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/contacto/');
  const trigger = page.getByRole('button', { name: /^Cambiar tema/ });
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('radiogroup', { name: 'Tema visual' })).toBeVisible();
  await expect(page.getByRole('radio', { name: 'Sistema', exact: true })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('radio', { name: 'Oscuro', exact: true })).toBeChecked();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  const bounds = await page.locator('#theme-panel').boundingBox();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(320);
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(results.violations.map((v) => v.id)).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await trigger.click();
  await page.locator('.page-intro .lead').click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

test('entradas visibles al cargar y recorrer la página, con movimiento reducido respetado', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect
    .poll(() =>
      page
        .locator('.hero')
        .evaluate(
          (el) =>
            el.getAnimations({ subtree: true }).filter((a) => a.playState === 'running').length,
        ),
    )
    .toBeGreaterThan(0);
  await page.locator('.feature-render').scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      page
        .locator('.feature-render')
        .evaluate(
          (el) =>
            el.getAnimations({ subtree: true }).filter((a) => a.playState === 'running').length,
        ),
    )
    .toBeGreaterThan(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect
    .poll(() =>
      page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').length),
    )
    .toBe(0);
  await page.reload();
  await expect(page.locator('h1')).toBeVisible();
  await page.locator('.pipeline').scrollIntoViewIfNeeded();
  await expect(page.locator('.pipeline')).toBeVisible();
  expect(
    await page.evaluate(
      () => document.getAnimations().filter((a) => a.playState === 'running').length,
    ),
  ).toBe(0);
});

test('los filtros conservan lo escrito antes de que termine de cargar JavaScript', async ({
  page,
}) => {
  for (const [path, label, empty] of [
    ['/docs/', 'Buscar una guía', '#docs-empty'],
    ['/evolucion/', 'Buscar una mejora', '#updates-empty'],
  ]) {
    let release = () => {};
    const ready = new Promise<void>((resolve) => {
      release = resolve;
    });
    await page.route('**/_astro/*.js', async (route) => {
      await ready;
      await route.continue();
    });
    try {
      await page.goto(path, { waitUntil: 'commit' });
      await page.getByLabel(label).fill('zzzz-network-early');
      release();
      await expect(page.locator(empty)).toBeVisible();
      await expect(page.getByLabel(label)).toHaveValue('zzzz-network-early');
    } finally {
      release();
      await page.unrouteAll({ behavior: 'wait' });
    }
  }
});
