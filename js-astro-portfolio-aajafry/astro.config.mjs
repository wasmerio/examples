import node from '@astrojs/node';
// @ts-check
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: "https://aajafry.vercel.app",
  integrations: [react(), tailwind({
    applyBaseStyles: false,
  }), mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  devToolbar: { enabled: false },
  experimental: {
    svg: true,
  },
});