import { getCollection, type CollectionEntry } from 'astro:content';
import lemma from '../lemma.config.mjs';
import type { CurveName } from './scripts/curves';
import type { Lang } from './scripts/dates';

// Site settings, from lemma.config.mjs.
export const SITE = {
  title: lemma.site.title,
  author: lemma.site.author,
  // Author as BibTeX expects it ("Last, First"), for the "cite this post" block.
  authorBibtex: lemma.site.authorBibtex,
  email: lemma.site.links.email,
  github: lemma.site.links.github,
  introCurve: lemma.site.intro.curve as CurveName | null,
};

// The link preview image (src/pages/og.png.ts), the size Open Graph cards use.
export const OG_IMAGE = { path: '/og.png', width: 1200, height: 630 };

export type { Lang };
export const LANGS: Lang[] = ['zh', 'en'];

export const ui = {
  zh: {
    description: lemma.site.description.zh,
    posts: '文章',
    about: '关于',
    noPosts: '还没有文章.',
    email: '邮箱',
    links: '链接',
    rss: 'RSS',
    readIn: 'Read in English',
    updated: '更新于',
    toggleTheme: '切换深色模式',
    // Site search (Search.astro). {n} is the number of results.
    search: '搜索',
    searchPlaceholder: '搜索文章',
    searchClose: '取消',
    searchResults: '搜索结果',
    searchHint: '搜索已发布的文章.',
    searchKeys: '↑ ↓ 选择, Enter 打开, Esc 关闭',
    searchLoading: '搜索中...',
    searchNone: '没有找到相关的文章.',
    searchCount: ['{n} 篇', '{n} 篇'],
    searchNoPosts: '还没有可以搜索的文章.',
    searchNoIndex: '搜索索引在 bun run build 后生成.',
    searchError: '搜索暂时不可用.',
    allPosts: '全部文章',
    toc: '目录',
    skipToContent: '跳到正文',
    abstract: '摘要',
    citeThis: '引用本文',
    copy: '复制',
    copied: '已复制',
    zoom: '全宽显示',
    notes: '注释',
    jump: '跳转',
    tags: '标签',
    keywords: '关键词',
    aiWritten: '本文由 AI 撰写.',
    taggedWith: (tag: string) => `标签: ${tag}`,
    allTags: '全部标签',
    allTagsCount: (n: number) => `全部 ${n} 个标签`,
    postCount: (n: number) => `${n} 篇`,
    readingTime: (n: number) => `约 ${n} 分钟`,
    sectionCount: (n: number) => `${n} 节`,
    // About page blocks. {n} is a count, {date} a date; the lists are the
    // forms for one and for more (and, for days, for none first).
    now: '近况',
    localTime: '当地时间',
    site: '主页',
    stars: ['{n} 颗星', '{n} 颗星'],
    activityTotal: ['过去一年在 GitHub 上有 {n} 次贡献', '过去一年在 GitHub 上有 {n} 次贡献'],
    activityAsOf: '截至 {date}',
    activityDay: ['{date} · 没有贡献', '{date} · 1 次贡献', '{date} · {n} 次贡献'],
    activityKeys: '方向键选择日期',
    less: '少',
    more: '多',
  },
  en: {
    description: lemma.site.description.en,
    posts: 'Posts',
    about: 'About',
    noPosts: 'No posts yet.',
    email: 'Email',
    links: 'Links',
    rss: 'RSS',
    readIn: '阅读中文版',
    updated: 'Updated',
    toggleTheme: 'Toggle dark mode',
    search: 'Search',
    searchPlaceholder: 'Search posts',
    searchClose: 'Cancel',
    searchResults: 'Search results',
    searchHint: 'Search the published posts.',
    searchKeys: '↑ ↓ to choose, Enter to open, Esc to close',
    searchLoading: 'Searching...',
    searchNone: 'No posts match.',
    searchCount: ['{n} post', '{n} posts'],
    searchNoPosts: 'No posts to search yet.',
    searchNoIndex: 'The search index is built by bun run build.',
    searchError: 'Search is not available right now.',
    allPosts: 'All posts',
    toc: 'Contents',
    skipToContent: 'Skip to content',
    abstract: 'Abstract',
    citeThis: 'Cite this post',
    copy: 'Copy',
    copied: 'Copied',
    zoom: 'Full width',
    notes: 'Notes',
    jump: 'Jump',
    tags: 'Tags',
    keywords: 'Keywords',
    aiWritten: 'This post was written by AI.',
    taggedWith: (tag: string) => `Tagged "${tag}"`,
    allTags: 'All tags',
    allTagsCount: (n: number) => `All ${n} tags`,
    postCount: (n: number) => `${n} ${n === 1 ? 'post' : 'posts'}`,
    readingTime: (n: number) => `${n} min read`,
    sectionCount: (n: number) => `${n} ${n === 1 ? 'section' : 'sections'}`,
    now: 'Now',
    localTime: 'local time',
    site: 'Site',
    stars: ['{n} star', '{n} stars'],
    activityTotal: ['{n} contribution on GitHub in the last year', '{n} contributions on GitHub in the last year'],
    activityAsOf: 'as of {date}',
    activityDay: ['No contributions on {date}', '1 contribution on {date}', '{n} contributions on {date}'],
    activityKeys: 'Arrow keys choose a day',
    less: 'Less',
    more: 'More',
  },
} as const;

export const otherLang = (lang: Lang): Lang => (lang === 'zh' ? 'en' : 'zh');

/** Locale prefix for URLs: '' for the default locale, '/en' for English. */
export const prefix = (lang: Lang) => (lang === 'zh' ? '' : `/${lang}`);

// Entry ids are "<slug>/<lang>" (from src/content/posts/<slug>/<lang>.md).
export const langOf = (post: CollectionEntry<'posts'>) => post.id.split('/').at(-1) as Lang;
export const slugOf = (post: CollectionEntry<'posts'>) => post.id.split('/').slice(0, -1).join('/');
export const postUrl = (post: CollectionEntry<'posts'>) => `${prefix(langOf(post))}/posts/${slugOf(post)}/`;

// The about page of a language exists when its file does (src/content/about/<lang>.md).
// getCollection, since getEntry warns about a missing entry.
export const aboutUrl = (lang: Lang) => `${prefix(lang)}/about/`;
export const hasAbout = async (lang: Lang) => (await getCollection('about')).some((e) => e.id === lang);

export async function getPosts(lang: Lang) {
  const posts = await getCollection('posts', (p) => langOf(p) === lang && (import.meta.env.DEV || !p.data.draft));
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

// Chinese dates keep a space between digits and characters: 2026 年 10 月 10 日.
export { formatDate } from './scripts/dates';

/**
 * URL segment for a tag: lowercase, spaces and URL-reserved characters to
 * hyphens ("Number Theory" -> "number-theory", "C#" -> "c").
 */
export const tagSlug = (tag: string) =>
  tag
    .trim()
    .toLowerCase()
    .replace(/[\s/#?%]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
export const tagUrl = (lang: Lang, tag: string) => `${prefix(lang)}/tags/${tagSlug(tag)}/`;
/** The tags page: all tags as an index. */
export const tagsUrl = (lang: Lang) => `${prefix(lang)}/tags/`;

/** Tags of one language with their posts, most used first. */
export async function getTags(lang: Lang) {
  const tags = new Map<string, { name: string; posts: CollectionEntry<'posts'>[] }>();
  for (const post of await getPosts(lang)) {
    for (const name of post.data.tags) {
      const slug = tagSlug(name);
      if (!tags.has(slug)) tags.set(slug, { name, posts: [] });
      tags.get(slug)!.posts.push(post);
    }
  }
  return [...tags.entries()]
    .map(([slug, t]) => ({ slug, ...t }))
    .sort((a, b) => b.posts.length - a.posts.length || a.name.localeCompare(b.name, lang));
}
