// @ts-check
import { defineConfig } from 'astro/config';

// SITE_URL / BASE_PATH are set by the GitHub Pages workflow for the demo.
// For your own site just set `site` to your domain and leave `base` alone.
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://example.com',
  base: process.env.BASE_PATH ?? '/',
});
