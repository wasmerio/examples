import { getCollection, type CollectionEntry } from 'astro:content';
import { slugize } from './slug';
import { yearOf, monthOf } from './date';
import { resolveUpdated } from './git-dates';
import { site } from '@/config';
import { plainExcerpt } from './excerpt-text.mjs';
import { url } from './url';

type Entry = CollectionEntry<'posts'>;
export type Post = Entry & { data: Entry['data'] & { updated: Date } };

let cache: Post[] | undefined;
/** lower-cased tag slug -> canonical spelling (first seen, newest post first) */
const tagAlias = new Map<string, string>();

/** All published posts, newest first (Hexo `-date`). */
export async function getPosts(): Promise<Post[]> {
  if (cache) return cache;
  const all = await getCollection('posts', ({ data }) => import.meta.env.DEV || !data.draft);
  // Resolved here, not in the schema: Astro caches parsed entries by file
  // content, so a git-derived value there would go stale after a commit.
  cache = all
    .map((p) => ({ ...p, data: { ...p.data, updated: resolveUpdated(p.filePath, p.data.updated, p.data.date) } }))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  const seen = new Map<string, string>();
  for (const p of cache) {
    const prev = seen.get(p.data.abbrlink);
    if (prev) throw new Error(`Duplicate abbrlink ${p.data.abbrlink}: ${prev} and ${p.id}`);
    seen.set(p.data.abbrlink, p.id);
    for (const t of p.data.tags) {
      const k = slugize(t).toLowerCase();
      if (!tagAlias.has(k)) tagAlias.set(k, slugize(t));
    }
  }
  return cache;
}

export const postUrl = (p: Post) => url(`/posts/${p.data.abbrlink}/`);
export const tagUrl = (name: string) => url(`/tags/${tagAlias.get(slugize(name).toLowerCase()) ?? slugize(name)}/`);
export const categoryUrl = (path: string[]) => url(`/categories/${path.map(slugize).join('/')}/`);
export const coverOf = (p: Post) => p.data.cover || site.defaultCover;
export const topImgOf = (p: Post) => p.data.top_img || p.data.cover || site.topImg;

export type Term = { name: string; slug: string; url: string; posts: Post[] };

export async function getTags(): Promise<Term[]> {
  const map = new Map<string, Term>();
  for (const p of await getPosts()) {
    for (const name of p.data.tags) {
      // case-insensitive: "python" and "Python" are one tag (and one URL on case-insensitive hosts)
      const key = slugize(name).toLowerCase();
      const t = map.get(key) ?? { name, slug: slugize(name), url: tagUrl(name), posts: [] };
      if (!t.posts.includes(p)) t.posts.push(p);
      map.set(key, t);
    }
  }
  return [...map.values()];
}

/** Categories are hierarchical paths (`[Parent, Child]`); every prefix is a category. */
export async function getCategories(): Promise<(Term & { path: string[] })[]> {
  const map = new Map<string, Term & { path: string[] }>();
  for (const p of await getPosts()) {
    const cats = p.data.categories;
    for (let i = 1; i <= cats.length; i++) {
      const path = cats.slice(0, i);
      const key = path.map(slugize).join('/');
      const c = map.get(key.toLowerCase()) ?? { name: path[path.length - 1], path, slug: key, url: categoryUrl(path), posts: [] };
      c.posts.push(p);
      map.set(key.toLowerCase(), c);
    }
  }
  return [...map.values()];
}

export type ArchiveGroup = { year: string; months: { month: string; posts: Post[] }[]; count: number };

export function groupByYear(posts: Post[]) {
  const years = new Map<string, Post[]>();
  for (const p of posts) {
    const y = yearOf(p.data.date);
    years.set(y, [...(years.get(y) ?? []), p]);
  }
  return [...years.entries()].map(([year, list]) => ({ year, posts: list }));
}

export function groupByMonth(posts: Post[]) {
  const months = new Map<string, Post[]>();
  for (const p of posts) {
    const key = `${yearOf(p.data.date)}/${monthOf(p.data.date)}`;
    months.set(key, [...(months.get(key) ?? []), p]);
  }
  return [...months.entries()].map(([key, list]) => {
    const [year, month] = key.split('/');
    return { year, month, posts: list };
  });
}

/** Newer / older neighbours (Hexo post.prev / post.next). */
export async function getNeighbours(post: Post) {
  const posts = await getPosts();
  const i = posts.findIndex((p) => p.id === post.id);
  return { newer: posts[i - 1], older: posts[i + 1] };
}

/** Butterfly related posts: weight = number of shared tags, ties broken by date. */
export async function getRelated(post: Post, limit = 6) {
  const tags = new Set(post.data.tags.map(slugize));
  if (!tags.size) return [];
  return (await getPosts())
    .filter((p) => p.id !== post.id)
    .map((p) => ({ p, w: p.data.tags.filter((t) => tags.has(slugize(t))).length }))
    .filter((x) => x.w > 0)
    .sort((a, b) => b.w - a.w || b.p.data.date.getTime() - a.p.data.date.getTime())
    .slice(0, limit)
    .map((x) => x.p);
}

/** Split a list into pages; returns `[{ page, posts, total }]` (1-based). */
export function paginate<T>(items: T[], size: number) {
  const total = Math.max(1, Math.ceil(items.length / size));
  return Array.from({ length: total }, (_, i) => ({ page: i + 1, total, items: items.slice(i * size, (i + 1) * size) }));
}

/** `/base/` for page 1, `/base/page/N/` otherwise (Hexo pagination_dir). */
export const pageUrl = (base: string, n: number) => (n <= 1 ? base : `${base}page/${n}/`);

/** Plain-text excerpt for cards & meta description. */
export function excerpt(p: Post, length = 150) {
  return p.data.description || plainExcerpt(p.body ?? '', length);
}
