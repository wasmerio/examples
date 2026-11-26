// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Update this to your production domain before deploying.
  // It is used for canonical URLs, Open Graph tags, and the sitemap.
  site: 'https://ridgeline-lite-demo.vercel.app',
  output: 'static',
  trailingSlash: 'always',
  build: {
    // Inline all CSS: removes the render-blocking stylesheet request,
    // which matters for LCP on a mostly-static marketing site.
    inlineStylesheets: 'always',
  },
  integrations: [
    mdx(),
    sitemap({
      // Keep noindex pages out of the sitemap.
      filter: (page) => !page.includes('/thank-you/'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
