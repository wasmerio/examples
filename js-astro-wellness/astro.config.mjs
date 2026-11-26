// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Template placeholder — replace with your real domain before deploying
  // so the sitemap and canonical URLs point at the live site.
  site: 'https://example.com',
  integrations: [sitemap()],
  vite: {
    css: {
      preprocessorOptions: {
        // Bulma 1.0.4 still uses the legacy Sass if() function; silence the
        // dependency warning without hiding warnings from our own styles.
        scss: {
          silenceDeprecations: ['if-function'],
        },
      },
    },
  },
});
