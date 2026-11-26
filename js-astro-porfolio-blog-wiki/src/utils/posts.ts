import type { CollectionEntry } from 'astro:content';
import { isPublished } from './date';

export interface PostFilter {
  maxPosts?: number;
  tags?: string[];
  excludeTags?: string[];
}

export function sortPostsByDate(posts: CollectionEntry<'blog'>[]): CollectionEntry<'blog'>[] {
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function filterPublishedPosts(posts: CollectionEntry<'blog'>[]): CollectionEntry<'blog'>[] {
  return posts.filter(post => !post.data.draft && isPublished(post.data.date));
}

export function filterPosts(posts: CollectionEntry<'blog'>[], filter: PostFilter = {}): CollectionEntry<'blog'>[] {
  let filteredPosts = filterPublishedPosts(posts);

  // Filter by tags
  if (filter.tags?.length) {
    filteredPosts = filteredPosts.filter(post => 
      filter.tags!.some(tag => post.data.tags?.includes(tag))
    );
  }

  // Filter by excluded tags
  if (filter.excludeTags?.length) {
    filteredPosts = filteredPosts.filter(post => 
      !filter.excludeTags!.some(tag => post.data.tags?.includes(tag))
    );
  }

  // Sort posts by date
  filteredPosts = sortPostsByDate(filteredPosts);

  // Limit number of posts if maxPosts is specified
  if (filter.maxPosts) {
    filteredPosts = filteredPosts.slice(0, filter.maxPosts);
  }

  return filteredPosts;
}

export function getPostsByTag(posts: CollectionEntry<'blog'>[], tag: string): CollectionEntry<'blog'>[] {
  return posts.filter(post => 
    post.data.tags?.includes(tag) &&
    !post.data.draft &&
    isPublished(post.data.date)
  );
}

export function getAllTags(posts: CollectionEntry<'blog'>[]): string[] {
  const publishedPosts = filterPublishedPosts(posts);
  return [...new Set(publishedPosts.flatMap(post => post.data.tags || []))].sort();
}

export function getRelatedPosts(
  posts: CollectionEntry<'blog'>[],
  currentPost: CollectionEntry<'blog'>,
  maxPosts = 2,
): CollectionEntry<'blog'>[] {
  const currentTags = currentPost.data.tags || [];

  return filterPublishedPosts(posts)
    .filter(post => post.id !== currentPost.id)
    .map(post => ({
      post,
      sharedTags: (post.data.tags || []).filter((tag: string) => currentTags.includes(tag)).length,
    }))
    .sort((a, b) => b.sharedTags - a.sharedTags || b.post.data.date.valueOf() - a.post.data.date.valueOf())
    .slice(0, maxPosts)
    .map(({ post }) => post);
}

export function getRandomPosts(
  posts: CollectionEntry<'blog'>[],
  currentPost: CollectionEntry<'blog'>,
  excludedPosts: CollectionEntry<'blog'>[] = [],
  maxPosts = 3,
): CollectionEntry<'blog'>[] {
  const excludedSlugs = new Set([currentPost.id, ...excludedPosts.map(post => post.id)]);
  const candidates = filterPublishedPosts(posts).filter(post => !excludedSlugs.has(post.id));

  // Rotate deterministically so builds remain reproducible while each post gets a varied selection.
  const offset = [...currentPost.id].reduce((total, character) => total + character.charCodeAt(0), 0) % Math.max(candidates.length, 1);
  return [...candidates.slice(offset), ...candidates.slice(0, offset)].slice(0, maxPosts);
}
