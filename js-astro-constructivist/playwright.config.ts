import process from 'node:process'
import { defineConfig, devices } from '@playwright/test'

const baseURL = new URL(process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:4321/')
if (!baseURL.pathname.endsWith('/'))
  baseURL.pathname += '/'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['list'],
  ],
  use: {
    baseURL: baseURL.href,
    trace: 'retain-on-failure',
    colorScheme: 'light',
  },
  webServer: {
    command: process.env.PLAYWRIGHT_SERVER_COMMAND ?? 'pnpm dev --port 4321 --host 127.0.0.1',
    url: baseURL.href,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'mobile',
      use: {
        ...devices['Pixel 7'],
        viewport: { width: 390, height: 844 },
      },
    },
  ],
})
