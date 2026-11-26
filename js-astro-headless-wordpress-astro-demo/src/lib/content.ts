import type { Article, Category, ContentAdapter, PaginationResult } from './types';
import { MockContentAdapter } from './adapters/mock';
import { FreeContentAdapter } from './adapters/free';
import { ProContentAdapter } from './adapters/pro';

export type ContentMode = 'demo' | 'free' | 'pro';

export function getContentMode(): ContentMode {
  // Support both Astro import.meta.env and Node process.env
  const mode = (
    import.meta.env.CONTENT_MODE ||
    (typeof process !== 'undefined' ? process.env.CONTENT_MODE : undefined) ||
    'demo'
  ).toLowerCase() as ContentMode;

  return mode;
}

function resolveAdapter(): ContentAdapter {
  const mode = getContentMode();

  switch (mode) {
    case 'demo':
      return new MockContentAdapter();

    case 'free':
      return new FreeContentAdapter();

    case 'pro':
      return new ProContentAdapter();

    default:
      throw new Error(
        `[The Headless Journal] Unknown CONTENT_MODE='${mode}'. ` +
        `Supported modes are 'demo', 'free', and 'pro'.`
      );
  }
}

// Singleton adapter instance for SSG builds
const adapter: ContentAdapter = resolveAdapter();

export async function getArticles(params?: {
  categorySlug?: string;
  page?: number;
  pageSize?: number;
}): Promise<PaginationResult<Article>> {
  return adapter.getArticles(params);
}

export async function getAllArticles(): Promise<Article[]> {
  return adapter.getAllArticles();
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return adapter.getArticleBySlug(slug);
}

export async function getFeaturedArticle(): Promise<Article | null> {
  return adapter.getFeaturedArticle();
}

export async function getLatestArticles(limit = 6, excludeSlug?: string): Promise<Article[]> {
  return adapter.getLatestArticles(limit, excludeSlug);
}

export async function getRelatedArticles(
  currentSlug: string,
  categorySlug: string,
  limit = 3
): Promise<Article[]> {
  return adapter.getRelatedArticles(currentSlug, categorySlug, limit);
}

export async function getCategories(): Promise<Category[]> {
  return adapter.getCategories();
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return adapter.getCategoryBySlug(slug);
}

