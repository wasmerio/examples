// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { siteConfig } from './src/config.ts';
import { inSearch } from './src/lib/seo.ts';
import { socialImages } from './src/integrations/social-images.ts';

export default defineConfig({
  site: siteConfig.origin,
  // Every URL ends in '/': build.format 'directory' writes x/index.html, which static hosts serve at /x/.
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    socialImages(),
    sitemap({
      // Only pages search engines may index, the same rule as the robots meta tag.
      filter: (page) => inSearch(new URL(page).pathname),
      namespaces: { news: false, xhtml: false, image: false, video: false },
    }),
  ],
});
