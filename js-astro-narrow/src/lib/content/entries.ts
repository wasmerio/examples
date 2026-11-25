import { getCollection, type CollectionEntry } from 'astro:content';
import {
  getLocaleFromId,
  getLocalePath,
  localeMeta,
  stripLocaleFromId,
  type Locale
} from '../../config/i18n';

export type ContentType = 'posts' | 'projects' | 'pages';

type Post = CollectionEntry<'posts'>;

export function entryLocale(entry: CollectionEntry<ContentType>) {
  return entry.data.lang || getLocaleFromId(entry.id);
}

export function entrySlug(entry: CollectionEntry<ContentType>) {
  return stripLocaleFromId(entry.id).replace(/\/index$/, '');
}

export function entryDate(entry: CollectionEntry<ContentType>) {
  const data = entry.data as { date?: Date; updatedDate?: Date };
  return data.date || data.updatedDate || new Date(0);
}

export function isPublished(entry: CollectionEntry<ContentType>) {
  return !entry.data.draft;
}

export async function getLocalizedEntries<T extends ContentType>(collection: T, locale: Locale) {
  const entries = await getCollection(collection, ({ data }) => !data.draft);
  return entries
    .filter((entry) => entryLocale(entry as CollectionEntry<ContentType>) === locale)
    .sort(
      (a, b) =>
        entryDate(b as CollectionEntry<ContentType>).getTime() -
        entryDate(a as CollectionEntry<ContentType>).getTime()
    );
}

export function localizedEntryPath(
  collection: 'posts' | 'pages',
  entry: CollectionEntry<'posts'> | CollectionEntry<'pages'>
) {
  const slug = entrySlug(entry);
  const locale = entryLocale(entry);
  const base = collection === 'pages' ? '' : `/${collection}`;
  const path = `${base}/${slug}/`.replace(/\/+/g, '/');
  return getLocalePath(locale, path);
}

export function formatDate(date: Date | undefined, locale: Locale) {
  if (!date) return '';
  return new Intl.DateTimeFormat(localeMeta[locale].dateLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

/** 生成指向当前语言 Archives 标签筛选状态的链接。 */
export function tagFilterPath(locale: Locale, tag: string) {
  const query = new URLSearchParams({ tag });
  return `${getLocalePath(locale, '/archives/')}?${query.toString()}`;
}

export type ArchiveTerm = {
  value: string;
  count: number;
};

/** 收集当前 locale 已发布 posts 的标签词条,按出现次数排序。 */
export function collectTagTerms(posts: Post[], locale: Locale): ArchiveTerm[] {
  const counts = new Map<string, number>();

  for (const post of posts) {
    const terms = new Set((post.data.tags || []).map((term) => term.trim()).filter(Boolean));
    for (const term of terms) counts.set(term, (counts.get(term) || 0) + 1);
  }

  const collator = new Intl.Collator(locale === 'zh-cn' ? 'zh-CN' : locale);
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || collator.compare(a.value, b.value));
}

export function adjacentEntries(entries: Post[], current: Post): { previous?: Post; next?: Post } {
  const index = entries.findIndex((entry) => entry.id === current.id);
  return {
    previous: index >= 0 ? entries[index + 1] : undefined,
    next: index > 0 ? entries[index - 1] : undefined
  };
}

export function relatedPosts(posts: Post[], current: Post, limit = 3) {
  const currentTerms = new Set(current.data.tags || []);

  return posts
    .filter((entry) => entry.id !== current.id)
    .map((entry) => {
      const score = (entry.data.tags || []).filter((term) => currentTerms.has(term)).length;

      return { entry, score };
    })
    .filter((item) => item.score > 0)
    .sort(
      (a, b) => b.score - a.score || entryDate(b.entry).getTime() - entryDate(a.entry).getTime()
    )
    .slice(0, limit)
    .map((item) => item.entry);
}

/* ---------------------------------------------------------------------------
 * Subposts
 *
 * A subpost group is a folder inside the posts collection whose `index.md` is
 * the parent post; every sibling Markdown file is a subpost:
 *
 *   posts/en/astro-guide/index.md   → /posts/astro-guide/
 *   posts/en/astro-guide/setup.md   → /posts/astro-guide/setup/
 *
 * Folders that only contain `index.md` (plus assets) stay ordinary posts.
 * ------------------------------------------------------------------------- */

export type SubpostGroup = {
  parent: Post;
  /** Ordered subposts (order → date → id), excluding the parent. */
  subposts: Post[];
  /** Reading sequence: parent first, then subposts. */
  sequence: Post[];
};

export type SubpostContext = SubpostGroup & {
  /** 0 for the parent, 1..N for subposts. */
  position: number;
  previous?: Post;
  next?: Post;
};

function parentIdOf(entry: Post) {
  const segments = entry.id.split('/');
  if (segments.length < 2) return undefined;
  return segments.slice(0, -1).join('/');
}

/** The parent of a group is the folder's index file. */
function isIndexFile(entry: Post) {
  return /\/index\.(md|mdx)$/.test(entry.filePath ?? '');
}

/**
 * Index entries keyed by both id schemes: the glob loader strips a trailing
 * `/index` from ids, but older ids may keep it — register both.
 */
function collectParents(posts: Post[]) {
  const parents = new Map<string, Post>();
  for (const entry of posts) {
    if (!isIndexFile(entry)) continue;
    parents.set(entry.id, entry);
    parents.set(entry.id.replace(/\/index$/, ''), entry);
  }
  return parents;
}

function findParent(entry: Post, parents: Map<string, Post>) {
  const parentId = parentIdOf(entry);
  if (!parentId) return undefined;
  const parent = parents.get(parentId);
  if (!parent || parent.id === entry.id) return undefined;
  return parent;
}

function subpostOrder(a: Post, b: Post) {
  const orderA = a.data.order ?? Number.POSITIVE_INFINITY;
  const orderB = b.data.order ?? Number.POSITIVE_INFINITY;
  return (
    orderA - orderB || entryDate(a).getTime() - entryDate(b).getTime() || a.id.localeCompare(b.id)
  );
}

/** 依据文件夹结构把 posts 分组为父子文章。 */
export function collectSubpostGroups(posts: Post[]): SubpostGroup[] {
  const parents = collectParents(posts);
  const grouped = new Map<string, Post[]>();

  for (const entry of posts) {
    const parent = findParent(entry, parents);
    if (!parent) continue;
    const group = grouped.get(parent.id) || [];
    group.push(entry);
    grouped.set(parent.id, group);
  }

  return [...grouped.entries()].map(([parentId, subposts]) => {
    const parent = parents.get(parentId)!;
    const ordered = [...subposts].sort(subpostOrder);
    return { parent, subposts: ordered, sequence: [parent, ...ordered] };
  });
}

export function isSubpost(entry: Post, posts: Post[]) {
  return Boolean(findParent(entry, collectParents(posts)));
}

/** 列表与首页使用:排除 subpost,只保留父文与独立文章。 */
export function excludeSubposts(posts: Post[]) {
  const parents = collectParents(posts);
  return posts.filter((entry) => !findParent(entry, parents));
}

export function getSubpostContext(entry: Post, posts: Post[]): SubpostContext | undefined {
  for (const group of collectSubpostGroups(posts)) {
    const position = group.sequence.findIndex((candidate) => candidate.id === entry.id);
    if (position < 0) continue;
    return {
      ...group,
      position,
      previous: position > 0 ? group.sequence[position - 1] : undefined,
      next: group.sequence[position + 1]
    };
  }
  return undefined;
}

/* ---------------------------------------------------------------------------
 * Pagination
 * ------------------------------------------------------------------------- */

export type PostListPage = {
  entries: Post[];
  current: number;
  total: number;
};

export function paginateEntries(posts: Post[], pageSize: number): Post[][] {
  if (posts.length === 0) return [[]];
  const pages: Post[][] = [];
  for (let index = 0; index < posts.length; index += pageSize) {
    pages.push(posts.slice(index, index + pageSize));
  }
  return pages;
}

export function postListPagePath(locale: Locale, page: number) {
  return page <= 1
    ? getLocalePath(locale, '/posts/')
    : getLocalePath(locale, `/posts/page/${page}/`);
}
