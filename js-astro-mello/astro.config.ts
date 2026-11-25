// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import expressiveCode from 'astro-expressive-code';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  integrations: [sitemap(), icon(), expressiveCode({
    themes: ['min-dark', 'rose-pine-dawn'],
    themeCssSelector: (theme) => `[data-theme='${theme.type}']`})],
  markdown: {
      remarkPlugins: ['remark-directive', 'remark-breaks', 'remark-math', 'remark-blackout', 'remark-alert'],
      rehypePlugins: ['rehype-mathjax'],
  }
});