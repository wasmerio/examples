// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { site } from './src/config.ts';
import { sourceGutter } from './src/lib/monoline-plugin.ts';
import { math } from './src/lib/math.ts';
import { noteIds, noteLinks } from './src/lib/note-links.ts';

// Webfonts. Reading text in Atkinson Hyperlegible Next; everything structural (navigation,
// dates, titles, paths, the source gutter, code) in its monospaced sibling. One family, the
// same x-height (0.496). Keep --font-heading a monospace face: tables and the gutter use ch.
/** @type {NonNullable<import('astro').AstroUserConfig['fonts']>} */
const fonts = [
  {
    provider: fontProviders.fontsource(),
    name: 'Atkinson Hyperlegible Next',
    cssVariable: '--font-body',
    weights: [400, 700],
    styles: ['normal', 'italic'],
    subsets: ['latin'],
    fallbacks: ['system-ui', 'sans-serif'],
  },
  {
    provider: fontProviders.fontsource(),
    name: 'Atkinson Hyperlegible Mono',
    cssVariable: '--font-heading',
    weights: [400, 500, 700],
    styles: ['normal'],
    subsets: ['latin'],
    fallbacks: ['ui-monospace', 'monospace'],
  },
];

// https://astro.build/config
export default defineConfig({
  // SITE_URL overrides config.ts at build time (used by demo deploys).
  site: process.env.SITE_URL ?? site.url,
  markdown: {
    // Astro 7 renders Markdown with Sätteri: plugins are hast/mdast visitors, not rehype plugins.
    // noteLinks: [[wikilinks]] and ./note.md links become /notes/<id> (src/lib/note-links.ts).
    // math: $…$ and $$…$$ become KaTeX HTML at build time (src/lib/math.ts).
    processor: satteri({
      features: { math: true },
      mdastPlugins: [noteLinks(noteIds('./src/content/notes')), math],
      hastPlugins: [sourceGutter],
    }),
    // Both themes as CSS variables on --surface (monoline.css). The high-contrast pair keeps
    // comments above AA; the defaults set them near 3:1.
    shikiConfig: {
      themes: { light: 'github-light-high-contrast', dark: 'github-dark-high-contrast' },
      defaultColor: false,
    },
  },
  integrations: [
    mdx(),
    sitemap({ filter: (page) => !page.endsWith('/styleguide/') }),
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
  fonts,
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
