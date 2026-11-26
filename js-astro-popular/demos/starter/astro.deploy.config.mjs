import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import popular from 'astro-theme-popular';

/* The published starter: identical to astro.config.mjs except that it reads
   popular.deploy.config.ts, which adds a notice linking to the demo gallery.
   Used only by scripts/build-sites.mjs. `npm run dev`/`build` here still use
   astro.config.mjs, so what you develop against is the plain starter. */
export default defineConfig({
  site: 'https://example.com',
  integrations: [mdx(), popular({ configFile: './popular.deploy.config.ts' })],
});
