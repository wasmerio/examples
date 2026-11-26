import type { APIRoute } from 'astro'

export const GET: APIRoute = ({ site }) => {
  const body = `User-agent: *
Allow: /
Disallow: /_astro/

Sitemap: ${new URL('/sitemap.xml', site).href}
`
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
