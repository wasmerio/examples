import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

const wpOrigin = (() => {
  try {
    return process.env.WORDPRESS_API_URL
      ? new URL(process.env.WORDPRESS_API_URL).origin
      : 'http://localhost:8088';
  } catch {
    return 'http://localhost:8088';
  }
})();

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || 'https://demo.headless-journal.local',
  output: 'static',
  server: {
    host: '127.0.0.1',
    port: 4321,
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ['demo.headless-journal.local', 'localhost', '127.0.0.1'],
      proxy: {
        '/wp-content': {
          target: wpOrigin,
          changeOrigin: true,
        },
      },
    },
    preview: {
      allowedHosts: ['demo.headless-journal.local', 'localhost', '127.0.0.1'],
      proxy: {
        '/wp-content': {
          target: wpOrigin,
          changeOrigin: true,
        },
      },
    },
  },
  integrations: [sitemap()],
});

