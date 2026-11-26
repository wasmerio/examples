// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/*
 * Site and base can be set here or passed as environment variables, which is
 * what a CI deploy usually wants:
 *
 *   SITE=https://example.com npm run build
 *   SITE=https://example.com BASE=/directory/ npm run build   (subdirectory)
 */
export default defineConfig({
  site: process.env.SITE || 'https://example.com',
  base: process.env.BASE || '/',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
});
