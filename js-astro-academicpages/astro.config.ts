import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import { defineConfig, envField, svgoOptimizer } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

import { siteConfig } from '@data/siteConfig';
import { rehypeExternalLinks } from '@plugins/rehype-external-links';
import { rehypeTableWrapper } from '@plugins/rehype-table-wrapper';

const rawUrl = process.env.ASTRO_URL || siteConfig.url;
const parsedUrl = rawUrl ? new URL(rawUrl) : undefined;

const site = parsedUrl ? parsedUrl.origin : undefined;
const base =
  parsedUrl && parsedUrl.pathname !== '/'
    ? parsedUrl.pathname.replace(/\/+$/, '')
    : undefined;

export default defineConfig({
  site,
  base,
  integrations: [icon(), sitemap()],
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  build: { inlineStylesheets: 'auto' },
  env: {
    schema: {
      ASTRO_URL: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
    },
  },
  experimental: {
    svgOptimizer: svgoOptimizer({ multipass: true, floatPrecision: 2 }),
  },
  redirects: {
    '/about': '/',
    '/resume': '/cv/',
    '/guide': '/markdown/',
    '/md': '/markdown/',
  },
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
      langAlias: { plotly: 'json', R: 'r' },
    },
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex, rehypeExternalLinks, rehypeTableWrapper],
    }),
  },
  vite: { plugins: [tailwindcss()] },
});
