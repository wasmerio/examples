import { getCollection, type CollectionEntry } from 'astro:content';
import { readingTime } from './format';

export type Post = CollectionEntry<'blog'>;

/** Published posts, newest first. Drafts only appear during `astro dev`. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function postMinutes(post: Post): number {
  return post.data.readingTime ?? readingTime(post.body);
}

/** Posts sharing the category or tags of `post`, falling back to the newest. */
export function relatedPosts(post: Post, all: Post[], limit = 3): Post[] {
  const others = all.filter((p) => p.id !== post.id);
  const score = (p: Post) =>
    (p.data.category === post.data.category ? 2 : 0) + p.data.tags.filter((t) => post.data.tags.includes(t)).length;
  return others
    .map((p) => ({ p, s: score(p) }))
    .sort((a, b) => b.s - a.s || b.p.data.pubDate.valueOf() - a.p.data.pubDate.valueOf())
    .slice(0, limit)
    .map(({ p }) => p);
}
