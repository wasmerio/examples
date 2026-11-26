// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Set BASE_PATH when the site is served from a sub-path, e.g. /astro-ai-shop on a GitHub project page.
const base = process.env.BASE_PATH || '/';

export default defineConfig({
	site: process.env.SITE_URL || 'https://fengyiqicoder.github.io',
	base,
	trailingSlash: 'ignore',
	// The CSS is small, so it goes inline: no render-blocking request.
	build: { inlineStylesheets: 'always' },
	integrations: [sitemap({ filter: (page) => !/\/(success|404)\/?$/.test(page) })],
});
