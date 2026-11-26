import { defineConfig } from 'astro/config'
import { site } from './src/data/site'

// Static output only: no adapter, no SSR, no client-side JavaScript.
// Deploy `dist/` to any static host.
export default defineConfig({
  // SITE_URL lets a host override the origin per environment (demo, preview)
  // without editing src/data/site.ts.
  site: process.env.SITE_URL ?? site.url,
  build: {
    // Keep CSS in external files so the CSP can stay at `style-src 'self'`.
    inlineStylesheets: 'never',
  },
  vite: {
    build: {
      // Never inline small assets as data: URIs; `font-src 'self'` would block them.
      assetsInlineLimit: 0,
    },
  },
})
