import { getCollection, getEntry, render, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n';
import { createHash } from 'node:crypto';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import remarkExcerpt from '../plugins/remark-excerpt.mjs';
export type Article = CollectionEntry<'posts'> | CollectionEntry<'seriesPosts'>;
let previewProcessor: ReturnType<typeof createMarkdownProcessor> | undefined;
export async function articlePreviewParagraphs(post: Article): Promise<string[]> {
  if (post.collection === 'posts') return [post.data.description];
  const { remarkPluginFrontmatter } = await render(post);
  if (Array.isArray(remarkPluginFrontmatter.bodyExcerptParagraphs)) {
    return remarkPluginFrontmatter.bodyExcerptParagraphs;
  }
  // Older content caches lack paragraph boundaries; recover them from the source.
  previewProcessor ??= createMarkdownProcessor({ syntaxHighlight: false, remarkPlugins: [remarkExcerpt] });
  const { metadata } = await (await previewProcessor).render(post.body ?? '');
  return metadata.frontmatter.bodyExcerptParagraphs as string[];
}
export async function articleSummary(post: Article): Promise<string> {
  if (post.collection === 'posts') return post.data.description;
  return (await render(post)).remarkPluginFrontmatter.bodyExcerpt as string;
}
export const byDate = (a: Article, b: Article) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf() || a.id.localeCompare(b.id);
export async function articles(lang: Lang, collection: 'posts' | 'seriesPosts' = 'posts') {
  return (await getCollection(collection, entry => entry.id.startsWith(`${lang}/`) && !entry.data.draft)).sort(byDate);
}
export function articleSlug(post: Article) { return post.id.split('/').slice(2).join('/'); }
export function articleUrl(post: Article) {
  const lang = post.id.split('/')[0];
  return `/${lang}/${post.collection === 'posts' ? 'posts' : 'series'}/${articleSlug(post)}/`;
}
// Both language versions share the same language-independent discussion key.
export const discussionKey = (post: Article) => `/${post.collection === 'posts' ? 'posts' : 'series'}/${articleSlug(post)}/`;
export const formatDate = (date: Date) => date.toISOString().slice(0, 10);
export const pageContent = (lang: Lang, page: string) => getEntry('pages', `${lang}/pages/${page}`);
export const columnId = (post: Article) => post.id.split('/')[2];
const transitionKey = (id: string, part: string) => `content-${createHash('sha256').update(id).digest('hex').slice(0, 12)}-${part}`;
export const articleTransition = (post: Article, part: 'title' | 'image') => transitionKey(`${post.collection}/${post.id}`, part);
export const columnTransition = (lang: Lang, id: string, part: 'title' | 'image') => transitionKey(`column/${lang}/${id}`, part);
export interface Column { id: string; title: string; description: string; image: string; }
// Call with the column's published posts, already sorted newest first by articles().
export const columnCover = (column: Column, posts: readonly Article[]) => posts[0]?.data.image?.url || column.image;
const definitions = import.meta.glob<{ default: Column }>('../content/*/series/*/index.ts', { eager: true });
export function columns(lang: Lang): Column[] {
 return Object.entries(definitions).filter(([path]) => path.includes(`/content/${lang}/`)).map(([, module]) => module.default);
}
