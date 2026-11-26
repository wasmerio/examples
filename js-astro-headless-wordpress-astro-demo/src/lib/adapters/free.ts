import type { Article, Author, Category, ContentAdapter, PaginationResult } from '../types';

/**
 * Raw post item shape returned by `/wp-json/rkx-api-studio/v1/posts`
 * and `/wp-json/rkx-api-studio/v1/featured`.
 */
export interface RkxFreePostResponse {
  id: number;
  slug: string;
  title?: string;
  excerpt?: string | null;
  content?: string | null;
  date?: string;
  featured_image_url?: string | null;
  author?: {
    id: number;
    name: string;
    slug: string;
    avatar_url?: string;
  } | null;
  category?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  post_tag?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  subtitle?: string | null;
  reading_time?: string | number | null;
  featured_image_alt?: string | null;
  author_role?: string | null;
  author_bio?: string | null;
  author_avatar?: string | null;
}

/**
 * Raw category term shape returned by `/wp-json/rkx-api-studio/v1/categories`.
 */
export interface RkxFreeCategoryResponse {
  id: number;
  slug: string;
  name: string;
  description?: string;
  count?: number;
  parent?: number;
}

const NAMESPACE_PATH = '/wp-json/rkx-api-studio/v1';

const FALLBACK_ARTICLE_IMAGES: Record<string, string> = {
  'building-modern-headless-wordpress-websites': '/images/articles/headless-architecture.svg',
  'why-astro-is-excellent-for-content-driven-websites': '/images/articles/astro-islands.svg',
  'understanding-the-wordpress-rest-api': '/images/articles/wp-rest-api.svg',
  'designing-clean-api-responses-for-frontend-applications': '/images/articles/api-contracts.svg',
  'static-site-generation-vs-server-side-rendering': '/images/articles/ssg-vs-ssr.svg',
  'using-custom-fields-in-headless-wordpress': '/images/articles/custom-fields.svg',
  'improving-api-performance-with-caching': '/images/articles/api-caching.svg',
  'building-maintainable-content-apis': '/images/articles/maintainable-apis.svg',
};

const FALLBACK_AUTHOR_PROFILES: Record<
  string,
  { role: string; avatar: string; bio: string }
> = {
  'marcus-vance': {
    role: 'Principal Frontend Architect',
    avatar: '/images/authors/marcus.svg',
    bio: 'Marcus leads frontend architecture initiatives with a focus on Astro, edge computing, and performant content delivery.',
  },
  'elena-rostova': {
    role: 'Lead API Platform Engineer',
    avatar: '/images/authors/elena.svg',
    bio: 'Elena specializes in API contract engineering, REST scalability, and headless CMS integrations.',
  },
  'david-chen': {
    role: 'Senior Full-Stack Developer',
    avatar: '/images/authors/david.svg',
    bio: 'David builds resilient publishing architectures, exploring static compilation and modern web standards.',
  },
};

/**
 * Decode standard HTML entities returned by WordPress term/post fields (e.g. `&amp;` -> `&`).
 */
function decodeHtmlEntities(input: string): string {
  if (!input) return '';
  return input
    .replace(/&amp;/g, '&')
    .replace(/&#038;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—');
}

/**
 * Strip HTML tags and collapse whitespace for clean plain-text excerpts.
 */
function stripHtml(html: string): string {
  if (!html) return '';
  return decodeHtmlEntities(
    html
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

/**
 * Normalize WordPress local date strings (`YYYY-MM-DD HH:MM:SS`) into valid ISO 8601 strings.
 */
export function normalizeWordPressDate(rawDate?: string | null): string {
  if (!rawDate || !rawDate.trim()) {
    return new Date().toISOString();
  }

  const trimmed = rawDate.trim();

  // Match WordPress MySQL datetime format: YYYY-MM-DD HH:MM:SS
  if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}$/.test(trimmed)) {
    const isoCandidate = `${trimmed.replace(/\s+/, 'T')}Z`;
    const parsed = new Date(isoCandidate);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }

  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString();
  }

  return new Date().toISOString();
}

/**
 * Estimate reading time in minutes from HTML content when not explicitly provided.
 */
function computeReadingTime(htmlContent: string, rawReadingTime?: string | number | null): number {
  if (rawReadingTime !== undefined && rawReadingTime !== null && rawReadingTime !== '') {
    const parsed = Number(rawReadingTime);
    if (Number.isFinite(parsed) && parsed > 0) {
      return Math.round(parsed);
    }
  }

  const text = stripHtml(htmlContent);
  if (!text) return 3;
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

/**
 * Resolve empty excerpts by generating a concise summary from the article body.
 */
function resolveExcerpt(rawExcerpt?: string | null, rawContent?: string | null): string {
  const cleanedExcerpt = stripHtml(rawExcerpt ?? '');
  if (cleanedExcerpt.length > 0) {
    return cleanedExcerpt;
  }

  const fallbackText = stripHtml(rawContent ?? '');
  if (!fallbackText) {
    return '';
  }

  if (fallbackText.length <= 180) {
    return fallbackText;
  }

  const truncated = fallbackText.slice(0, 180);
  const lastSpace = truncated.lastIndexOf(' ');
  return `${lastSpace > 100 ? truncated.slice(0, lastSpace) : truncated}…`;
}

/**
 * Normalize a WordPress media URL (featured image, ACF image, or author avatar)
 * so that internal WordPress origins (e.g., `http://localhost:8088/wp-content/uploads/...`)
 * are rewritten to origin-relative `/wp-content/uploads/...` paths (or `PUBLIC_MEDIA_BASE_URL`
 * when configured), eliminating HTTP mixed-content errors and hardcoded localhost URLs
 * on HTTPS frontends (`https://demo.headless-journal.local`).
 */
export function normalizeWordPressMediaUrl(
  rawUrl: string | null | undefined,
  wpOrigin: string
): string {
  const trimmed = (rawUrl ?? '').trim();
  if (!trimmed) {
    return '';
  }

  const publicMediaBase = (
    import.meta.env.PUBLIC_MEDIA_BASE_URL ||
    (typeof process !== 'undefined' ? process.env.PUBLIC_MEDIA_BASE_URL : undefined) ||
    ''
  )
    .trim()
    .replace(/\/+$/, '');

  if (trimmed.startsWith('/wp-content/')) {
    return `${publicMediaBase}${trimmed}`;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      const isWpBackend =
        parsed.origin === wpOrigin ||
        parsed.hostname === 'localhost' ||
        parsed.hostname === '127.0.0.1';

      if (isWpBackend && parsed.pathname.startsWith('/wp-content/')) {
        return `${publicMediaBase}${parsed.pathname}${parsed.search}`;
      }
    } catch {
      // Keep original string if URL parsing fails
    }
    return trimmed;
  }

  return trimmed;
}

/**
 * Rewrite any embedded WordPress `/wp-content/...` URLs inside post HTML content
 * so images embedded in article bodies also load through the HTTPS frontend origin
 * without mixed-content errors or hardcoded `localhost` origins.
 */
export function normalizeContentMediaUrls(htmlContent: string, wpOrigin: string): string {
  if (!htmlContent) {
    return '';
  }

  const publicMediaBase = (
    import.meta.env.PUBLIC_MEDIA_BASE_URL ||
    (typeof process !== 'undefined' ? process.env.PUBLIC_MEDIA_BASE_URL : undefined) ||
    ''
  )
    .trim()
    .replace(/\/+$/, '');

  const escapedWpOrigin = wpOrigin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const wpOriginPattern = new RegExp(`${escapedWpOrigin}(/wp-content/[^"'\\s)>]+)`, 'gi');
  const localhostPattern = /https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?(\/wp-content\/[^"'\s)>]+)/gi;

  return htmlContent
    .replace(wpOriginPattern, `${publicMediaBase}$1`)
    .replace(localhostPattern, `${publicMediaBase}$1`);
}

/**
 * Normalize WordPress featured image URLs.
 * Supports full HTTP(S) URLs from WordPress Media Library, relative WordPress paths,
 * and fallback editorial illustrations when a post has no featured image.
 */
function resolveFeaturedImageUrl(
  rawUrl: string | null | undefined,
  slug: string,
  wpOrigin: string
): string {
  const normalized = normalizeWordPressMediaUrl(rawUrl, wpOrigin);
  if (normalized.length > 0) {
    return normalized;
  }

  return FALLBACK_ARTICLE_IMAGES[slug] || '/images/og-default.svg';
}

/**
 * Resolve the base WordPress API endpoint URL from environment configuration.
 * Throws a clear error if `WORDPRESS_API_URL` is missing or invalid.
 */
function resolveApiConfig(): { endpointBaseUrl: string; wpOrigin: string; apiKey?: string } {
  const rawUrl = (
    import.meta.env.WORDPRESS_API_URL ||
    (typeof process !== 'undefined' ? process.env.WORDPRESS_API_URL : undefined) ||
    ''
  ).trim();

  if (!rawUrl) {
    throw new Error(
      `[The Headless Journal - Free Mode] Missing required environment variable WORDPRESS_API_URL. ` +
        `Set WORDPRESS_API_URL=http://localhost:8088 in your .env file before running in CONTENT_MODE=free.`
    );
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(rawUrl);
  } catch {
    throw new Error(
      `[The Headless Journal - Free Mode] Invalid WORDPRESS_API_URL="${rawUrl}". ` +
        `Expected a valid HTTP/HTTPS URL such as http://localhost:8088.`
    );
  }

  const wpOrigin = parsedUrl.origin;
  const cleanPath = parsedUrl.pathname.replace(/\/+$/, '');

  let endpointBaseUrl: string;
  if (cleanPath.endsWith('/wp-json/rkx-api-studio/v1')) {
    endpointBaseUrl = `${wpOrigin}${cleanPath}`;
  } else if (cleanPath.endsWith('/wp-json')) {
    endpointBaseUrl = `${wpOrigin}${cleanPath}/rkx-api-studio/v1`;
  } else {
    endpointBaseUrl = `${wpOrigin}${cleanPath}${NAMESPACE_PATH}`;
  }

  const apiKey = (
    import.meta.env.RKX_API_KEY ||
    (typeof process !== 'undefined' ? process.env.RKX_API_KEY : undefined) ||
    ''
  ).trim();

  return {
    endpointBaseUrl,
    wpOrigin,
    apiKey: apiKey || undefined,
  };
}

export class FreeContentAdapter implements ContentAdapter {
  private postsCache: Article[] | null = null;
  private categoriesCache: Category[] | null = null;
  private featuredCache: Article | null | undefined = undefined;
  private initPromise: Promise<void> | null = null;
  private cacheTimestamp = 0;
  private static readonly CACHE_TTL_MS = 5000;

  /**
   * Perform a server-side HTTP GET request against an RKX API Studio Free endpoint.
   * Never silently falls back to mock data; throws clear actionable errors if WordPress is unreachable.
   */
  private async fetchEndpoint<T>(
    path: string,
    queryParams?: Record<string, string | number>
  ): Promise<{ data: T; total: number; totalPages: number }> {
    const { endpointBaseUrl, apiKey } = resolveApiConfig();

    const url = new URL(`${endpointBaseUrl}${path.startsWith('/') ? path : `/${path}`}`);
    if (queryParams) {
      for (const [key, value] of Object.entries(queryParams)) {
        url.searchParams.set(key, String(value));
      }
    }

    const headers: Record<string, string> = {
      Accept: 'application/json',
    };

    // Server-side build-time header only; never exposed to client code
    if (apiKey) {
      headers['X-RKX-API-Studio-Key'] = apiKey;
    }

    let response: Response;
    try {
      response = await fetch(url.toString(), { headers });
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      throw new Error(
        `[The Headless Journal - Free Mode] Failed to connect to WordPress endpoint "${url.toString()}". ` +
          `Ensure the local Docker WordPress container is running ("docker compose up -d"). Underlying error: ${reason}`
      );
    }

    if (!response.ok) {
      let bodyDetail = '';
      try {
        const text = await response.text();
        bodyDetail = text ? ` — Response: ${text.slice(0, 240)}` : '';
      } catch {
        // Ignore body read error
      }

      throw new Error(
        `[The Headless Journal - Free Mode] WordPress endpoint "${url.toString()}" returned HTTP ${response.status} ${response.statusText}${bodyDetail}. ` +
          `Verify that RKX API Studio Free is active and the "/posts", "/categories", and "/featured" endpoints are configured under /wp-json/rkx-api-studio/v1.`
      );
    }

    const totalHeader = response.headers.get('X-WP-Total') ?? response.headers.get('x-wp-total');
    const totalPagesHeader =
      response.headers.get('X-WP-TotalPages') ?? response.headers.get('x-wp-totalpages');

    const data = (await response.json()) as T;
    const itemCount = Array.isArray(data) ? data.length : 0;

    const total = totalHeader ? Math.max(0, Number.parseInt(totalHeader, 10) || itemCount) : itemCount;
    const totalPages = totalPagesHeader
      ? Math.max(1, Number.parseInt(totalPagesHeader, 10) || 1)
      : 1;

    return { data, total, totalPages };
  }

  /**
   * Fetch all pages from `/wp-json/rkx-api-studio/v1/posts` by reading `X-WP-TotalPages`.
   */
  private async fetchAllRawPosts(): Promise<RkxFreePostResponse[]> {
    const firstPage = await this.fetchEndpoint<RkxFreePostResponse[]>('/posts', { page: 1 });

    if (!Array.isArray(firstPage.data)) {
      throw new Error(
        `[The Headless Journal - Free Mode] Expected an array of posts from "/posts", received ${typeof firstPage.data}.`
      );
    }

    const allPosts: RkxFreePostResponse[] = [...firstPage.data];
    const totalPages = firstPage.totalPages;

    for (let page = 2; page <= totalPages; page++) {
      const pageResult = await this.fetchEndpoint<RkxFreePostResponse[]>('/posts', { page });
      if (Array.isArray(pageResult.data)) {
        allPosts.push(...pageResult.data);
      }
    }

    return allPosts;
  }

  /**
   * Map a raw RKX API Studio category term to the internal `Category` model.
   */
  private mapCategory(raw: RkxFreeCategoryResponse): Category {
    return {
      id: Number(raw.id),
      slug: String(raw.slug || ''),
      name: decodeHtmlEntities(String(raw.name || '')),
      description: decodeHtmlEntities(
        String(
          raw.description ||
            `Articles and technical dispatches filed under ${decodeHtmlEntities(String(raw.name || 'this topic'))}.`
        )
      ),
      count: typeof raw.count === 'number' ? raw.count : 0,
    };
  }

  /**
   * Map a raw RKX API Studio post response to the internal `Article` model.
   */
  private mapPost(
    raw: RkxFreePostResponse,
    categoriesBySlug: Map<string, Category>,
    featuredSlugs: Set<string>,
    wpOrigin: string
  ): Article {
    const slug = String(raw.slug || `post-${raw.id}`);
    const title = decodeHtmlEntities(String(raw.title || 'Untitled Article'));
    const content = normalizeContentMediaUrls(String(raw.content || ''), wpOrigin);
    const excerpt = resolveExcerpt(raw.excerpt, content);
    const publishedAt = normalizeWordPressDate(raw.date);
    const readingTime = computeReadingTime(content, raw.reading_time);
    const featuredImage = resolveFeaturedImageUrl(raw.featured_image_url, slug, wpOrigin);
    const featuredImageAlt = raw.featured_image_alt
      ? decodeHtmlEntities(String(raw.featured_image_alt))
      : title;

    // Resolve category from taxonomy:category array and enrich with full description from /categories
    const rawCat = Array.isArray(raw.category) && raw.category.length > 0 ? raw.category[0] : null;
    const matchedCategory = rawCat ? categoriesBySlug.get(rawCat.slug) : undefined;

    const category: Category = matchedCategory
      ? { ...matchedCategory }
      : rawCat
        ? {
            id: Number(rawCat.id),
            slug: String(rawCat.slug),
            name: decodeHtmlEntities(String(rawCat.name)),
            description: `Technical articles and architecture guides in ${decodeHtmlEntities(String(rawCat.name))}.`,
          }
        : {
            id: 1,
            slug: 'headless-architecture',
            name: 'Headless Architecture',
            description:
              'Architectural principles, decoupling strategies, and frontend orchestration for modern web publishing.',
          };

    // Resolve tags (excluding internal 'featured' marker tag from visible tag badges)
    const rawTags = Array.isArray(raw.post_tag) ? raw.post_tag : [];
    const hasFeaturedTag = rawTags.some((t) => t.slug.toLowerCase() === 'featured');
    const visibleTags = rawTags
      .filter((t) => t.slug.toLowerCase() !== 'featured')
      .map((t) => decodeHtmlEntities(t.name));

    // Resolve author metadata
    const authorSlug = raw.author?.slug || '';
    const fallbackProfile = FALLBACK_AUTHOR_PROFILES[authorSlug];
    const authorName = decodeHtmlEntities(raw.author?.name || 'Editorial Staff');
    const authorRole = raw.author_role
      ? decodeHtmlEntities(String(raw.author_role))
      : fallbackProfile?.role || 'Staff Engineer';
    const authorBio = raw.author_bio
      ? decodeHtmlEntities(String(raw.author_bio))
      : fallbackProfile?.bio || 'Staff writer and technical researcher at The Headless Journal.';
    const rawAuthorAvatar =
      (raw.author_avatar && String(raw.author_avatar).trim()) ||
      raw.author?.avatar_url ||
      fallbackProfile?.avatar ||
      '/images/authors/marcus.svg';
    const authorAvatar =
      normalizeWordPressMediaUrl(rawAuthorAvatar, wpOrigin) || '/images/authors/marcus.svg';

    const author: Author = {
      id: Number(raw.author?.id || 1),
      name: authorName,
      role: authorRole,
      avatar: authorAvatar,
      bio: authorBio,
    };

    const subtitle = raw.subtitle ? decodeHtmlEntities(String(raw.subtitle)) : undefined;
    const isFeatured = featuredSlugs.has(slug) || hasFeaturedTag;

    return {
      id: Number(raw.id),
      slug,
      title,
      ...(subtitle ? { subtitle } : {}),
      excerpt,
      content,
      featuredImage,
      featuredImageAlt,
      category,
      author,
      publishedAt,
      readingTime,
      featured: isFeatured,
      tags: visibleTags,
    };
  }

  /**
   * Initialize and cache all categories, posts, and featured selections for build-time SSG.
   */
  private async ensureInitialized(): Promise<void> {
    const now = Date.now();
    if (
      this.postsCache &&
      this.categoriesCache &&
      this.featuredCache !== undefined &&
      now - this.cacheTimestamp < FreeContentAdapter.CACHE_TTL_MS
    ) {
      return;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = (async () => {
      const { wpOrigin } = resolveApiConfig();

      const [categoriesRes, rawPosts, featuredRes] = await Promise.all([
        this.fetchEndpoint<RkxFreeCategoryResponse[]>('/categories'),
        this.fetchAllRawPosts(),
        this.fetchEndpoint<RkxFreePostResponse[]>('/featured'),
      ]);

      if (!Array.isArray(categoriesRes.data)) {
        throw new Error(
          `[The Headless Journal - Free Mode] Expected an array from "/categories", received ${typeof categoriesRes.data}.`
        );
      }

      if (!Array.isArray(featuredRes.data)) {
        throw new Error(
          `[The Headless Journal - Free Mode] Expected an array from "/featured", received ${typeof featuredRes.data}.`
        );
      }

      const mappedCategories = categoriesRes.data.map((c) => this.mapCategory(c));
      const categoriesBySlug = new Map<string, Category>(
        mappedCategories.map((cat) => [cat.slug, cat])
      );

      const featuredSlugs = new Set<string>(
        featuredRes.data.map((fp) => String(fp.slug || '')).filter(Boolean)
      );

      const mappedPosts = rawPosts
        .map((post) => this.mapPost(post, categoriesBySlug, featuredSlugs, wpOrigin))
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

      // Ensure category post counts reflect actual published posts
      this.categoriesCache = mappedCategories.map((cat) => {
        const count = mappedPosts.filter((p) => p.category.slug === cat.slug).length;
        return {
          ...cat,
          count: count > 0 ? count : (cat.count ?? 0),
        };
      });

      this.postsCache = mappedPosts;

      // Resolve featured article from the `/featured` endpoint first, then fallback to first post
      if (featuredRes.data.length > 0) {
        const featuredRaw = featuredRes.data[0];
        const matchingFromAll = mappedPosts.find((p) => p.slug === featuredRaw.slug);
        this.featuredCache =
          matchingFromAll ??
          this.mapPost(featuredRaw, categoriesBySlug, featuredSlugs, wpOrigin);
      } else {
        this.featuredCache = mappedPosts.find((p) => p.featured) ?? mappedPosts[0] ?? null;
      }
      this.cacheTimestamp = Date.now();
    })();

    try {
      await this.initPromise;
    } finally {
      this.initPromise = null;
    }
  }

  async getAllArticles(): Promise<Article[]> {
    await this.ensureInitialized();
    return this.postsCache!;
  }

  async getArticles(params?: {
    categorySlug?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginationResult<Article>> {
    await this.ensureInitialized();

    const page = Math.max(1, params?.page || 1);
    const pageSize = Math.max(1, params?.pageSize || 6);
    const categorySlug = params?.categorySlug;

    let filtered = this.postsCache!;
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
    await this.ensureInitialized();
    const article = this.postsCache!.find((p) => p.slug === slug);
    return article ?? null;
  }

  async getFeaturedArticle(): Promise<Article | null> {
    await this.ensureInitialized();
    return this.featuredCache ?? null;
  }

  async getLatestArticles(limit = 6, excludeSlug?: string): Promise<Article[]> {
    await this.ensureInitialized();
    let list = this.postsCache!;
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
    await this.ensureInitialized();
    const posts = this.postsCache!;

    const candidates = posts.filter(
      (p) => p.slug !== currentSlug && p.category.slug === categorySlug
    );

    if (candidates.length >= limit) {
      return candidates.slice(0, limit);
    }

    const others = posts.filter(
      (p) => p.slug !== currentSlug && p.category.slug !== categorySlug
    );
    return [...candidates, ...others].slice(0, limit);
  }

  async getCategories(): Promise<Category[]> {
    await this.ensureInitialized();
    return this.categoriesCache!;
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    await this.ensureInitialized();
    const cat = this.categoriesCache!.find((c) => c.slug === slug);
    return cat ?? null;
  }
}

