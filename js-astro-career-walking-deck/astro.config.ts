import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'

// https://astro.build/config
export default defineConfig({
  // For GitHub Pages: if your repo is named `username.github.io`, use `/`
  // Otherwise, use `/<repository-name>/`
  // This can be overridden by the BASE_URL environment variable during build
  base: process.env.BASE_URL || '/',
  site: process.env.PUBLIC_SITE_URL || 'http://localhost:4321',
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  vite: {
    build: {
      // Disable sourcemaps in production to prevent source code exposure
      sourcemap: false,
    },
  },
})
