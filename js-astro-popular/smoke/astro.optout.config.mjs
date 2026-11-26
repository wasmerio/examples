// Second smoke variant: route opt-outs. Proves popular({ routes }) skips
// injection (speakers/venues/rss absent from this build).
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import popular from 'astro-theme-popular';

export default defineConfig({
  site: 'https://example.com',
  outDir: './dist-optout',
  integrations: [mdx(), popular({ routes: { speakers: false, venues: false, rss: false, organizers: false } })],
});
