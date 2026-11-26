import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { site } from './src/site.config';

// SITE_URL / BASE_PATH let you deploy to a sub-path (e.g. GitHub Pages project sites)
// without editing code: SITE_URL=https://user.github.io BASE_PATH=/repo npm run build
export default defineConfig({
  site: process.env.SITE_URL ?? site.url,
  base: process.env.BASE_PATH ?? '/',
  i18n: {
    locales: site.locales,
    defaultLocale: site.defaultLocale,
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
      i18n: {
        defaultLocale: site.defaultLocale,
        locales: Object.fromEntries(site.locales.map((l) => [l, l === 'pt-br' ? 'pt-BR' : 'en'])),
      },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
