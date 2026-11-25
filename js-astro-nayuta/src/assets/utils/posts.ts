import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * Determines if a post should be visible given the current environment.
 * Draft posts (`draft: true`) are omitted in production builds (`import.meta.env.PROD` / `MODE === 'production'`),
 * but remain accessible during development (`import.meta.env.DEV`) for preview.
 */
export function isVisiblePost(post: CollectionEntry<'posts'>): boolean {
  const isProduction =
    import.meta.env.PROD || import.meta.env.MODE === 'production';
  return isProduction ? !post.data.draft : true;
}

/**
 * Retrieves all posts, filtering out draft posts in production builds.
 */
export async function getPosts(): Promise<CollectionEntry<'posts'>[]> {
  return getCollection('posts', isVisiblePost);
}

/** Sort before pagination, with stable content IDs breaking date ties. */
export function sortPosts(posts: readonly CollectionEntry<'posts'>[]) {
  return [...posts].sort(
    (a, b) =>
      new Date(b.data.publishDate).getTime() -
        new Date(a.data.publishDate).getTime() || a.id.localeCompare(b.id),
  );
}
