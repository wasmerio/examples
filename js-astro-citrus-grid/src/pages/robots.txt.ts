import type { APIRoute } from 'astro'

export const GET: APIRoute = ({ site }) => {
  // site 可能配置为带路径的形式（如 https://x.com/blog）：不带尾斜杠时
  // 相对解析会丢掉 blog 段，得到 https://x.com/sitemap-index.xml
  const base = site?.href.endsWith('/') ? site : new URL(`${site?.href}/`)
  const sitemapURL = new URL('sitemap-index.xml', base)
  const body = ['User-agent: *', 'Allow: /', '', `Sitemap: ${sitemapURL.href}`, ''].join('\n')
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
