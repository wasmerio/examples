// @ts-check
import { defineConfig } from 'astro/config';

import icon from 'astro-icon';

import expressiveCode from 'astro-expressive-code';
import ecConfig from './ec.config.mjs';
import tailwindcss from '@tailwindcss/vite';
import { unified } from '@astrojs/markdown-remark';
import remarkDirective from 'remark-directive';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { remarkTabs } from './src/lib/markdown/remark-tabs.mjs';
import { rehypeHeadingAnchors } from './src/lib/markdown/rehype-heading-anchors.mjs';
import { rehypeAlerts } from './src/lib/markdown/rehype-alerts.mjs';
import { rehypeImageGroups } from './src/lib/markdown/rehype-image-groups.mjs';
import { rehypeMermaid } from './src/lib/markdown/rehype-mermaid.mjs';

const site = process.env.ASTRO_SITE;
const base = process.env.ASTRO_BASE;

// https://astro.build/config
export default defineConfig({
  ...(site ? { site } : {}),
  ...(base ? { base } : {}),
  i18n: {
    locales: ['en', 'zh-cn'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false
    }
  },
  integrations: [icon(), expressiveCode(ecConfig)],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath, remarkDirective, remarkTabs],
      rehypePlugins: [
        rehypeKatex,
        rehypeHeadingAnchors,
        rehypeAlerts,
        rehypeImageGroups,
        rehypeMermaid
      ]
    })
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
