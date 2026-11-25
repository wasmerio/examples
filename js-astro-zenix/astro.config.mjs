// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { passthroughImageService } from 'astro/config';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://zenix.farrosfr.com',
  base: '/',
  trailingSlash: 'always',

  build: {
    inlineStylesheets: 'always'
  },

  image: {
    service: passthroughImageService(),
    domains: ['i.pravatar.cc']
  },

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [mdx()]
});