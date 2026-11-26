// @ts-check
import { defineConfig } from 'astro/config';
import path from 'path';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // change site url to your own
  site: `https://localhost:4321`,
  output: `static`,
  vite: {
    build: {
      rollupOptions: {
        external: ['/pagefind/pagefind.js'],
      },
    },
    resolve: {
      alias: {
        '@root': path.resolve('./'),
        '@src': path.resolve('./src'),
        '@assets': path.resolve('./src/assets'),
        '@components': path.resolve('./src/components'),
        '@content': path.resolve('./src/content'),
        '@i18n': path.resolve('./src/i18n'),
        '@layouts': path.resolve('./src/layouts'),
        '@lib': path.resolve('./src/lib'),
        '@styles': path.resolve('./src/styles'),
      },
    },

    plugins: [tailwindcss()],
  },
  integrations: [sitemap()],
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
});
