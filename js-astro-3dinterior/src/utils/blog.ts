// src/utils/blog.ts
import type { CollectionEntry } from 'astro:content';

/**
 * Calculate reading time for blog posts
 * @param content - Raw content string (post.body)
 * @returns Estimated reading time in minutes
 */
export function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content?.split(/\s+/).length || 0;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * Format a date for display
 * @param date - Date object
 * @param format - Optional format: 'short' | 'long' | 'relative'
 * @returns Formatted date string
 */
export function formatDate(
  date: Date,
  format: 'short' | 'long' | 'relative' = 'short'
): string {
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };

  if (format === 'long') {
    options.month = 'long';
    options.day = 'numeric';
    options.year = 'numeric';
  }

  if (format === 'relative') {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  }

  return date.toLocaleDateString('en-US', options);
}

/**
 * Get related posts based on tags
 * @param currentPost - Current blog post
 * @param allPosts - All blog posts
 * @param limit - Maximum number of related posts
 * @returns Array of related posts
 */
export function getRelatedPosts(
  currentPost: CollectionEntry<'blog'>,
  allPosts: CollectionEntry<'blog'>[],
  limit: number = 3
): CollectionEntry<'blog'>[] {
  const currentTags = currentPost.data.tags || [];
  
  // Score each post based on tag overlap
  const scored = allPosts
    .filter(post => post.id !== currentPost.id)
    .map(post => {
      const postTags = post.data.tags || [];
      const overlap = postTags.filter(tag => currentTags.includes(tag)).length;
      return { post, score: overlap };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);

  // If no tag overlap, fall back to most recent
  if (scored.length === 0) {
    return allPosts
      .filter(post => post.id !== currentPost.id)
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .slice(0, limit);
  }

  return scored
    .slice(0, limit)
    .map(item => item.post);
}

/**
 * Truncate text to a specific length
 * @param text - Text to truncate
 * @param maxLength - Maximum characters
 * @returns Truncated text with ellipsis
 */
export function truncateText(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '…';
}

/**
 * Extract first image from content
 * @param content - Raw content string
 * @returns URL of first image or null
 */
export function extractFirstImage(content: string): string | null {
  const imageRegex = /!\[.*?\]\((.*?)\)/;
  const match = content.match(imageRegex);
  return match ? match[1] : null;
}

/**
 * Get category from first tag or fallback
 * @param tags - Array of tags
 * @param fallback - Fallback category
 * @returns Category string
 */
export function getCategory(tags: string[] = [], fallback: string = 'Architecture'): string {
  return tags.length > 0 ? tags[0] : fallback;
}