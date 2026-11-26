// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

const site = process.env.SITE_URL ?? process.env.URL ?? 'https://fallback-url.example.com';

export default defineConfig({
  site,
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()]
  }
});
