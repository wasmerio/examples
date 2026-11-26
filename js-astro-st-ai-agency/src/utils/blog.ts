import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

/** Published posts, newest first. Drafts are visible during `npm run dev` only. */
export async function getPosts(): Promise<BlogPost[]> {
  const posts = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Reading time in minutes: uses the frontmatter override, otherwise ~220 words per minute. */
export function readingTime(post: BlogPost): number {
  if (post.data.readingTime) return post.data.readingTime;
  const words = (post.body ?? '').replace(/[#>*_`\-\[\]()!]/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function formatDate(date: Date, style: 'long' | 'short' = 'long'): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: style === 'long' ? 'long' : 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/** Posts that share the category or at least one tag, falling back to the latest posts. */
export function relatedPosts(post: BlogPost, all: BlogPost[], limit = 3): BlogPost[] {
  const others = all.filter((p) => p.id !== post.id);
  const score = (p: BlogPost) =>
    (p.data.category === post.data.category ? 2 : 0) +
    p.data.tags.filter((t) => post.data.tags.includes(t)).length;
  return [...others].sort((a, b) => score(b) - score(a) || b.data.pubDate.valueOf() - a.data.pubDate.valueOf()).slice(0, limit);
}
