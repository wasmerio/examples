import type { MarkdownHeading } from 'astro';
import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
import { getCollection, render, type CollectionEntry } from 'astro:content';
import { pageSchema } from '~/content.config';
import type { PageEntry } from '@type/template';

interface AstroPageModule {
  default: AstroComponentFactory;
  page?: unknown;
}

const astroPages = import.meta.glob<AstroPageModule>(
  [
    '/src/content/index.astro',
    '/src/content/pages/**/*.astro',
    '!/src/content/pages/**/_*.astro',
    '!/src/content/pages/**/_*/**',
    '!/src/content/pages/**/assets/**',
  ],
  { eager: true },
);

export type ContentPage = { slug: string; isHome: boolean } & (
  | { kind: 'markdown'; entry: CollectionEntry<'pages'> }
  | { kind: 'astro'; entry: PageEntry; modulePath: string }
);

function routeFor(entry: PageEntry) {
  const file = entry.filePath!;
  const isHome = /^src\/content\/index\.(md|mdx|astro)$/.test(file);
  const path = file
    .replace(/^src\/content\/pages\//, '')
    .replace(/\.(md|mdx|astro)$/, '')
    .replace(/(^|\/)index$/, '');
  const slug = isHome ? '' : (entry.data.slug ?? path);
  if (
    slug.startsWith('/') ||
    /[?#\\]/.test(slug) ||
    slug.split('/').some((part) => part === '.' || part === '..')
  ) {
    throw new Error(
      `Invalid page slug ${JSON.stringify(slug)} in ${file}. Use a relative URL path.`,
    );
  }
  return { slug: slug.replace(/\/$/, ''), isHome };
}

/** Shared by the homepage dispatcher and the standalone content route. */
export async function getContentPages(): Promise<ContentPage[]> {
  const pages: ContentPage[] = (await getCollection('pages')).map((entry) => ({
    kind: 'markdown',
    entry,
    ...routeFor(entry),
  }));
  for (const [modulePath, module] of Object.entries(astroPages)) {
    const parsed = pageSchema.safeParse(module.page);
    if (!parsed.success) {
      throw new Error(
        `Invalid exported page metadata in ${modulePath}: ${parsed.error.message}`,
      );
    }
    const entry: PageEntry = {
      id: modulePath.replace('/src/content/', ''),
      filePath: modulePath.slice(1),
      data: parsed.data,
    };
    pages.push({ kind: 'astro', entry, modulePath, ...routeFor(entry) });
  }
  const seen = new Map<string, string>();
  for (const page of pages) {
    // The homepage dispatcher wins over pages/index.* as a system route.
    const key = `${page.isHome ? 'home' : 'page'}:${decodeURI(new URL(`/${page.slug}`, 'https://content.invalid').pathname).replace(/\/$/, '')}`;
    const previous = seen.get(key);
    if (previous) {
      throw new Error(
        `Duplicate content URL /${page.slug}: ${previous} and ${page.entry.filePath}. Keep one page per URL.`,
      );
    }
    seen.set(key, page.entry.filePath!);
  }
  return pages;
}

export async function renderContentPage(page: ContentPage) {
  if (page.kind === 'markdown') return render(page.entry);
  return {
    Content: astroPages[page.modulePath].default,
    headings: [] as MarkdownHeading[],
  };
}
