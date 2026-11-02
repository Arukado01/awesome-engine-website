import { test, expect } from '@playwright/test';
test('deployment: páginas, scripts, assets y 404 reales', async ({ page, request }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  for (const route of [
    '/',
    '/docs/introduccion/',
    '/motor/',
    '/evolucion/',
    '/contacto/',
    '/showcase/',
  ]) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page).toHaveTitle(/Awesome Engine/);
    for (const img of await page.locator('img:visible').all()) {
      await img.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          img.evaluate(
            (n) => (n as HTMLImageElement).complete && (n as HTMLImageElement).naturalWidth > 0,
          ),
        )
        .toBeTruthy();
    }
  }
  expect((await request.get('/favicon.png')).headers()['content-type']).toContain('image/png');
  expect((await request.get('/sitemap-index.xml')).status()).toBe(200);
  const missing = await page.goto('/verification-page-that-does-not-exist/');
  expect(missing?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: /Este camino/ })).toBeVisible();
  expect(errors).toEqual([]);
});
test('deployment: temas persistentes y menú móvil bajo los headers públicos', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: /^Cambiar tema/ }).click();
  await page.getByRole('radio', { name: 'Claro', exact: true }).check();
  await page.keyboard.press('Escape');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.getByRole('button', { name: 'Abrir navegación' }).click();
  await page.locator('#main-nav').getByRole('link', { name: 'Documentación' }).click();
  await expect(page).toHaveURL(/\/docs\/$/);
  await page.getByLabel('Buscar una guía').fill('zzzz-no-results');
  await expect(page.locator('#docs-empty')).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
  ).toBeTruthy();
});
test('deployment: galería y cuatro videos se sirven y reproducen desde Hosting', async ({
  page,
}) => {
  await page.goto('/showcase/');
  await page.locator('[data-gallery]').first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Captura siguiente' }).click();
  await expect(page.locator('#gallery-count')).toContainText('2 /');
  await page.keyboard.press('Escape');
  const videos = page.locator('video');
  await expect(videos).toHaveCount(4);
  for (const video of await videos.all()) {
    await video.scrollIntoViewIfNeeded();
    await video.evaluate(async (node) => {
      const v = node as HTMLVideoElement;
      v.muted = true;
      await v.play();
    });
    await expect
      .poll(() => video.evaluate((n) => (n as HTMLVideoElement).currentTime))
      .toBeGreaterThan(0);
    expect(await video.evaluate((n) => (n as HTMLVideoElement).videoWidth)).toBeGreaterThanOrEqual(
      800,
    );
    await video.evaluate((n) => (n as HTMLVideoElement).pause());
  }
});

test('deployment: biblioteca de guías y categorías buscables funcionan en móvil', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/docs/');
  await page.getByLabel('Buscar una guía').fill('arquitectura');
  await expect(page.locator('[data-doc-card]:visible')).not.toHaveCount(0);
  await page.locator('[data-doc-card]:visible').first().click();
  await expect(page).toHaveURL(/\/docs\/[a-z-]+\/$/);
  await page.goto('/evolucion/');
  await expect(page.locator('#roadmap')).toHaveCount(0);
  const trigger = page.getByRole('button', { name: /^Categoría:/ });
  await trigger.click();
  await page.getByRole('combobox', { name: 'Buscar categoría' }).fill('audio');
  await page.getByRole('option', { name: 'Audio', exact: true }).click();
  await expect(trigger).toHaveAccessibleName('Categoría: Audio');
  await expect(page.locator('[data-update]:visible')).not.toHaveCount(0);
  expect(
    await page
      .locator('[data-update]:visible')
      .evaluateAll((nodes) => nodes.every((n) => n.getAttribute('data-category') === 'Audio')),
  ).toBeTruthy();
});

test('deployment: idiomas, guías y enlaces de repositorios publicados', async ({
  page,
  request,
}) => {
  const languages = { en: 'en', pt: 'pt-BR', fr: 'fr', de: 'de', ja: 'ja', zh: 'zh-Hans' };
  for (const [locale, lang] of Object.entries(languages)) {
    for (const route of ['/', '/motor/', '/docs/renderizado/']) {
      const response = await request.get('/' + locale + route);
      expect(response.status(), locale + route).toBe(200);
      const html = await response.text();
      expect(html).toContain('lang="' + lang + '"');
      expect(html).toContain('/' + locale + '/docs/');
      expect(html).not.toContain('Herramientas concretas.');
      if (route === '/motor/') {
        expect((html.match(/class="text-link technology-link"/g) || []).length).toBe(8);
        expect(html).toContain('https://github.com/SFML/SFML');
        expect(html).toContain('https://gitlab.kitware.com/cmake/cmake');
      }
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/en/docs/renderizado/?from=language#views-and-coordinates');
  await page.locator('#language-picker summary').click();
  await page.locator('#language-search').fill('日本語');
  await expect(page.locator('[data-locale-link]:visible')).toHaveCount(1);
  await page.locator('[data-locale-link="ja"]').click();
  await expect(page).toHaveURL(/\/ja\/docs\/renderizado\/\?from=language#vistas-y-coordenadas$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
  await expect(page.locator('.doc-header h1')).not.toHaveText('Renderizado y efectos');
  await expect(page.locator('#vistas-y-coordenadas')).toHaveCount(1);
});
