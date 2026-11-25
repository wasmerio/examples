// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  // The site property should be your final deployed URL
  site: process.env.SITE || 'https://jdrhyne.github.io',
  // Only use base path for GitHub Pages deployments
  // For Netlify/Vercel, leave this undefined (no base path)
  base: process.env.BASE_PATH || undefined,
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
