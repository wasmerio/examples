// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * Site URL used for canonical links, Open Graph tags, the sitemap and RSS.
 * Set SITE_URL in your hosting provider (or a local .env file) — or replace
 * the fallback below with your real domain.
 */
const site = process.env.SITE_URL ?? 'https://yoga-fitness-seven.vercel.app';

/**
 * Optional sub-path, e.g. "/yoga-fitness" for a GitHub Pages project site.
 * Leave unset when the site is served from the domain root.
 */
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site,
  base,
  output: 'static',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Inter Tight',
      cssVariable: '--font-inter-tight',
      fallbacks: ['Helvetica Neue', 'Arial', 'sans-serif'],
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/InterTight-Variable.woff2'],
            weight: '100 900',
            style: 'normal',
            display: 'swap',
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Instrument Serif',
      cssVariable: '--font-instrument-serif',
      fallbacks: ['Times New Roman', 'Georgia', 'serif'],
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/InstrumentSerif-Regular.woff2'],
            weight: 400,
            style: 'normal',
            display: 'swap',
          },
          {
            src: ['./src/assets/fonts/InstrumentSerif-Italic.woff2'],
            weight: 400,
            style: 'italic',
            display: 'swap',
          },
        ],
      },
    },
  ],
});
