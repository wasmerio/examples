export interface Category {
  id: number;
  slug: string;
  name: string;
  description: string;
  count?: number;
}

export interface Author {
  id: number;
  name: string;
  role: string;
  avatar: string;
  bio?: string;
  twitter?: string;
  github?: string;
}

export interface AcfHeroImage {
  url: string;
  alt: string;
  width: number;
  height: number;
}

export interface AcfRelatedResource {
  id: number;
  title: string;
  slug: string;
}

export interface Article {
  id: number;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  featuredImageAlt?: string;
  category: Category;
  author: Author;
  publishedAt: string;
  readingTime: number;
  featured: boolean;
  tags?: string[];
  heroImageMeta?: AcfHeroImage;
  relatedResources?: AcfRelatedResource[];
  proEndpointRoute?: string;
}

export interface PaginationResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
  prevUrl?: string;
  nextUrl?: string;
}

export interface ContentAdapter {
  getArticles(params?: {
    categorySlug?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginationResult<Article>>;
  getAllArticles(): Promise<Article[]>;
  getArticleBySlug(slug: string): Promise<Article | null>;
  getFeaturedArticle(): Promise<Article | null>;
  getLatestArticles(limit?: number, excludeSlug?: string): Promise<Article[]>;
  getRelatedArticles(currentSlug: string, categorySlug: string, limit?: number): Promise<Article[]>;
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | null>;
}

