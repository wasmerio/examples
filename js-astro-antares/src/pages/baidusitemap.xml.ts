import type { APIContext } from 'astro'
import { create } from 'xmlbuilder2'
import posts from '@/content/posts'

export const GET = async (context: APIContext) => {
  const BASE_URL = context.site!.origin
  const sitemap = create({ version: '1.0', encoding: 'UTF-8' }).ele('urlset', {
    'xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
    'xmlns:mobile': 'http://www.baidu.com/schemas/sitemap-mobile/1/',
  })
  posts.forEach((post) => {
    const element = sitemap.ele('url')
    element.ele('loc').txt(BASE_URL + '/posts/' + post.id)
    element.ele('lastmod').txt(post.data.publishDateISOString)
  })
  const xml = sitemap.end({ prettyPrint: true })
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } })
}
