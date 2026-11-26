import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || 'https://casper.leons.dev',
  base: process.env.BASE_PATH || '/',
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
  fonts: [
    {
      name: 'Inter',
      cssVariable: '--font-inter',
      provider: fontProviders.google({
        weights: [300, 400, 500, 600, 700],
        display: 'swap',
      }),
    },
  ],
});
