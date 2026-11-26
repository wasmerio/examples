import { defineConfig, devices } from '@playwright/test';

import { siteConfig } from './src/data/siteConfig';

const port = process.env.TEST_PORT || '4321';
const rawUrl = process.env.ASTRO_URL || siteConfig.url;
const base = rawUrl ? new URL(rawUrl).pathname.replace(/\/+$/, '') : '';
const serverUrl = `http://localhost:${port}${base ? `${base}/` : '/'}`;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: undefined,
  reporter: process.env.CI
    ? [['github'], ['list']]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: serverUrl,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 5000,
    navigationTimeout: 10000,
    permissions: ['clipboard-read', 'clipboard-write'],
  },
  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
      },
    },
    {
      name: 'Mobile Chrome',
      testIgnore: ['**/api.spec.ts'],
      use: { ...devices['Pixel 7'] },
    },
  ],
  webServer: {
    command: process.env.CI
      ? `pnpm preview --port ${port} --ignore-lock`
      : `pnpm dev --port ${port} --ignore-lock`,
    url: serverUrl,
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
