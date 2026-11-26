import { absoluteUrl } from '../lib/seo'
import { siteConfig } from '../../site.config.mjs'
import { sitemapOutputNames } from '../lib/sitemap-options.mjs'

export const prerender = true

export function GET() {
  const sitemap = siteConfig.plugins?.sitemap === false ? '' : `\nSitemap: ${absoluteUrl(`/${sitemapOutputNames(siteConfig).sitemap}`)}\n`
  return new Response(`User-agent: *\nAllow: /\n${sitemap}`, { headers: { 'content-type': 'text/plain; charset=utf-8' } })
}
