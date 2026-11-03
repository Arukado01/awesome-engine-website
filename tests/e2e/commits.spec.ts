import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { locales } from '../../src/i18n/locales';

const commits = ['19264a1', 'f0e88ed', '8e733f0', '5387503', '67f81e3', '509f0bf', '315669a'];
for (const locale of locales) {
  test(`${locale}: los nuevos sistemas, commits y guías están disponibles en móvil`, async ({
    page,
  }) => {
    const prefix = locale === 'es' ? '' : `/${locale}`;
    const catalog = JSON.parse(readFileSync(`src/i18n/catalogs/${locale}.json`, 'utf8')) as Record<
      string,
      string
    >;
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`${prefix}/`);
    await expect(page.locator('.latest-update').first()).toContainText('19264a1');
    await expect(page.locator('.latest-update').first().locator('h3')).toHaveText(
      catalog['Tetris mejora su audio y su pantalla de derrota'],
    );
    await page.goto(`${prefix}/motor/`);
    await expect(page.locator('.system-row')).toHaveCount(10);
    await expect(page.locator('.system-row').last().locator('.system-number')).toHaveText('10');
    await expect(page.locator('.system-row h3')).toContainText([
      catalog['Animación de sprites'],
      catalog['Colisiones 2D'],
      catalog['Partículas y ráfagas'],
      catalog['Tiempo y pausa'],
    ]);
    await expect(page.locator('.manager-grid')).toContainText('Animation');
    await expect(page.locator('.manager-grid')).toContainText('Collision');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
    await page.goto(`${prefix}/evolucion/`);
    for (const id of commits) {
      await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
      await expect(page.locator(`[id="${id}"] a[href*="/commit/"]`)).toHaveAttribute(
        'href',
        new RegExp(`/commit/${id}`),
      );
    }
    await expect(page.locator('#f0e88ed h2')).toHaveText(
      catalog['Runner y Bounce integran los gestores'],
    );
    await page.locator('#update-search').fill('f0e88ed');
    await expect(page.locator('[data-update]:visible')).toHaveCount(1);
    await page.goto(`${prefix}/docs/renderizado/`);
    await expect(page.locator('.docs-article')).toContainText('SpriteAnimator');
    await expect(page.locator('.docs-article')).toContainText('CollisionManager');
    await expect(page.locator('.docs-article')).toContainText('EmitBurst');
    await expect(page.locator('[id="animación-y-colisiones"]')).toHaveCount(1);
    await page.goto(`${prefix}/docs/entrada-audio/`);
    await expect(page.locator('.docs-article')).toContainText('AudioManager::CreateGroup');
    await expect(page.locator('[id="grupos-de-audio"]')).toHaveCount(1);
    await page.goto(`${prefix}/docs/arquitectura/`);
    await expect(page.locator('.docs-article')).toContainText('TimeDomain::Game');
    await expect(page.locator('.docs-version')).toContainText('f0e88ed');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
  });
}
