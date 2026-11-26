import type { APIRoute } from 'astro'
import { projects } from '../data/projects'

/** Home plus one page per project, lastmod stamped at build time. */
export const GET: APIRoute = ({ site }) => {
  const lastmod = new Date().toISOString().slice(0, 10)
  const paths = ['/', ...projects.map((project) => `/projects/${project.slug}/`)]
  const urls = paths
    .map(
      (path) => `  <url>
    <loc>${new URL(path, site).href}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`,
    )
    .join('\n')
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
