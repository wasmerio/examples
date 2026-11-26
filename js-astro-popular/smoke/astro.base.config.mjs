// Subpath smoke variant: the site is served from /sub, as it would be on a
// GitHub project page (user.github.io/repo/). Every internal link and image
// the theme writes must carry the prefix; the workflow greps the output for
// any that do not.
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import popular from 'astro-theme-popular';
export default defineConfig({
  site: 'https://example.com',
  base: '/sub',
  outDir: './dist-base',
  integrations: [mdx(), popular({ configFile: './popular.base.config.ts' })],
});
