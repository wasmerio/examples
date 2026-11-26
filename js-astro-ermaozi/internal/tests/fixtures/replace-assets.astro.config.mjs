import { defineConfig } from 'astro/config'
import { fileURLToPath } from 'node:url'
import { replaceAssetsIntegration } from '../../../theme/lib/replace-assets.mjs'

export default defineConfig({
  srcDir: fileURLToPath(new URL('./replace-assets-site/src/', import.meta.url)),
  outDir: fileURLToPath(new URL('../../.tmp/replace-assets-dist/', import.meta.url)),
  integrations: [replaceAssetsIntegration('https://cdn.example.com')],
})
