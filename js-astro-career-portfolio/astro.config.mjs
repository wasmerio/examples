// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';

import homeData from './src/data/home.json';


const siteUrl = process.env.SITE_URL || homeData.siteUrl || undefined;

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [icon(), sitemap()]
});
