import { getCollection, render, type CollectionEntry } from 'astro:content'

export async function getAllPosts(): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCollection('blog')

  return posts.sort((a, b) => new Date(b.data.pubDate).valueOf() - new Date(a.data.pubDate).valueOf())
}

export async function getAdjacentPosts(currentSlug: string): Promise<{
  newer: CollectionEntry<'blog'> | null
  older: CollectionEntry<'blog'> | null
}> {
  const allPosts = await getAllPosts()
  const currentIndex = allPosts.findIndex(post => post.data.slug === currentSlug)

  if (currentIndex === -1) {
    return { newer: null, older: null }
  }

  return {
    newer: currentIndex > 0 ? allPosts[currentIndex - 1] : null,
    older: currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null
  }
}

export async function getTOCHeadings(postSlug: string): Promise<{ slug: string; text: string; depth: number }[]> {
  const posts = await getCollection('blog')
  const post = posts.find(p => p.data.slug === postSlug)

  if (!post) return []

  const { headings } = await render(post)

  return headings.map(heading => ({
    slug: heading.slug,
    text: heading.text,
    depth: heading.depth
  }))
}

export function calculateReadTime(text: string | undefined): number {
  if (!text) return 1
  const wordsPerMinute = 200
  const words = text.trim().split(/\s+/).length
  const readTime = Math.ceil(words / wordsPerMinute)

  return readTime
}
