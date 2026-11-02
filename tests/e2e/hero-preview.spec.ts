import { test, expect } from '@playwright/test';

for (const width of [390, 1440]) {
  test(`Runner se anima en bucle y permite detener el movimiento a ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    const preview = page.locator('#runner-preview');
    const toggle = page.locator('.hero-motion-toggle');
    await preview.scrollIntoViewIfNeeded();
    await expect(preview).toHaveAttribute('src', '/images/runner-hero-loop-5s.gif');
    await expect
      .poll(() =>
        preview.evaluate(
          (image: HTMLImageElement) =>
            image.complete && image.naturalWidth === 800 && image.naturalHeight === 800,
        ),
      )
      .toBe(true);
    const bounds = await preview.boundingBox();
    expect(bounds).not.toBeNull();
    expect(Math.abs(bounds!.width - bounds!.height)).toBeLessThanOrEqual(1);
    await expect(toggle).toHaveAccessibleName('Pausar animación de Runner');
    await toggle.click();
    await expect(preview).toHaveAttribute('src', '/images/runner-hero.webp');
    await expect(toggle).toHaveAccessibleName('Reproducir animación de Runner');
    await toggle.click();
    await expect(preview).toHaveAttribute('src', '/images/runner-hero-loop-5s.gif');
    await page.locator('footer').scrollIntoViewIfNeeded();
    await expect(preview).toHaveAttribute('src', '/images/runner-hero.webp');
    await preview.scrollIntoViewIfNeeded();
    await expect(preview).toHaveAttribute('src', '/images/runner-hero-loop-5s.gif');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(preview).toHaveAttribute('src', '/images/runner-hero.webp');
    await expect(toggle).toHaveAccessibleName('Reproducir animación de Runner');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await expect(preview).toHaveAttribute('src', '/images/runner-hero-loop-5s.gif');
    await toggle.click();
    await page.locator('footer').scrollIntoViewIfNeeded();
    await preview.scrollIntoViewIfNeeded();
    await expect(preview).toHaveAttribute('src', '/images/runner-hero.webp');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
  });
}

test('el movimiento reducido evita descargar el GIF y permite reproducirlo explícitamente', async ({
  page,
}) => {
  const animationRequests: string[] = [];
  page.on('request', (request) => {
    if (request.url().endsWith('/runner-hero-loop-5s.gif')) animationRequests.push(request.url());
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/en/');
  const preview = page.locator('#runner-preview');
  const toggle = page.locator('.hero-motion-toggle');
  await preview.scrollIntoViewIfNeeded();
  await expect(toggle).toBeVisible();
  await expect(preview).toHaveAttribute('src', '/images/runner-hero.webp');
  await expect(toggle).toHaveAccessibleName('Play Runner animation');
  expect(animationRequests).toEqual([]);
  await toggle.click();
  await expect(preview).toHaveAttribute('src', '/images/runner-hero-loop-5s.gif');
  await expect(toggle).toHaveAccessibleName('Pause Runner animation');
});
