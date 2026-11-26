import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.PREVIEW_PORT || 44321);
const base = process.env.SITE_BASE || '/';
const prefix = base.startsWith('/') ? base : `/${base}`;
const normalized = prefix.endsWith('/') ? prefix : `${prefix}/`;
const origin = `http://127.0.0.1:${port}${normalized}`;

export default defineConfig({
  testDir: 'tests/browser',
  testMatch: '*.spec.ts',
  fullyParallel: true,
  retries: 0,
  use: {
    baseURL: origin,
    ...devices['Desktop Chrome'],
  },
  webServer: {
    command: `npm run build && npm run preview -- --host 127.0.0.1 --port ${port} --ignore-lock`,
    url: origin,
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
