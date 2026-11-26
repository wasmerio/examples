import { getCollection, type CollectionEntry } from 'astro:content';
import { SITE } from '../consts.ts';

export type Post = CollectionEntry<'posts'>;

/** The permalink comes from the FILENAME, never the parsed date: local getters
    shift the day backwards west of UTC, so CI and a laptop would publish one
    post at two URLs. publishedPosts() checks the two agree. */
export function permalinkParts(id: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})-(.+)$/.exec(id);
  if (!m) throw new Error(`post id "${id}" is not YYYY-MM-DD-slug`);
  const [, year, month, day, slug] = m;
  return { year, month, day, slug };
}

export function permalink(id: string): string {
  const { year, month, day, slug } = permalinkParts(id);
  return `/blog/${year}/${month}/${day}/${slug}/`;
}

/** Published posts, newest first. Also asserts front matter matches the filename. */
export async function publishedPosts(): Promise<Post[]> {
  const posts = (await getCollection('posts')).filter((p) => !p.data.draft);
  for (const p of posts) {
    const { year, month, day } = permalinkParts(p.id);
    const iso = p.data.date.toISOString().slice(0, 10);
    if (iso !== `${year}-${month}-${day}`) {
      throw new Error(`${p.id}: front-matter date ${iso} disagrees with the filename`);
    }
  }
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export const formatPostDate = (d: Date) =>
  new Intl.DateTimeFormat(SITE.locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(d);

/** tag → posts, sorted by frequency then name. */
export function groupByTag(posts: Post[]) {
  const map = new Map<string, Post[]>();
  for (const p of posts) {
    for (const t of p.data.tags) {
      map.set(t, [...(map.get(t) ?? []), p]);
    }
  }
  return [...map.entries()].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
}

export const slugifyTag = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-');
