// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { remarkAlert } from 'remark-github-blockquote-alert';
import {
  transformerNotationDiff,
  transformerMetaHighlight,
} from '@shikijs/transformers';
import { siteConfig } from './src/config.ts';

// Custom transformer to add title attribute as data attribute
function transformerTitle() {
  return {
    name: 'transformer-title',
    // @ts-expect-error any type
    pre(node) {
      // @ts-expect-error any type
      const meta = this.options?.meta?.__raw || '';
      const titleMatch = meta.match(/title="([^"]+)"/);
      if (titleMatch) {
        node.properties['data-title'] = titleMatch[1];
      }
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: siteConfig.site || undefined,
  integrations: [mdx()],
  markdown: {
    remarkPlugins: [remarkAlert],
    shikiConfig: {
      theme: 'github-dark',
      transformers: [
        transformerTitle(),
        transformerNotationDiff(),
        transformerMetaHighlight(),
      ],
    },
  },
});
