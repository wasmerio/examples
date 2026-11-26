// @ts-check
import { defineConfig } from 'astro/config';

import { defaultLocale, locales } from './src/i18n/config.ts';

/**
 * https://astro.build/config
 *
 * The i18n block here buys three things and nothing more: `Astro.currentLocale`,
 * the `astro:i18n` helpers, and the guarantee that the default locale keeps its
 * unprefixed URLs. Routing is ours, in `src/pages/[...locale]/`, because this
 * site answers for every locale on every page and decides per page whether it
 * has a translation to serve. Astro's own `i18n.fallback` solves the same
 * problem for sites whose pages are files per locale; AGENTS.md says when to
 * prefer it.
 */
export default defineConfig({
  site: 'https://example.com',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  i18n: {
    locales: [...locales],
    defaultLocale,
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
