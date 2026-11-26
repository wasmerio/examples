// Renamed-sections smoke variant: post bylines resolve from the organizers
// collection (SECTIONS_MAP.authors override), proving item 3's mapping.
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import popular from 'astro-theme-popular';
export default defineConfig({
  site: 'https://example.com',
  outDir: './dist-sections',
  integrations: [mdx(), popular({ configFile: './popular.sections.config.ts' })],
});
