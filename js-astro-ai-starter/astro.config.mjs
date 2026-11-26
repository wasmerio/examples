// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import pagefind from 'astro-pagefind';
import tailwindcss from '@tailwindcss/vite';

// Set BASE_PATH when the site is served from a sub-path, e.g. /astro-ai-starter on a GitHub project page.
const base = process.env.BASE_PATH || '/';

export default defineConfig({
	site: process.env.SITE_URL || 'https://fengyiqicoder.github.io',
	base,
	trailingSlash: 'always',
	integrations: [mdx(), sitemap(), pagefind()],
	markdown: { shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } } },
	vite: { plugins: [tailwindcss()] },
});
