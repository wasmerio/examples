// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import { site } from './src/config.ts';
import { satteri } from '@astrojs/markdown-satteri';
import { tableScroll } from './src/lib/table-scroll.ts';
import { cutPlugin } from './src/lib/cut-plugin.ts';
import { captionPlugin } from './src/lib/caption-plugin.ts';

// Webfonts. Piazzolla sets the body (a text face drawn for news columns, sturdy at small
// sizes); Barlow Semi Condensed sets headings, issue numbers and the UI.
/** @type {NonNullable<import('astro').AstroUserConfig['fonts']>} */
const fonts = [
  {
    provider: fontProviders.fontsource(),
    name: 'Piazzolla',
    cssVariable: '--font-body',
    weights: [400, 600],
    styles: ['normal', 'italic'],
    subsets: ['latin'],
    fallbacks: ['Georgia', 'serif'],
  },
  {
    provider: fontProviders.fontsource(),
    name: 'Barlow Semi Condensed',
    cssVariable: '--font-heading',
    weights: [500, 700, 800],
    styles: ['normal'],
    subsets: ['latin'],
    fallbacks: ['Arial Narrow', 'Helvetica Neue', 'sans-serif'],
  },
];

// https://astro.build/config
export default defineConfig({
  // SITE_URL overrides config.ts at build time (used by demo deploys).
  site: process.env.SITE_URL ?? site.url,
  markdown: {
    processor: satteri({ mdastPlugins: [cutPlugin, captionPlugin], hastPlugins: [tableScroll] }),
    // The default github-dark sets comments at about 3:1 on its background, under WCAG AA.
    shikiConfig: { theme: 'github-dark-high-contrast' },
  },
  // Pictures in issues get a srcset sized to the reading column instead of shipping the original.
  image: { layout: 'constrained' },
  integrations: [
    mdx(),
    sitemap({ filter: (page) => !/\/(styleguide|subscribed)\/$/.test(page) }),
    icon(),
    {
      name: 'theme-styleguide',
      hooks: {
        'astro:config:setup': ({ command, injectRoute }) => {
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
