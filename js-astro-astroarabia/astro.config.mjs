import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import astroToc from 'astro-toc-smol';

export default defineConfig({
  site: 'https://example.com',
  trailingSlash: 'never',
  integrations: [sitemap(), astroToc({ articleSelector: '#article-content' })],
  build: { inlineStylesheets: 'always' },
  vite: {
    plugins: [tailwindcss()]
  }
});
