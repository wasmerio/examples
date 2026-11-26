// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import { site } from './src/config.ts';

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
          // Dev only: the styleguide is a design tool, not a page buyers ship.
          if (command === 'dev')
            injectRoute({ pattern: '/styleguide', entrypoint: './src/pages/_styleguide.astro' });
        },
      },
    },
  ],
  // Webfonts: Bodoni Moda sets covers and feature openers (the didone contrast the
  // magazine reference lives on), Archivo carries kickers, folios and UI, Literata
  // carries body text. All OFL, latin subset, served by the fontsource provider.
  // The last names in each `fallbacks` list are the system
  // Korean faces: no latin face here carries Hangul, and a CJK webfont is megabytes,
  // so a second-language edition is set in the reader's own system face. Ship one
  // yourself by adding it to this block and pointing --font-body at it in theme.css.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Literata',
      cssVariable: '--font-body',
      weights: [400, 700],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['Georgia', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Archivo',
      cssVariable: '--font-heading',
      weights: [400, 500, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: [
        'Helvetica Neue',
        'Apple SD Gothic Neo',
        'Noto Sans KR',
        'Malgun Gothic',
        'sans-serif',
      ],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Bodoni Moda',
      cssVariable: '--font-display',
      weights: [400, 700],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: [
        'Didot',
        'Georgia',
        'Apple SD Gothic Neo',
        'Noto Sans KR',
        'Malgun Gothic',
        'serif',
      ],
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
