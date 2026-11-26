// Override-map smoke variant: replaces the theme Header with a custom one.
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import popular from 'astro-theme-popular';
export default defineConfig({
  site: 'https://example.com',
  outDir: './dist-overrides',
  integrations: [mdx(), popular({ overrides: { Header: './src/overrides/Header.astro' } })],
});
