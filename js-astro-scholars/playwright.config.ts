import { defineConfig } from '@playwright/test';

if (!process.env.BROWSER_BASE_URL) throw new Error('Run pnpm test:browser to build and serve isolated content.');

export default defineConfig({
	testDir: './e2e',
	forbidOnly: !!process.env.CI,
	workers: 1,
	retries: 0,
	reporter: [['list'], ['html', { open: 'never' }]],
	use: {
		baseURL: process.env.BROWSER_BASE_URL,
		viewport: { width: 1440, height: 900 },
		colorScheme: 'light',
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
	},
	projects: (['chromium', 'firefox', 'webkit'] as const).map((browserName) => ({
		name: browserName,
		use: { browserName },
	})),
});
