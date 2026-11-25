import type { APIContext } from 'astro'
import { Feed } from 'feed'
import posts from '@/content/posts'
import { SITE_INFO } from '@/config'
import { markdown2html } from '@/utils/markdown'

export const GET = async (context: APIContext) => {
  const BASE_URL = context.site!.origin
  const feed = new Feed({
    id: BASE_URL,
    title: SITE_INFO.title,
    description: SITE_INFO.description,
    link: BASE_URL,
    language: SITE_INFO.language,
    favicon: BASE_URL + '/favicon.svg',
    copyright: `© ${SITE_INFO.startYear} - ${SITE_INFO.endYear} By ${SITE_INFO.author}.`,
    feedLinks: {
      rss: BASE_URL + '/rss.xml',
      atom: BASE_URL + '/atom.xml',
    },
    author: {
      name: SITE_INFO.author,
      email: SITE_INFO.email,
      link: BASE_URL,
    },
  })
  for (const post of posts) {
    feed.addItem({
      title: post.data.title,
      link: BASE_URL + `/posts/${post.id}/`,
      description: post.data.description,
      content: await markdown2html(post.body!,true) + post.data.bodyJoinHtml,
      date: post.data.publishDate!,
    })
  }
  return new Response(feed.atom1(), { headers: { 'Content-Type': 'application/xml' } })
}
