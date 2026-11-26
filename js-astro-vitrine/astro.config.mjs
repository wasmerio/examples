// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import { site } from './src/config.ts';
import { satteri } from '@astrojs/markdown-satteri';
import { tableScroll } from './src/lib/table-scroll.ts';

// https://astro.build/config
export default defineConfig({
  // tableScroll: wide tables scroll in a wrapper, keeping their table semantics.
  markdown: { processor: satteri({ hastPlugins: [tableScroll] }) },
  // SITE_URL overrides config.ts at build time (used by demo deploys).
  site: process.env.SITE_URL ?? site.url,
  integrations: [
    mdx(),
    sitemap({ filter: (page) => !/\/styleguide\/$/.test(page) }),
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
  // Bodoni Moda carries a variable optical-size axis, so the hairline serifs survive
  // at nameplate size and thicken by themselves in small headings.
  // Spectral is the body face because captions go down to 0.78rem, where a large
  // x-height screen serif holds and an old-style face breaks up.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Bodoni Moda',
      cssVariable: '--font-heading',
      weights: ['400 500'],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['Georgia', 'serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Spectral',
      cssVariable: '--font-body',
      weights: [400, 600],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['Georgia', 'serif'],
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
