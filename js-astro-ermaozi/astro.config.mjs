import vue from '@astrojs/vue'
import { defineConfig } from 'astro/config'
import { replaceAssetsIntegration } from './theme/lib/replace-assets.mjs'
import { autoFrontmatterIntegration } from './theme/lib/auto-frontmatter.mjs'
import { optionalOutputsIntegration } from './theme/lib/optional-outputs.mjs'
import { siteConfig } from './site.config.mjs'

export default defineConfig({
  srcDir: './theme/',
  site: process.env.SITE_ORIGIN || siteConfig.origin,
  base: process.env.BASE_PATH || siteConfig.base || '/',
  output: 'static',
  trailingSlash: 'always',
  markdown: { syntaxHighlight: false },
  integrations: [vue(), autoFrontmatterIntegration(siteConfig), replaceAssetsIntegration(siteConfig.replaceAssets), optionalOutputsIntegration(siteConfig)],
  vite: {
    build: {
      chunkSizeWarningLimit: 1200,
      rolldownOptions: {
        onLog(level, log, handler) {
          if (log.code !== 'COMMONJS_VARIABLE_IN_ESM' || !log.id?.includes('/dashjs/')) handler(level, log)
        },
      },
    },
  },
})
