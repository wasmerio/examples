import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Set this to your own origin before deploying — it drives canonical URLs
// and sitemap.xml.
const SITE = process.env.SITE_URL ?? 'https://example.com';

export default defineConfig({
  site: SITE,
  output: 'static',
  integrations: [sitemap()],
  build: { format: 'directory' },
  markdown: {
    shikiConfig: { theme: 'github-light', wrap: true },
  },
});
