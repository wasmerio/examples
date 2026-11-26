import { getCollection } from 'astro:content'
import type { CollectionEntry } from 'astro:content'

import { readingTime, stripMarkdown, withBase } from './index'

export type Post = CollectionEntry<'blog'>

/** Public URL of a post. Folder-based posts (`mailserver/index.md`) keep the
 *  folder name in the URL (`/blog/mailserver`). */
export function postUrl(postId: string): string {
  return withBase(`/blog/${postId.replace(/\/index$/, '')}`)
}

/** Estimate reading time from the post's raw markdown (CJK-aware).
 *  Note: Astro ≥5.18 no longer provides `remarkPluginFrontmatter.minutesRead`,
 *  so we compute it ourselves. */
export function getPostReadingTime(post: Post): number {
  return readingTime(stripMarkdown(post.body ?? ''))
}

/** All published posts (drafts excluded). */
export async function getBlogCollection(): Promise<Post[]> {
  return getCollection('blog', ({ data }) => !data.draft)
}

/** Newest first. */
export function sortMDByDate(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime())
}

/** `[tag, count]` pairs, most-used first. */
export function getUniqueTagsWithCount(posts: Post[]): [string, number][] {
  const counts = new Map<string, number>()
  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])
}

/** Group posts by year (descending). */
export function groupByYear(posts: Post[]): Map<number, Post[]> {
  const groups = new Map<number, Post[]>()
  for (const post of sortMDByDate(posts)) {
    const year = post.data.publishDate.getFullYear()
    groups.set(year, [...(groups.get(year) ?? []), post])
  }
  return groups
}
