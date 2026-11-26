import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import { defineConfig } from 'astro/config';
import { site } from './src/config/site.ts';

const base = process.env.SITE_BASE || '/';

export default defineConfig({
  site: site.url,
  base,
  output: 'static',
  integrations: [
    icon(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', 'pt-br': 'pt-BR' },
      },
    }),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt-br'],
    routing: { prefixDefaultLocale: false },
  },
  trailingSlash: 'never',
  build: {
    format: 'directory',
    inlineStylesheets: 'always',
  },
  vite: {
    plugins: [tailwindcss()],
  },
  preview: {
    host: '127.0.0.1',
    port: Number(process.env.PREVIEW_PORT || 4321),
    strictPort: true,
  },
});
