import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 45000,
  expect: { timeout: 10000 },
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4323',
    headless: true,
    channel: process.env.CI ? undefined : 'chrome',
    screenshot: 'only-on-failure',
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: 'npm run build && npm run preview -- --port 4323 --ignore-lock',
        url: 'http://127.0.0.1:4323',
        reuseExistingServer: false,
        timeout: 60000,
        env: {
          AE_E2E_BUILD: 'true',
          PUBLIC_CONTACT_ENABLED: 'false',
          PUBLIC_TURNSTILE_SITE_KEY: '',
        },
      },
});
