import { getCollection, type CollectionEntry } from 'astro:content';
import { siteHref } from './paths';
import { tagToSlug } from './slug';

export type Post = CollectionEntry<'posts'>;

export function postSlug(post: Post): string {
  return post.id.replace(/\.mdx?$/, '');
}

/** Published blog articles only (excludes draft/hidden). */
export async function getBlogPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) => !data.draft && !data.hidden);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** @deprecated Use getBlogPosts */
export const getPublishedPosts = getBlogPosts;

/**
 * Estimate reading time from raw Markdown body.
 * CJK characters each count as one "word"; Latin text is split on whitespace.
 * Code blocks and inline code are stripped before counting.
 * Returns minutes (min 1).
 */
export function readingTime(body: string, locale: string): number {
  let text = body
    .replace(/^---[\s\S]*?---/m, '')  // frontmatter
    .replace(/```[\s\S]*?```/g, '')   // fenced code blocks
    .replace(/`[^`]*`/g, '')          // inline code
    .replace(/<[^>]*>/g, '')          // HTML tags
    .replace(/!\[.*?\]\(.*?\)/g, '')  // images
    .replace(/\[([^\]]*)\]\(.*?\)/g, '$1'); // links (keep text)

  const cjkRe = /[一-鿿㐀-䶿぀-ゟ゠-ヿ가-힯]/g;
  const cjkChars = (text.match(cjkRe) || []).length;
  const latinText = text.replace(cjkRe, '');
  const latinWords = latinText.split(/[\s\n\r]+/).filter((w) => /\w/.test(w)).length;

  const totalWords = cjkChars + latinWords;
  const wpm = locale === 'zh-CN' ? 300 : 250;
  return Math.max(1, Math.ceil(totalWords / wpm));
}

export function formatDate(date: Date, locale: string): string {
  return date.toLocaleDateString(locale === 'zh-CN' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** Short date for archive list (MM-DD). */
export function formatArchiveDate(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${m}-${d}`;
}

export function postUrl(post: Post): string {
  return siteHref(`/posts/${postSlug(post)}/`);
}

export function tagUrl(tag: string): string {
  return siteHref(`/tags/${tagToSlug(tag)}/`);
}

export function getAllTags(posts: Post[]): string[] {
  const tags = new Set<string>();
  for (const post of posts) {
    for (const tag of post.data.tags) tags.add(tag);
  }
  return [...tags].sort((a, b) => a.localeCompare(b));
}

export function groupPostsByYear(posts: Post[]): Map<number, Post[]> {
  const map = new Map<number, Post[]>();
  for (const post of posts) {
    const year = post.data.date.getFullYear();
    const list = map.get(year) ?? [];
    list.push(post);
    map.set(year, list);
  }
  return new Map([...map.entries()].sort((a, b) => b[0] - a[0]));
}

export function getAdjacentPosts(
  posts: Post[],
  current: Post,
): { prev: Post | null; next: Post | null } {
  const idx = posts.findIndex((p) => p.id === current.id);
  return {
    prev: idx > 0 ? posts[idx - 1]! : null,
    next: idx >= 0 && idx < posts.length - 1 ? posts[idx + 1]! : null,
  };
}
