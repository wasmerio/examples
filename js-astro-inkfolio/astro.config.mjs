import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import remarkCallouts from './src/lib/remark-callouts.mjs';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import transformerCodeMeta from './src/lib/shiki-code-meta.mjs';
import rehypeCodeShell from './src/lib/rehype-code-shell.mjs';
import { transformerNotationDiff, transformerNotationHighlight } from '@shikijs/transformers';

const config = parse(readFileSync(new URL('./site.config.yaml', import.meta.url), 'utf8'));

export default defineConfig({
  // SITE_URL lets a demo/host build override the canonical domain without
  // editing site.config.yaml (e.g. SITE_URL=https://inkfolio.pages.dev).
  site: process.env.SITE_URL || config.site.url,
  trailingSlash: 'always',
  markdown: {
    remarkPlugins: [remarkCallouts, remarkMath],
    rehypePlugins: [rehypeCodeShell, rehypeKatex],
    shikiConfig: {
      // Two themes, applied through CSS variables so the shell can switch palettes.
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
      // ```yaml title="site.config.yaml"  → labelled block
      // // [!code highlight]              → highlighted line
      // // [!code ++] / // [!code --]     → diff lines
      transformers: [transformerCodeMeta(), transformerNotationHighlight(), transformerNotationDiff()],
    },
  },
  integrations: [sitemap()],
});
