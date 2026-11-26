import { defineConfig, devices } from '@playwright/test';

const PORT = 4321;
const baseURL = process.env.WISP_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  snapshotPathTemplate: '{testDir}/__screenshots__/{testFilePath}/{arg}{ext}',
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.001, animations: 'disabled', caret: 'hide' } },
  use: { baseURL, trace: 'retain-on-failure' },
  webServer: process.env.WISP_BASE_URL
    ? undefined
    : {
        command: `pnpm build && pnpm preview --port ${PORT} --ignore-lock`,
        url: `http://localhost:${PORT}`,
        reuseExistingServer: !process.env.CI,
        timeout: 300_000,
      },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'mobile',
      use: { ...devices['Desktop Chrome'], viewport: { width: 375, height: 812 } },
      // 视觉回归自行设置视口；主题首帧测试与视口无关
      testMatch: /(a11y|content|explainer)\.spec\.ts/,
    },
  ],
});
