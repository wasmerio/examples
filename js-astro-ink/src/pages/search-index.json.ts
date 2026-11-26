import type { APIRoute } from 'astro'
import { stripMarkdown } from '@/utils'
import { extractSearchContent } from '@/utils/search-content'
import { getBlogCollection } from '@/utils/server'

/**
 * Prerendered JSON index used by the client-side search page.
 * Text and real heading IDs are extracted at build time.
 */
export const GET: APIRoute = async () => {
  const posts = await getBlogCollection()

  const index = posts.map((post) => ({
    slug: post.id.replace(/\/index$/, ''),
    title: post.data.title,
    description: post.data.description,
    tags: post.data.tags,
    date: post.data.publishDate.toISOString(),
    ...(post.rendered
      ? extractSearchContent(post.rendered.html)
      : { content: stripMarkdown(post.body ?? ''), sections: [] })
  }))

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  })
}
