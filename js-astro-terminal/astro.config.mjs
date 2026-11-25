// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://dennisklappe.github.io',
  // Only use base path in production (GitHub Pages)
  base: process.env.NODE_ENV === 'production' ? '/astro-theme-terminal' : '/',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'css-variables',
      langs: [],
      wrap: true,
    },
  },
});
