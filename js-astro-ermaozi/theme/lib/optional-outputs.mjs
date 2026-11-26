import { mkdir, rename, rm } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { sitemapOutputNames } from './sitemap-options.mjs'

/** @param {{ plugins?: { sitemap?: unknown } }} config @returns {import('astro').AstroIntegration} */
export function optionalOutputsIntegration(config) {
  return {
    name: 'ermaozi:optional-outputs',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const output = fileURLToPath(dir)
        if (config.plugins?.sitemap === false) {
          await Promise.all(['sitemap.xml', 'sitemap.xsl'].map(file => rm(join(output, file), { force: true })))
          return
        }
        const names = sitemapOutputNames(config)
        await Promise.all([['sitemap.xml', names.sitemap], ['sitemap.xsl', names.xsl]].map(async ([source, target]) => {
          if (source === target) return
          await mkdir(dirname(join(output, target)), { recursive: true })
          await rename(join(output, source), join(output, target))
        }))
      },
    },
  }
}
