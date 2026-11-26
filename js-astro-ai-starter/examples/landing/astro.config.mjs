// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Set BASE_PATH when the site is served from a sub-path, e.g. /astro-ai-landing on a GitHub project page.
const base = process.env.BASE_PATH || '/';

export default defineConfig({
	site: process.env.SITE_URL || 'https://fengyiqicoder.github.io',
	base,
	vite: { plugins: [tailwindcss()] },
});
