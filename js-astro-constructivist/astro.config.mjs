import { readFileSync } from 'node:fs'
import process from 'node:process'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

const cv = JSON.parse(readFileSync(new URL('./cv.json', import.meta.url), 'utf8'))
const siteUrl = new URL(process.env.SITE_URL || cv.site?.url || 'https://example.com')
const base = process.env.BASE_PATH || cv.site?.base || '/'

if (!['http:', 'https:'].includes(siteUrl.protocol) || siteUrl.username || siteUrl.password || siteUrl.search || siteUrl.hash || siteUrl.pathname !== '/')
  throw new Error('site.url / SITE_URL must be an HTTP(S) origin; put the deployment pathname in site.base / BASE_PATH.')
if (!/^\/(?:[\w.-]+\/)*[\w.-]*\/?$/.test(base))
  throw new Error('site.base / BASE_PATH must be / or a slash-prefixed path such as /portfolio/.')

const configuredImages = [
  cv.basics?.image,
  cv.site?.seo?.image,
  ...(cv.projects ?? []).flatMap(project => [project.image?.url, project.image?.dark]),
  ...(cv.images?.list ?? []).map(image => image.image),
]
const remotePatterns = [
  ...new Set(configuredImages.filter(path => typeof path === 'string' && /^https?:\/\//i.test(path))),
]
  .map((path) => {
    const url = new URL(path)
    if (url.hostname.includes('*') || url.pathname.includes('*'))
      throw new Error('Configured remote image URLs must name a concrete host and pathname, not a wildcard.')
    return {
      protocol: url.protocol.slice(0, -1),
      hostname: url.hostname,
      port: url.port,
      pathname: url.pathname,
    }
  })

/** https://astro.build/config */
export default defineConfig({
  site: siteUrl.origin,
  base,
  output: 'static',
  devToolbar: { enabled: false },
  image: {
    remotePatterns,
  },
  integrations: [
    sitemap({
      filter: () => cv.site?.seo?.noIndex !== true,
    }),
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})
