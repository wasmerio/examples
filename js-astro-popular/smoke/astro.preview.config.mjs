// Preview-mode smoke variant, see popular.preview.config.ts.
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import popular from 'astro-theme-popular';
export default defineConfig({
  site: 'https://example.com',
  outDir: './dist-preview',
  integrations: [mdx(), popular({ configFile: './popular.preview.config.ts' })],
});
