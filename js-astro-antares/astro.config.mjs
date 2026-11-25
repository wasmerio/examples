import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import unocss from 'unocss/astro'
import icon from "astro-icon";
import pagefind from "astro-pagefind";
import expressiveCode from 'astro-expressive-code';
import { BASE_URL } from './src/config'
import { remarkPlugins, rehypePlugins } from './plugins';

// https://astro.build/config
export default defineConfig({
  site: BASE_URL,
  integrations: [
    expressiveCode(),
    mdx(),
    sitemap({ filter: page => ['/tags/','/categories/'].map(PATH=>page.startsWith(BASE_URL+PATH)).includes(false) }),
    unocss({ injectReset: true, configFile: '/uno.config.ts' }),
    icon(),
    pagefind(),
  ],
  markdown: {
    remarkPlugins,
    rehypePlugins
  }
});