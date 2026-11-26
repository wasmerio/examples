// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import { satteri } from '@astrojs/markdown-satteri';
import { math } from './src/lib/math.ts';
import { site } from './src/config.ts';

// Five scopes and the ink. A printed manual colours keywords, strings, numbers,
// names and comments, and leaves punctuation alone; adding more only makes the
// block louder than the prose around it.
const codeTheme = {
  name: 'quarry',
  // Ignored in practice: every colour below is a custom property carrying both modes.
  type: /** @type {const} */ ('light'),
  colors: { 'editor.background': 'var(--surface)', 'editor.foreground': 'var(--foreground)' },
  settings: [
    {
      scope: ['comment', 'punctuation.definition.comment'],
      settings: { foreground: 'var(--code-comment)' },
    },
    {
      scope: [
        'keyword',
        'storage',
        'storage.type',
        'keyword.control',
        'keyword.operator.new',
        'variable.language',
        'constant.language',
        'entity.name.tag',
      ],
      settings: { foreground: 'var(--code-keyword)' },
    },
    {
      scope: ['string', 'string.quoted', 'constant.other.symbol', 'meta.attribute-selector'],
      settings: { foreground: 'var(--code-string)' },
    },
    {
      scope: ['constant.numeric', 'constant.character', 'constant.other', 'support.constant'],
      settings: { foreground: 'var(--code-number)' },
    },
    {
      scope: [
        'entity.name.function',
        'support.function',
        'variable.function',
        'entity.name.type',
        'support.type',
        'support.class',
        'entity.name.class',
      ],
      settings: { foreground: 'var(--code-function)' },
    },
  ],
};

// https://astro.build/config
export default defineConfig({
  // SITE_URL overrides config.ts at build time (used by demo deploys).
  site: process.env.SITE_URL ?? site.url,
  integrations: [
    mdx(),
    sitemap({ filter: (page) => !page.endsWith('/styleguide/') }),
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
  markdown: {
    // The code theme is the site's own tokens rather than an imported palette.
    // Shiki copies these strings straight into the style attribute, so the block
    // follows light-dark() with the rest of the page and `pnpm check:contrast`
    // measures every one of them on both surfaces -- which an off-the-shelf theme
    // does not survive: most of them fail AA on a paper-coloured background.
    shikiConfig: { theme: codeTheme, wrap: false },
    // A reference table can be wider than a phone. Markdown emits a bare `<table>`, so
    // the scroll box is added here rather than in the page; `tabindex` is what makes a
    // scrollable box reachable without a mouse, and axe fails the page without it.
    processor: satteri({
      features: { math: true },
      mdastPlugins: [math],
      hastPlugins: [
        {
          name: 'quarry-scrollable-tables',
          element: {
            filter: ['table'],
            visit(node, ctx) {
              ctx.wrapNode(node, {
                type: 'element',
                tagName: 'div',
                properties: { className: ['table-scroll'], tabIndex: 0 },
                children: [],
              });
            },
          },
        },
      ],
    }),
  },
  // Webfonts. One sans for everything on screen, one mono for code and the
  // rail labels. Both OFL, latin subset, served by the fontsource provider.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Public Sans',
      cssVariable: '--font-body',
      weights: [400, 500, 600],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'JetBrains Mono',
      cssVariable: '--font-mono',
      weights: [400, 500],
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
