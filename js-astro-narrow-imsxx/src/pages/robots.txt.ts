import type { APIRoute } from "astro"

export const GET: APIRoute = ({ site }) => {
  const root = site ?? new URL("https://example.com")
  const sitemap = new URL("sitemap-index.xml", root)

  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap.href}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
