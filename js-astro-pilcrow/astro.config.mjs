// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import { satteri } from '@astrojs/markdown-satteri';
import { tableScroll } from './src/utils/table-scroll.ts';
import { math } from './src/utils/math.ts';
import { site } from './src/config.ts';

// GFM task-list checkboxes have no accessible name and fail Lighthouse's 'label' audit. Wrap the item in a <label>
const taskListLabels = {
  name: 'pilcrow-task-list-labels',
  element: {
    filter: ['li'],
    /** @param {any} node hast Element */
    visit(node) {
      const [first] = node.children;
      if (first?.type !== 'element' || first.tagName !== 'input') return;
      return {
        ...node,
        children: [{ type: 'element', tagName: 'label', properties: {}, children: node.children }],
      };
    },
  },
};

// https://astro.build/config
export default defineConfig({
  // SITE_URL overrides config.ts at build time (used by the demo deploys)
  site: process.env.SITE_URL ?? site.url,
  markdown: {
    processor: satteri({
      features: { math: true },
      mdastPlugins: [math],
      hastPlugins: [taskListLabels, tableScroll],
    }),
    // Emit light and dark themes as CSS variables. Colors are applied at the end of global.css
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' }, defaultColor: false },
  },
  integrations: [
    mdx(),
    sitemap(),
    icon(),
    {
      name: 'pilcrow-styleguide',
      hooks: {
        'astro:config:setup': ({ command, injectRoute }) => {
          // Demo builds only (the demo bar links to it): the changelog as a page
          if (process.env.PUBLIC_DEMO_BUY_URL)
            injectRoute({ pattern: '/whats-new', entrypoint: './src/pages/_whats-new.astro' });
          if (command === 'dev')
            injectRoute({ pattern: '/styleguide', entrypoint: './src/pages/_styleguide.astro' });
        },
      },
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
