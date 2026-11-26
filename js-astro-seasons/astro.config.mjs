import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import { SITE_URL } from './src/lib/site.ts';

import tailwindcss from '@tailwindcss/vite';

// The deploy workflow sets these for GitHub Pages project pages (https://<owner>.github.io/<repo>/).
const BASE_PATH = process.env.BASE_PATH || undefined;

export default defineConfig({
  site: process.env.SITE_URL || SITE_URL,
  base: BASE_PATH,

  compressHTML: true,

  markdown: {
    shikiConfig: { theme: 'css-variables' },
  },

  integrations: [sitemap(), mdx()],

  vite: {
    plugins: [tailwindcss()],
  },
});
