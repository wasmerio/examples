// Machine-readable corpus builders for /llms.txt and /llms-full.txt
// (llmstxt.org convention). The hub aggregates content from many repositories,
// so it ships a plain-text index (llms.txt) and a concatenated full-text
// corpus (llms-full.txt) that AI tools and agents can discover and ingest
// without scraping the site.
//
// v1 serves the default locale only - no /[locale]/llms.txt variants (v1
// decision: default locale only). The builders take a
// locale so per-locale variants are a small follow-up, but the routes call
// them with `defaultLocale` and every URL is a default-locale URL.
//
// URLs go through `withBase()` so the corpus stays correct under a sub-path
// deploy (e.g. base: '/<repo>/').

import { getCollection } from 'astro:content';
import { getLocalizedPosts } from './content';
import {
  collectionSuffix,
  home,
  siteName,
  withBase,
  type Locale,
} from './i18n';
import { hasDocDir } from './doc-dirs';
import { products } from '../../site.config';

interface DocEntry {
  id: string;
  body?: string;
  data: { title: string; description?: string; order?: number };
}

interface ProductInfoEntry {
  id: string;
  body?: string;
  data: { description: string };
}

function docsCollectionName(productSlug: string, locale: Locale): string {
  return `${productSlug}Docs${collectionSuffix(locale)}`;
}

function productInfoCollectionName(locale: Locale): string {
  return `productInfo${collectionSuffix(locale)}`;
}

/** Docs for one product + locale, in sidebar order (index first, then order, then title).
 *  Returns [] for a docs-less product (no directory => no collection registered;
 *  calling getCollection() on it would warn, so we skip via the same check). */
async function getProductDocs(productSlug: string, locale: Locale): Promise<DocEntry[]> {
  const product = products.find((p) => p.slug === productSlug);
  if (!product || !hasDocDir(product.slug, product.base, locale)) return [];
  const entries = (await getCollection(
    docsCollectionName(productSlug, locale) as any,
  )) as DocEntry[];
  return [...entries].sort((a, b) => {
    if (a.id === 'index') return -1;
    if (b.id === 'index') return 1;
    return (a.data.order ?? 0) - (b.data.order ?? 0) || a.data.title.localeCompare(b.data.title);
  });
}

/** Docs URL for a doc id; the `index` doc maps to the collection base. */
function docUrl(productSlug: string, id: string): string {
  return id === 'index'
    ? withBase(`/${productSlug}/docs/`)
    : withBase(`/${productSlug}/docs/${id}/`);
}

/** Published posts for a locale, newest first (same order as the blog listing). */
async function getPublishedPosts(
  locale: Locale,
): Promise<{ id: string; title: string; description: string; body?: string }[]> {
  const posts = await getLocalizedPosts(locale);
  return posts
    .sort((a, b) => b.entry.data.date.getTime() - a.entry.data.date.getTime())
    .map(({ entry }) => ({
      id: entry.id,
      title: entry.data.title,
      description: entry.data.description,
      body: entry.body,
    }));
}

/** /llms.txt - plain-text index of the hub's pages: site title + description,
 *  then sections (Posts, each product's Docs, Products) with
 *  `- [Label](url): one-line description`. */
export async function buildLlmsIndex(locale: Locale): Promise<string> {
  const out: string[] = [];
  out.push(`# ${siteName}`, '', `> ${home[locale].description}`, '');

  out.push('## Posts', '');
  for (const post of await getPublishedPosts(locale)) {
    out.push(`- [${post.title}](${withBase(`/posts/${post.id}/`)}): ${post.description}`);
  }
  out.push('');

  for (const product of products) {
    const docs = await getProductDocs(product.slug, locale);
    if (docs.length === 0) continue; // product without docs in this locale
    out.push(`## ${product.name} Docs`, '');
    for (const doc of docs) {
      const label = `- [${doc.data.title}](${docUrl(product.slug, doc.id)})`;
      out.push(doc.data.description ? `${label}: ${doc.data.description}` : label);
    }
    out.push('');
  }

  out.push('## Products', '');
  const infos = (await getCollection(productInfoCollectionName(locale) as any)) as ProductInfoEntry[];
  const infoBySlug = new Map(infos.map((p) => [p.id, p.data]));
  for (const product of products) {
    const desc = infoBySlug.get(product.slug)?.description;
    const label = `- [${product.name}](${withBase(`/${product.slug}/`)})`;
    out.push(desc ? `${label}: ${desc}` : label);
  }

  return out.join('\n').trimEnd() + '\n';
}

/** /llms-full.txt - the full-text corpus: every page's raw markdown body, one
 *  per page, separated by a `# <url>` heading. Corpus = posts + docs +
 *  product-info overviews (plan decision 2). Posts are the published set
 *  (drafts never render, so they stay out of the corpus). */
export async function buildLlmsFull(locale: Locale): Promise<string> {
  const pages: string[] = [];

  for (const post of await getPublishedPosts(locale)) {
    const body = post.body?.trim();
    if (!body) continue;
    pages.push(`# ${withBase(`/posts/${post.id}/`)}\n\n${body}`);
  }

  for (const product of products) {
    for (const doc of await getProductDocs(product.slug, locale)) {
      const body = doc.body?.trim();
      if (!body) continue;
      pages.push(`# ${docUrl(product.slug, doc.id)}\n\n${body}`);
    }
  }

  const infos = (await getCollection(productInfoCollectionName(locale) as any)) as ProductInfoEntry[];
  for (const info of infos) {
    const body = info.body?.trim();
    if (!body) continue;
    pages.push(`# ${withBase(`/${info.id}/`)}\n\n${body}`);
  }

  return pages.length ? pages.join('\n\n') + '\n' : '';
}
