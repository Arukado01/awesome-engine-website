import { defineConfig } from '@playwright/test';
const baseURL = process.env.PLAYWRIGHT_BASE_URL;
if (!baseURL) throw new Error('PLAYWRIGHT_BASE_URL must identify the actual deployment.');
const url = new URL(baseURL);
if (
  url.protocol !== 'https:' ||
  !(
    url.hostname === 'awesome-engine-web-arukado.web.app' ||
    /^awesome-engine-web-arukado--pr-[\w-]+\.web\.app$/.test(url.hostname)
  )
)
  throw new Error('Unexpected deployment host.');
export default defineConfig({
  testDir: './tests/live',
  timeout: 60000,
  expect: { timeout: 15000 },
  workers: 1,
  reporter: 'list',
  outputDir: 'test-results/live',
  use: {
    baseURL,
    headless: true,
    channel: process.env.CI ? undefined : 'chrome',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
});
