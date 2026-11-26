
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'astro/config'
import AutoImport from 'astro-auto-import'
import sitemap from '@astrojs/sitemap'
import mdx from '@astrojs/mdx'

import { IMPORTS, SITE } from './src/consts'

const dir = dirname(fileURLToPath(import.meta.url))

// https://astro.build/config
export default defineConfig({
  base: SITE.BASE,
  site: SITE.URL,
  integrations: [
    AutoImport({ imports: IMPORTS }),
    sitemap(),
    mdx(),
  ],
  markdown: {
    gfm: true,
    shikiConfig: {
      // https://shiki.style/themes
      theme: 'dracula',
      defaultColor: false,
    }
  },
  vite: {
    resolve: {
      alias: {
        '@src': resolve(dir, './src'),
      },
    },
  },
  experimental: {
    contentIntellisense: true,
    contentLayer: true,
  },
})
