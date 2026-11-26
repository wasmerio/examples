// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import { satteri } from '@astrojs/markdown-satteri';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import { math } from './src/lib/math.ts';
import { site } from './src/config.ts';

/*
  GFM writes a task list as `<li><input type="checkbox" disabled>text</li>`, and a
  checkbox with no label of its own is an accessibility failure -- the audit has nothing
  to read out and the words beside the box are not part of the control. Wrapping the
  item's contents in a <label> makes the two one thing. Sätteri walks the tree; this
  only says what to do with a list item whose first child is the input.
*/
const taskListLabels = {
  name: 'leader-task-list-labels',
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
  // SITE_URL overrides config.ts at build time (used by demo deploys).
  site: process.env.SITE_URL ?? site.url,
  integrations: [
    mdx(),
    // Pages that print `noindex` stay out of the sitemap too, or the sitemap asks a search
    // engine to index what the page tells it not to. Add a page here when you mark it noindex.
    sitemap({ filter: (page) => !/\/(styleguide|privacy|terms)\/$/.test(page) }),
    icon(),
    {
      name: 'theme-styleguide',
      hooks: {
        'astro:config:setup': ({ command, injectRoute }) => {
          // Demo builds only (the demo bar links to it): the changelog as a page
          if (process.env.PUBLIC_DEMO_BUY_URL)
            injectRoute({ pattern: '/whats-new', entrypoint: './src/pages/_whats-new.astro' });
          // Dev only: the styleguide is a design tool, not a page buyers ship.
          if (command === 'dev')
            injectRoute({ pattern: '/styleguide', entrypoint: './src/pages/_styleguide.astro' });
        },
      },
    },
  ],
  // Shiki ships a dark IDE theme by default, which drops a black slab into a
  // warm grey page. 'css-variables' hands the colours back to tokens.css, so a
  // code block is set in the same four accents as everything else.
  markdown: {
    // math: $…$ and $$…$$ become KaTeX HTML at build time (src/lib/math.ts).
    processor: satteri({
      features: { math: true },
      mdastPlugins: [math],
      hastPlugins: [taskListLabels],
    }),
    shikiConfig: { theme: 'css-variables', wrap: false },
  },
  // One grotesque carries the whole theme; weight never goes above 400, so only
  // the light end of the family is shipped. DM Mono sets the metadata line.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Hanken Grotesk',
      cssVariable: '--font-sans-face',
      weights: [200, 300, 400],
      subsets: ['latin'],
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'DM Mono',
      cssVariable: '--font-mono-face',
      weights: [300, 400],
      // No italic: the mono face only ever sets metadata, never prose.
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-monospace', 'monospace'],
    },
  ],
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Keep light-dark() native. Vite's default target makes Lightning CSS lower it to
      // prefers-color-scheme blocks, which the theme switcher then cannot override.
      // Older browsers fall back to the light values in tokens.css.
      cssTarget: ['chrome123', 'edge123', 'firefox120', 'safari17.5'],
    },
  },
});
