import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import rehypeExternalLinks from 'rehype-external-links';
import { unified } from '@astrojs/markdown-remark';

// https://astro.build/config
export default defineConfig({
  // Update this with your production URL (can be overridden via ASTRO_SITE env var)
  site: process.env.ASTRO_SITE ?? 'https://example.com',

  // Set base path when deploying to a subdirectory (e.g. GitHub Pages project site)
  // Can be overridden via ASTRO_BASE env var; always normalized to end with '/'
  base: process.env.ASTRO_BASE
    ? (process.env.ASTRO_BASE.endsWith('/') ? process.env.ASTRO_BASE : process.env.ASTRO_BASE + '/')
    : '/',

  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()]
  },

  build: {
    assets: 'assets'
  },

  markdown: {
    // Open external links in a new tab; internal links stay in the same tab.
    // Plugins need the unified processor from @astrojs/markdown-remark on Astro 7.
    processor: unified({
      rehypePlugins: [
        [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }]
      ]
    }),
    syntaxHighlight: 'shiki',
    shikiConfig: {
      // Dual themes follow the site's dark mode (see global.css)
      themes: {
        light: 'github-light',
        dark: 'github-dark'
      }
    }
  }
});
