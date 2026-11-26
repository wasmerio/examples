import { existsSync } from 'node:fs';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { applyOverlay, type VillaOverlay } from './src/config/overlay.ts';
import { LOCALE_META } from './src/i18n/locales.ts';
import { villa as baseVilla } from './villa.config.ts';

// The hosted demo adds demo/villa.demo.ts (not in the theme package), e.g. its own address.
const demoFile = new URL('./demo/villa.demo.ts', import.meta.url);
// A computed specifier: the theme package has no demo/ folder, and the type checker must not look for it.
const overlay: VillaOverlay | undefined = existsSync(demoFile)
  ? ((await import(/* @vite-ignore */ demoFile.href)) as { demo: VillaOverlay }).demo
  : undefined;
const villa = overlay ? applyOverlay(baseVilla, overlay) : baseVilla;

const { default: defaultLocale, active } = villa.languages;

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: villa.site.url,
  trailingSlash: 'always',
  // Keep HTML-aware whitespace (Astro 7 defaults to JSX rules, which glue inline words together).
  compressHTML: true,
  i18n: {
    locales: [...active],
    defaultLocale,
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale,
        locales: Object.fromEntries(active.map((l) => [l, LOCALE_META[l].bcp47])),
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
