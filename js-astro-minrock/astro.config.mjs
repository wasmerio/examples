import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { rehypeCallouts } from './src/plugins/rehype-callouts.mjs';

// Honor SITE_URL from the shell, the host (e.g. Vercel), or a local .env file.
// Vite has not loaded .env yet at this point, so read it explicitly.
const env = { ...loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), ''), ...process.env };
if (env.SITE_URL) {
  process.env.SITE_URL = env.SITE_URL;
}

export default defineConfig({
  site: env.SITE_URL || 'https://minrock.vercel.app',
  integrations: [sitemap()],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover'
  },
  markdown: {
    processor: satteri({
      hastPlugins: [rehypeCallouts()],
    }),
    shikiConfig: {
      theme: 'github-dark-dimmed',
      wrap: true
    }
  },
  vite: {
    server: {
      watch: {
        ignored: ['**/.obsidian/**', '**/_bases/**', '**/bases/**', '**/_home/**', '**/home/**', '**/_base/**', '**/base/**']
      }
    },
    assetsInclude: ['**/*.base', '**/.obsidian/**', '**/_bases/**']
  }
});
