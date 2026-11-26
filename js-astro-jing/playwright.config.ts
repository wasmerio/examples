import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: "http://localhost:14321",
  },
  webServer: {
    command: "pnpm build && ASTRO_PREVIEW_BACKGROUND=0 pnpm preview --port 14321",
    url: "http://localhost:14321",
    reuseExistingServer: !process.env.CI,
  },
});
