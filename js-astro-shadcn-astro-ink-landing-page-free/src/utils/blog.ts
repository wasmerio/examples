// Utility functions for blog posts
import type { CollectionEntry } from 'astro:content'

/**
 * Calculate read time based on word count
 * Average reading speed: 200 words per minute
 */
export function calculateReadTime(text: string | undefined): number {
  if (!text) return 1
  const wordsPerMinute = 200
  const words = text.trim().split(/\s+/).length
  const readTime = Math.ceil(words / wordsPerMinute)

  return readTime
}

/**
 * Get related posts based on category
 */
export function getRelatedPosts(
  posts: CollectionEntry<'blog'>[],
  currentSlug: string,
  currentCategory: string,
  limit: number = 3
): CollectionEntry<'blog'>[] {
  // First try to get posts from same category
  const sameCategoryPosts = posts.filter(post => post.data.category === currentCategory && post.id !== currentSlug)

  // If we have enough posts from same category, use them
  if (sameCategoryPosts.length >= limit) {
    return sameCategoryPosts.slice(0, limit)
  }

  // If not enough posts from same category, fill with other posts
  const otherPosts = posts.filter(post => post.data.category !== currentCategory && post.id !== currentSlug)

  return [...sameCategoryPosts, ...otherPosts].slice(0, limit)
}

/**
 * Get navigation links for previous and next posts
 */
export function getPostNavigation(
  posts: CollectionEntry<'blog'>[],
  currentSlug: string
): { previous: CollectionEntry<'blog'> | null; next: CollectionEntry<'blog'> | null } {
  // Sort posts by pubDate (newest first)
  const sortedPosts = [...posts].sort((a, b) => a.data.id - b.data.id)
  const currentIndex = sortedPosts.findIndex(post => post.id === currentSlug)

  if (currentIndex === -1) {
    return { previous: null, next: null }
  }

  const previous = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null
  const next = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null

  return { previous, next }
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
