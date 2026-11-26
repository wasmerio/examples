// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { aonoteMarkdown } from './src/integrations/aonote-markdown.ts';
import { site } from './src/site.config.ts';

/** @type {import('astro').AstroUserConfig} */
export default defineConfig({
  site: site.baseUrl,
  base: site.repoSubpath || undefined,
  trailingSlash: 'always',
  // Astro 7 changed the default from `true` to 'jsx' (JSX whitespace rules:
  // whitespace between inline elements is collapsed). This is already the v7
  // default — stated explicitly to record the intent, so it isn't "fixed" back
  // to `true` by mistake.
  compressHTML: 'jsx',
  integrations: [
    aonoteMarkdown(),
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
  vite: {
    build: {
      cssMinify: true,
    },
  },
});
