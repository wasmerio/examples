import type { Article, Category, ContentAdapter, PaginationResult } from '../types';
import rawPosts from '../../data/posts.json';
import rawCategories from '../../data/categories.json';

const typedCategories = rawCategories as Category[];
const typedPosts = rawPosts as unknown as Article[];

export class MockContentAdapter implements ContentAdapter {
  private posts: Article[];
  private categories: Category[];

  constructor() {
    // Sort posts newest first
    this.posts = [...typedPosts].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    // Compute dynamic post counts for categories
    this.categories = typedCategories.map((cat) => {
      const count = this.posts.filter((p) => p.category.slug === cat.slug).length;
      return { ...cat, count };
    });
  }

  async getAllArticles(): Promise<Article[]> {
    return this.posts;
  }

  async getArticles(params?: {
    categorySlug?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginationResult<Article>> {
    const page = Math.max(1, params?.page || 1);
    const pageSize = Math.max(1, params?.pageSize || 6);
    const categorySlug = params?.categorySlug;

    let filtered = this.posts;
    if (categorySlug) {
      filtered = filtered.filter((p) => p.category.slug === categorySlug);
    }

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    const hasPrev = page > 1;
    const hasNext = page < totalPages;

    const basePath = categorySlug ? `/category/${categorySlug}` : '/blog';
    const prevUrl = hasPrev ? (page === 2 ? basePath : `${basePath}/page/${page - 1}`) : undefined;
    const nextUrl = hasNext ? `${basePath}/page/${page + 1}` : undefined;

    return {
      items,
      total,
      page,
      pageSize,
      totalPages,
      hasPrev,
      hasNext,
      prevUrl,
      nextUrl,
    };
  }

  async getArticleBySlug(slug: string): Promise<Article | null> {
    const article = this.posts.find((p) => p.slug === slug);
    return article ?? null;
  }

  async getFeaturedArticle(): Promise<Article | null> {
    const featured = this.posts.find((p) => p.featured);
    return featured ?? this.posts[0] ?? null;
  }

  async getLatestArticles(limit = 6, excludeSlug?: string): Promise<Article[]> {
    let list = this.posts;
    if (excludeSlug) {
      list = list.filter((p) => p.slug !== excludeSlug);
    }
    return list.slice(0, limit);
  }

  async getRelatedArticles(
    currentSlug: string,
    categorySlug: string,
    limit = 3
  ): Promise<Article[]> {
    const candidates = this.posts.filter(
      (p) => p.slug !== currentSlug && p.category.slug === categorySlug
    );

    if (candidates.length >= limit) {
      return candidates.slice(0, limit);
    }

    // Fall back to other recent articles to fill remaining slots
    const others = this.posts.filter(
      (p) => p.slug !== currentSlug && p.category.slug !== categorySlug
    );
    return [...candidates, ...others].slice(0, limit);
  }

  async getCategories(): Promise<Category[]> {
    return this.categories;
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const cat = this.categories.find((c) => c.slug === slug);
    return cat ?? null;
  }
}

