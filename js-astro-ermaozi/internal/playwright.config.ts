import { defineConfig } from '@playwright/test'
import { fileURLToPath } from 'node:url'

const projectRoot = fileURLToPath(new URL('..', import.meta.url))

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  workers: 1,
  outputDir: './artifacts/test-results',
  timeout: 45_000,
  use: {
    baseURL: 'http://127.0.0.1:4321',
    viewport: { width: 1440, height: 900 },
    colorScheme: 'light',
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
      : {},
  },
  webServer: { command: 'python3 -m http.server 4321 --directory dist', cwd: projectRoot, port: 4321, reuseExistingServer: true },
})
