import { existsSync } from 'node:fs'
import sitemap from '@astrojs/sitemap'
import type { AstroIntegration } from 'astro'

/** Astro's static aliases are HTML pages. Omit their emitted paths from the sitemap. */
export default function postSitemap(base: string): AstroIntegration[] {
  const aliases = new Set<string>()
  let publicDir: URL
  let directoryFormat: boolean
  const collect: AstroIntegration = {
    name: 'post-alias-sitemap',
    hooks: {
      'astro:config:done': ({ config }) => {
        publicDir = config.publicDir
        directoryFormat = config.build.format === 'directory'
      },
      'astro:build:done': ({ dir, assets }) => {
        for (const file of assets.get('/[...alias]') ?? []) {
          const outputPath = file.href.slice(dir.href.length)
          // Astro skips a generated page when a public file already occupies its URL.
          if (existsSync(new URL(outputPath, publicDir))) {
            throw new Error(`Post alias conflicts with public file: ${decodeURI(outputPath)}`)
          }
          const relative = outputPath.replace(directoryFormat ? /\/index\.html$/ : /\.html$/, '')
          aliases.add(`${base.replace(/\/$/, '')}/${relative}`)
        }
      }
    }
  }
  return [
    collect,
    sitemap({ filter: (url) => !aliases.has(new URL(url).pathname.replace(/\/$/, '')) })
  ]
}
