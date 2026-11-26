// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';

// SITE_URL and BASE_PATH come from the environment (or a .env file).
//   SITE_URL   the origin the site is served from, e.g. https://you.github.io
//   BASE_PATH  the folder it lives in, e.g. /astro-blog-template/ (default "/")
const env = { ...loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), ''), ...process.env };

const site = env.SITE_URL || 'https://example.com';
const base = env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
