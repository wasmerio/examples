import type { Post, Page } from '@/types/content';
export type { Post, Page } from '@/types/content';
import { config, t, termPath } from '@/lib/site';
import { marked } from 'marked';
export function contentPath(entry: {
  id: string;
  collection: string;
  data: { url?: string; slug?: string };
}): string {
  const path =
    entry.data.url ??
    (entry.collection === 'posts'
      ? `/p/${entry.data.slug ?? entry.id}/`
      : `/${entry.data.slug ?? entry.id}/`);
  if (
    !path.startsWith('/') ||
    path.startsWith('//') ||
    /[?#\\]/.test(path) ||
    path.split('/').includes('..')
  )
    throw new Error(`Invalid content URL: ${path}`);
  return path;
}
export function published<T extends { data: { draft?: boolean } }>(
  entries: T[],
  preview = false,
): T[] {
  return entries.filter((e) => preview || !e.data.draft);
}
export function homePosts(posts: Post[]): Post[] {
  return posts
    .filter((p) => p.data.home !== false)
    .sort(
      (a, b) =>
        Number(b.data.sticky) - Number(a.data.sticky) ||
        +b.data.date - +a.data.date ||
        a.id.localeCompare(b.id),
    );
}
export async function getPosts() {
  const { getCollection } = await import('astro:content');
  return published<Post>(
    await getCollection('posts'),
    import.meta.env.DEV,
  ).sort((a, b) => +b.data.date - +a.data.date || a.id.localeCompare(b.id));
}
export async function getPages() {
  const { getCollection } = await import('astro:content');
  return published<Page>(await getCollection('pages'), import.meta.env.DEV);
}
export function paginate<T>(items: T[], size: number) {
  if (size < 1 || !Number.isInteger(size)) throw new Error('Invalid page size');
  return Array.from(
    { length: Math.max(1, Math.ceil(items.length / size)) },
    (_, i) => items.slice(i * size, (i + 1) * size),
  );
}
export function taxonomy(
  posts: Post[],
  kind: 'tags' | 'categories' | 'series',
) {
  const groups = new Map<string, Post[]>();
  for (const p of posts)
    for (const name of new Set<string>(p.data[kind]))
      groups.set(name, [...(groups.get(name) ?? []), p]);
  return [...groups]
    .map(([name, posts]) => ({ name, posts, path: termPath(kind, name) }))
    .sort(
      (a, b) => b.posts.length - a.posts.length || a.name.localeCompare(b.name),
    );
}
export function assertUniquePaths(paths: string[]) {
  const used = new Set<string>();
  for (const path of paths) {
    const key = decodeURI(path)
      .replace(/\/$/, '')
      .replace(/\/index\.html$/, '')
      .normalize('NFC');
    if (used.has(key)) throw new Error(`Duplicate route: ${path}`);
    used.add(key);
  }
}
export const wordCount = (markdown: string, cjk = config.hasCJKLanguage) => {
  // Hugo's Plain includes the code render hook's language, copy and expand labels.
  const labels: string[] = [];
  marked.walkTokens(marked.lexer(markdown), (token) => {
    if (token.type === 'code') {
      labels.push(token.lang || 'text', t('codeExpand'));
      if (config.theme.highlight.copy !== false) labels.push(t('codeCopy'));
    }
  });
  const text = marked
    .parse(markdown, { async: false })
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/&(?:#\d+|#x[\da-f]+|\w+);/gi, 'x')
    .concat(' ', labels.join(' '))
    .trim();
  if (!text) return 0;
  return cjk
    ? (
        text.match(
          /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]|[^\s\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]+/gu,
        ) ?? []
      ).length
    : text.split(/\s+/u).length;
};
export const plainText = (text: string) =>
  text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/!?(\[([^\]]*)\])\([^)]*\)/g, '$2')
    .replace(/[#*_`{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
