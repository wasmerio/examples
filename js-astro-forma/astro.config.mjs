// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { SITE_BASE_PATH, SITE_URL } from './site.config.mjs';

export default defineConfig({
  output: 'static',
  site: SITE_URL,
  base: SITE_BASE_PATH,
  compressHTML: true,
  image: {
    responsiveStyles: true,
  },
  build: {
    assets: '_assets',
    inlineStylesheets: 'never',
  },
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/dev/') && !page.includes('/qa/'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        usePolling: true,
        interval: 300,
        awaitWriteFinish: {
          stabilityThreshold: 400,
          pollInterval: 50,
        },
      },
    },
    build: {
      minify: 'esbuild',
      cssMinify: 'lightningcss',
      cssCodeSplit: false,
      rollupOptions: {
        output: {
          entryFileNames: 'js/[name]-[hash].js',
          chunkFileNames: 'js/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
        '@layouts': fileURLToPath(new URL('./src/layouts', import.meta.url)),
        '@data': fileURLToPath(new URL('./src/data', import.meta.url)),
        '@styles': fileURLToPath(new URL('./src/styles', import.meta.url)),
        '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
        '@config': fileURLToPath(new URL('./src/config', import.meta.url)),
      },
    },
    optimizeDeps: {
      noDiscovery: false,
    },
  },
});
