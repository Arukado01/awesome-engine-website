import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';
import { locales, localeInfo, type Locale } from '../../src/i18n/locales';

const catalogs = Object.fromEntries(
  locales.map((locale) => [
    locale,
    JSON.parse(
      readFileSync(new URL(`../../src/i18n/catalogs/${locale}.json`, import.meta.url), 'utf8'),
    ),
  ]),
) as Record<Locale, Record<string, string>>;
const translated = (locale: Locale, source: string) => catalogs[locale][source];
const countForms = {
  guides: ['{count} guía encontrada', '{count} guías encontradas'],
  updates: ['{count} actualización', '{count} actualizaciones'],
  options: ['{count} opción disponible', '{count} opciones disponibles'],
} as const;
const countText = (locale: Locale, kind: keyof typeof countForms, count: number) => {
  const category = new Intl.PluralRules(localeInfo[locale].html).select(count);
  const source = countForms[kind][category === 'one' ? 0 : 1];
  return translated(locale, source).replace('{count}', String(count));
};
const repositoryUrls = [
  'https://github.com/cplusplus/draft',
  'https://github.com/SFML/SFML',
  'https://github.com/texus/TGUI',
  'https://gitlab.kitware.com/cmake/cmake',
  'https://github.com/nlohmann/json',
  'https://github.com/gabime/spdlog',
  'https://github.com/Neargye/magic_enum',
  'https://github.com/KhronosGroup/GLSL',
].sort();

async function openLanguages(page: Page, locale: Locale) {
  const trigger = page.locator('#language-picker summary');
  await expect(trigger).toHaveAccessibleName(
    translated(locale, 'Elegir idioma') + ' ' + locale.toUpperCase(),
  );
  await trigger.click();
  await expect(page.locator('#language-picker')).toHaveJSProperty('open', true);
  await expect(
    page.getByRole('searchbox', { name: translated(locale, 'Buscar idioma'), exact: true }),
  ).toBeFocused();
  return trigger;
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

for (const locale of locales.filter((code) => code !== 'es')) {
  test(`${locale}: HTML, SEO, navegación y repositorios mantienen el idioma`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const response = await page.goto(`/${locale}/`);
    expect(response?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', localeInfo[locale].html);
    await expect(page).toHaveTitle(
      translated(locale, 'Ideas en código. Mundos en movimiento. · Awesome Engine'),
    );
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      translated(
        locale,
        'Awesome Engine: un motor de videojuegos 2D en C++20 y SFML. Explora su arquitectura, sus juegos y su evolución.',
      ),
    );
    expect(
      new URL((await page.locator('link[rel="canonical"]').getAttribute('href'))!).pathname,
    ).toBe(`/${locale}/`);
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
      'content',
      localeInfo[locale].og,
    );
    await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(8);
    for (const other of locales) {
      const href = await page
        .locator(`link[rel="alternate"][hreflang="${localeInfo[other].html}"]`)
        .getAttribute('href');
      expect(new URL(href!).pathname).toBe(other === 'es' ? '/' : `/${other}/`);
    }
    expect(
      new URL((await page.locator('link[hreflang="x-default"]').getAttribute('href'))!).pathname,
    ).toBe('/');
    await page
      .locator('#main-nav')
      .getByRole('link', { name: translated(locale, 'El motor'), exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/motor/$`));
    await expect(page.locator('#tecnologias .technology-link')).toHaveCount(8);
    expect(
      await page
        .locator('#tecnologias .technology-link')
        .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href')).sort()),
    ).toEqual(repositoryUrls);
    for (const link of await page.locator('#tecnologias .technology-link').all()) {
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
    }
    await page
      .locator('#main-nav')
      .getByRole('link', { name: translated(locale, 'Documentación'), exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/docs/$`));
    await expect(page.locator('[data-doc-card]')).toHaveCount(9);
    for (const href of await page
      .locator('[data-doc-card]')
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href')))) {
      expect(href).toMatch(new RegExp(`^/${locale}/docs/[\\w-]+/$`));
    }
    expect(errors).toEqual([]);
  });
}

test('selector: búsqueda, teclado, cierre y cambio de idioma conservan guía, consulta y ancla', async ({
  page,
}) => {
  await page.goto('/en/docs/renderizado/?ref=language#views-and-coordinates');
  await expect(page.locator('#views-and-coordinates')).toBeVisible();
  const trigger = await openLanguages(page, 'en');
  const search = page.getByRole('searchbox', {
    name: translated('en', 'Buscar idioma'),
    exact: true,
  });
  await search.fill('zzzz-no-language');
  await expect(page.locator('#language-empty')).toHaveText(
    translated('en', 'No se encontraron idiomas.'),
  );
  await expect(page.locator('[data-locale-link]:visible')).toHaveCount(0);
  await search.fill('ALEMAN');
  await expect(page.locator('[data-locale-link]:visible')).toHaveCount(1);
  await expect(page.locator('[data-locale-link="de"]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#language-picker')).toHaveJSProperty('open', false);
  await expect(trigger).toBeFocused();
  await trigger.press('Enter');
  await expect(search).toHaveValue('');
  await search.fill('Deutsch');
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('[data-locale-link="de"]')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/de\/docs\/renderizado\/\?ref=language#vistas-y-coordenadas$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  await expect(page.locator('#vistas-y-coordenadas')).toHaveCount(1);
  expect(
    await page.evaluate(
      () => document.getElementById(decodeURIComponent(location.hash.slice(1))) !== null,
    ),
  ).toBe(true);
  await openLanguages(page, 'de');
  await page.locator('[data-locale-link="es"]').click();
  await expect(page).toHaveURL(/\/docs\/renderizado\/\?ref=language#vistas-y-coordenadas$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
});

for (const locale of ['en', 'pt', 'ja'] as const) {
  test(`${locale}: filtros, plurales y temas usan textos traducidos`, async ({ page }) => {
    await page.goto(`/${locale}/docs/`);
    const search = page.getByRole('searchbox', {
      name: translated(locale, 'Buscar una guía'),
      exact: true,
    });
    await expect(page.locator('#search-count')).toHaveText(countText(locale, 'guides', 9));
    const target = page.locator(`[data-doc-card][href="/${locale}/docs/instalacion/"]`);
    const title = (await target.locator('h3').textContent())!.trim();
    await search.fill(title);
    await expect(target).toBeVisible();
    await search.fill('std::nullopt');
    await expect(page.locator('[data-doc-card]:visible')).toHaveCount(1);
    await expect(page.locator('#search-count')).toHaveText(countText(locale, 'guides', 1));
    await search.fill('zzzz-no-guide');
    await expect(page.locator('#docs-empty')).toBeVisible();
    await expect(page.locator('#search-count')).toHaveText(countText(locale, 'guides', 0));
    await page.goto(`/${locale}/evolucion/`);
    await expect(page.locator('#update-count')).toHaveText(countText(locale, 'updates', 14));
    const category = page.locator('#category-trigger');
    await category.click();
    const categorySearch = page.getByRole('combobox', {
      name: translated(locale, 'Buscar categoría'),
      exact: true,
    });
    await categorySearch.fill(translated(locale, 'Gráficos'));
    await expect(page.getByRole('option')).toHaveCount(1);
    await expect(page.locator('#category-result-count')).toHaveText(
      countText(locale, 'options', 1),
    );
    await page.getByRole('option', { name: translated(locale, 'Gráficos'), exact: true }).click();
    await expect(category).toHaveAccessibleName(
      translated(locale, 'Categoría: {label}').replace('{label}', translated(locale, 'Gráficos')),
    );
    const expectedCount = await page.locator('[data-update][data-category="Gráficos"]').count();
    await expect(page.locator('[data-update]:visible')).toHaveCount(expectedCount);
    await expect(page.locator('#update-count')).toHaveText(
      countText(locale, 'updates', expectedCount),
    );
    await page.locator('#update-search').fill('zzzz-no-update');
    await expect(page.locator('#updates-empty')).toBeVisible();
    await expect(page.locator('#update-count')).toHaveText(countText(locale, 'updates', 0));
    await page
      .getByRole('button', { name: translated(locale, 'Restablecer filtros'), exact: true })
      .click();
    await expect(page.locator('[data-update]:visible')).toHaveCount(14);
    await page.locator('#theme-trigger').click();
    await expect(page.locator('#theme-trigger')).toHaveAccessibleName(
      new RegExp(translated(locale, 'Cambiar tema:')),
    );
    await page.getByRole('radio', { name: translated(locale, 'Claro'), exact: true }).check();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(page.locator('#theme-trigger .theme-current')).toHaveText(
      translated(locale, 'Claro'),
    );
    await page.keyboard.press('Escape');
    await page.reload();
    await expect(page.locator('#theme-trigger .theme-current')).toHaveText(
      translated(locale, 'Claro'),
    );
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });
}

for (const width of [320, 390, 1024, 1440]) {
  test(`traducciones y selector sin desbordamiento a ${width}px`, async ({ page }) => {
    test.setTimeout(90000);
    await page.setViewportSize({ width, height: 900 });
    for (const locale of ['en', 'de', 'ja', 'zh'] as const) {
      for (const route of ['/', '/docs/arquitectura/']) {
        await page.goto(`/${locale}${route}`);
        await expect(page.locator('h1')).toBeVisible();
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
          `${locale}${route}`,
        ).toBe(true);
      }
      await openLanguages(page, locale);
      const box = await page.locator('.language-panel').boundingBox();
      expect(box!.x, locale).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width, locale).toBeLessThanOrEqual(width + 1);
      await expect(page.locator('[data-locale-link]:visible')).toHaveCount(7);
      if (width === 390) {
        const results = await new AxeBuilder({ page })
          .include('#language-picker')
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze();
        expect(
          results.violations.map((violation) => ({
            id: violation.id,
            nodes: violation.nodes.map((node) => node.target),
          })),
          locale,
        ).toEqual([]);
      }
      await page.keyboard.press('Escape');
    }
  });
}

test('la traducción y los enlaces de idioma funcionan sin JavaScript', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  try {
    const page = await context.newPage();
    await page.goto('/en/docs/instalacion/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('.doc-header h1')).toHaveText(
      translated('en', 'Instalación y compilación'),
    );
    await page.locator('#language-picker summary').click();
    await page.locator('[data-locale-link="pt"]').click();
    await expect(page).toHaveURL(/\/pt\/docs\/instalacion\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
    await expect(page.locator('.doc-header h1')).toHaveText(
      translated('pt', 'Instalación y compilación'),
    );
  } finally {
    await context.close();
  }
});
