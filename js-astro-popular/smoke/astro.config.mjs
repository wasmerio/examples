// Minimal consumer of the packaged theme: the phase-1 integration test.
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import popular from 'astro-theme-popular';

export default defineConfig({
  site: 'https://example.com',
  integrations: [mdx(), popular()],
});
