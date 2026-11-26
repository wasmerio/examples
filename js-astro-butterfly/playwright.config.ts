import { defineConfig, devices } from '@playwright/test';

// Runs against the production build: `pnpm build` first.
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  // a single local preview server feeds every browser; keep load (and flakiness) down
  workers: process.env.CI ? 2 : 4,
  expect: { timeout: 10_000 },
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    channel: process.env.PLAYWRIGHT_CHANNEL,
    baseURL: 'http://127.0.0.1:4330',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'] }, grep: /@mobile/ },
  ],
  webServer: {
    command: 'pnpm preview --port 4330 --host 127.0.0.1 --force',
    url: 'http://127.0.0.1:4330/',
    reuseExistingServer: !process.env.CI,
  },
});
