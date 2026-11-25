import type { APIContext } from 'astro'
import rss from '@astrojs/rss'
import posts from '@/content/posts'
import { SITE_INFO } from '@/config'
import { markdown2html } from '@/utils/markdown'

export const GET = async (context: APIContext) => {
  const resp = await rss({
    title: SITE_INFO.title,
    description: SITE_INFO.description,
    site: context.site!,
    items: await Promise.all(
      posts.map(async (post) => ({
        title: post.data.title,
        pubDate: post.data.publishDate,
        description: post.data.description,
        categories: post.data.categories,
        author: SITE_INFO.author,
        link: `/posts/${post.id}/`,
        content: await markdown2html(post.body!,true) + post.data.bodyJoinHtml,
      }))
    ),
  })
  return new Response(resp.body, { headers: {'Content-Type': 'application/xml'} })
}
