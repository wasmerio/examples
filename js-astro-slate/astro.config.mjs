import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

import robotsTxt from "astro-robots-txt";

// https://astro.build/config
export default defineConfig({
  site: 'https://localhost',
  integrations: [tailwind(), sitemap(), robotsTxt({
    host: true
  })],
  markdown: {
    shikiConfig: {
      theme: 'one-dark-pro'
    }
  }
});
