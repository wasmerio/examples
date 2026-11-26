import { Site } from './src/data/config'
import { defineConfig } from 'astro/config'

import sitemap from 'astro-sitemap'
import compress from 'astro-compress'
import compressor from 'astro-compressor'
import robotsTxt from 'astro-robots-txt'

// https://astro.build/config
export default defineConfig({
  integrations: [sitemap(), compress(), compressor(), robotsTxt()],
  site: Site.url
})
