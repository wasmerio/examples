import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import lone from './src/integration';
import { site } from './lone.config';

export default defineConfig({
  site: site.url,
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) =>
        !/\/page\/1\/?$/.test(page) &&
        !/\/categories\/?$/.test(page),
    }),
    lone(),
  ],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
});
