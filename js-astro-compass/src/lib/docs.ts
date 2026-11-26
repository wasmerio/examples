import { docsCategories, docsParentCategories } from '../config/docs';
import { siteConfig } from '../config/site';

export type DocsParentSlug = (typeof docsParentCategories)[number]['slug'];
export type DocsCategorySlug = (typeof docsCategories)[number]['slug'];
export type DocsCategory = (typeof docsCategories)[number];
export type DocsParent = (typeof docsParentCategories)[number];

export const docsCategorySlugs = docsCategories.map((category) => category.slug) as [
  DocsCategorySlug,
  ...DocsCategorySlug[],
];

export const docsParentMap = Object.fromEntries(
  docsParentCategories.map((category) => [category.slug, category]),
) as Record<DocsParentSlug, DocsParent>;

export const docsCategoryMap = Object.fromEntries(
  docsCategories.map((category) => [category.slug, category.name]),
) as Record<DocsCategorySlug, string>;

export const docsCategoryDataMap = Object.fromEntries(
  docsCategories.map((category) => [category.slug, category]),
) as Record<DocsCategorySlug, DocsCategory>;

function getParentForCategory(categorySlug: string) {
  return docsCategories.find((category) => category.slug === categorySlug)?.parent;
}

export function getCategoriesForParent(parentSlug: string) {
  return docsCategories.filter((category) => category.parent === parentSlug);
}

export function getCategoryHref(categorySlug: string) {
  const parentSlug = getParentForCategory(categorySlug);
  return parentSlug ? `/${parentSlug}/${categorySlug}` : `/${categorySlug}`;
}

function getArticleHref(categorySlug: string, articleSlug: string) {
  return `${getCategoryHref(categorySlug)}/${articleSlug}`;
}

export function getCleanDocSlug(docId: string) {
  return docId.split('/').at(-1) ?? docId;
}

type DocSource = {
  id: string;
  filePath?: string;
  body?: string;
  data: {
    title: string;
    description?: string;
    category: string;
    order?: number;
    hideFromSearch?: boolean;
    status?: string;
    updatedAt?: Date;
    editUrl?: string;
  };
};

export type SearchSuggestion = {
  title: string;
  excerpt: string;
  url: string;
  category: string;
};

const SEARCH_PREVIEW_MAX_CHARS = 160;

export function isPublicDoc<T extends { data: { status?: string } }>(doc: T) {
  return doc.data.status !== 'draft' && doc.data.status !== 'archived';
}

export function getPublicDocs<T extends { data: { status?: string } }>(docs: T[]) {
  return docs.filter(isPublicDoc);
}

export function getDocHref(doc: DocSource) {
  return getArticleHref(doc.data.category, getCleanDocSlug(doc.id));
}

export function getCategoryName(categorySlug: string) {
  return docsCategoryMap[categorySlug as DocsCategorySlug] ?? categorySlug;
}

const clampText = (value: string, maxChars = SEARCH_PREVIEW_MAX_CHARS) => {
  if (value.length <= maxChars) return value;

  const truncated = value.slice(0, maxChars);
  const lastSpaceIndex = truncated.lastIndexOf(' ');

  return `${(lastSpaceIndex > 60 ? truncated.slice(0, lastSpaceIndex) : truncated).trimEnd()}...`;
};

export function getDocSearchPreview(doc: DocSource, maxChars = SEARCH_PREVIEW_MAX_CHARS) {
  return clampText(doc.data.description?.trim() ?? '', maxChars);
}

export function getSearchPreviewLookup(docs: DocSource[]) {
  return Object.fromEntries(getPublicDocs(docs).map((doc) => [getDocHref(doc), getDocSearchPreview(doc)])) as Record<
    string,
    string
  >;
}

export function getSuggestedSearchArticles(
  docs: DocSource[],
  { limit = 4, categories = ['start-here'] }: { limit?: number; categories?: readonly string[] } = {},
): SearchSuggestion[] {
  const allowedCategories = new Set(categories);

  return docs
    .filter(isPublicDoc)
    .filter((doc) => !doc.data.hideFromSearch)
    .filter((doc) => allowedCategories.has(doc.data.category))
    .sort((a, b) => {
      const categoryIndexDifference = categories.indexOf(a.data.category) - categories.indexOf(b.data.category);
      if (categoryIndexDifference !== 0) return categoryIndexDifference;
      return (a.data.order ?? 100) - (b.data.order ?? 100);
    })
    .slice(0, limit)
    .map((doc) => ({
      title: doc.data.title,
      excerpt: getDocSearchPreview(doc),
      url: getDocHref(doc),
      category: getCategoryName(doc.data.category),
    }));
}

export function getOrderedDocsForCategory<T extends DocSource>(docs: T[], category: string) {
  return docs
    .filter(isPublicDoc)
    .filter((doc) => doc.data.category === category)
    .sort((a, b) => (a.data.order ?? 100) - (b.data.order ?? 100));
}

export function getRecentDocs<T extends DocSource>(docs: T[], limit = 5) {
  return docs
    .filter(isPublicDoc)
    .filter((doc) => doc.data.updatedAt && !doc.data.hideFromSearch)
    .sort((a, b) => b.data.updatedAt!.getTime() - a.data.updatedAt!.getTime())
    .slice(0, limit);
}

export type SidebarGroup = {
  name: string;
  slug: string;
  href: string;
  icon: string;
  articles: { title: string; href: string; slug: string }[];
};

export function getSidebarGroups(docs: DocSource[], parentSlug: string): SidebarGroup[] {
  return getCategoriesForParent(parentSlug).map((category) => ({
    name: category.name,
    slug: category.slug,
    href: getCategoryHref(category.slug),
    icon: category.icon,
    articles: getOrderedDocsForCategory(docs, category.slug).map((doc) => ({
      title: doc.data.title,
      href: getDocHref(doc),
      slug: getCleanDocSlug(doc.id),
    })),
  }));
}

export function getEditUrl(doc: DocSource) {
  if (doc.data.editUrl) return doc.data.editUrl;
  if (!siteConfig.editBaseUrl || !doc.filePath) return undefined;
  return new URL(doc.filePath.replace(/^\.?\//, ''), siteConfig.editBaseUrl).toString();
}

export function getReadingTime(body = '') {
  const words = body
    .replace(/^---[\s\S]*?---/, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.round(words / 220));
}

export function formatDate(date: Date) {
  return date.toLocaleDateString(siteConfig.dateLocale, { month: 'long', day: 'numeric', year: 'numeric' });
}
