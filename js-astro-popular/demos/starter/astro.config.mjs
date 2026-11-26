import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import popular from 'astro-theme-popular';

/* Starter: an Astro demo site, and one of the package's integration tests.
   `base` is passed on the command line by scripts/build-sites.mjs, which
   deploys each demo at its own subpath. */
export default defineConfig({
  site: 'https://example.com',
  integrations: [mdx(), popular()],
});
