import type { APIRoute } from 'astro'
import { cv } from '@/data/cv'

export const prerender = true

export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/')
  const sitemap = new URL(`${base}sitemap-index.xml`, site ?? cv.site.url).href
  const lines = cv.site.seo.noIndex
    ? ['User-agent: *', 'Disallow: /']
    : [
        'User-agent: *',
        'Allow: /',
        '',
        `Sitemap: ${sitemap}`,
      ]

  return new Response(`${lines.join('\n')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
