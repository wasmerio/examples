// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://example.com',
  build: { inlineStylesheets: 'always' },
  markdown: { shikiConfig: { themes: { light: 'github-light-high-contrast', dark: 'github-dark-high-contrast' } } },
  vite: { plugins: [tailwindcss()] },
});
