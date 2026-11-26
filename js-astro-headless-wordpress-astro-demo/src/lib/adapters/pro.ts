import type {
  AcfHeroImage,
  AcfRelatedResource,
  Article,
  Author,
  Category,
  ContentAdapter,
  PaginationResult,
} from '../types';
import {
  normalizeContentMediaUrls,
  normalizeWordPressDate,
  normalizeWordPressMediaUrl,
} from './free';

/**
 * Typed ACF `hero_image` response shape formatted by RKX API Studio Pro (`rkx_as_format_acf_value`).
 */
export interface RkxProAcfHeroImageResponse {
  url?: string | null;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
}

/**
 * Typed ACF `author_info` group response shape formatted by RKX API Studio Pro.
 */
export interface RkxProAcfAuthorInfoResponse {
  name?: string | null;
  role?: string | null;
  bio?: string | null;
  avatar?: string | null;
  github?: string | null;
}

/**
 * Typed ACF `related_resources` relationship item response shape formatted by RKX API Studio Pro.
 */
export interface RkxProAcfRelatedResourceResponse {
  id: number;
  title?: string | null;
  slug?: string | null;
}

/**
 * Raw post item shape returned by RKX API Studio Pro collection and dynamic route endpoints:
 * - `GET /wp-json/<namespace>/posts`
 * - `GET /wp-json/<namespace>/featured`
 * - `GET /wp-json/<namespace>/posts/{slug}`
 * - `GET /wp-json/<namespace>/post-ids/{id}`
 */
export interface RkxProPostResponse {
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
  // Typed ACF fields mapped by RKX API Studio Pro (with `acf:` prefix stripped in JSON output)
  article_subtitle?: string | null;
  hero_image?: RkxProAcfHeroImageResponse | null;
  author_info?: RkxProAcfAuthorInfoResponse | null;
  related_resources?: RkxProAcfRelatedResourceResponse[] | null;
}

/**
 * Raw category term shape returned by:
 * - `GET /wp-json/<namespace>/categories`
 * - `GET /wp-json/<namespace>/categories/{slug}`
 */
export interface RkxProCategoryResponse {
  id: number;
  slug: string;
  name: string;
  description?: string;
  count?: number;
  parent?: number;
}

const DEFAULT_PRO_NAMESPACE = 'rkx/v1';

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
  { role: string; avatar: string; bio: string; github?: string }
> = {
  'marcus-vance': {
    role: 'Principal Frontend Architect',
    avatar: '/images/authors/marcus.svg',
    bio: 'Marcus leads frontend architecture initiatives with a focus on Astro, edge computing, and performant content delivery.',
    github: 'https://github.com/rkxdesign',
  },
  'elena-rostova': {
    role: 'Lead API Platform Engineer',
    avatar: '/images/authors/elena.svg',
    bio: 'Elena specializes in API contract engineering, REST scalability, and headless CMS integrations.',
    github: 'https://github.com/rkxdesign',
  },
  'david-chen': {
    role: 'Senior Full-Stack Developer',
    avatar: '/images/authors/david.svg',
    bio: 'David builds resilient publishing architectures, exploring static compilation and modern web standards.',
    github: 'https://github.com/rkxdesign',
  },
};

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

function stripHtml(html: string): string {
  if (!html) return '';
  return decodeHtmlEntities(
    html
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

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
 * Resolve and validate the WordPress API base URL, custom namespace (`RKX_API_NAMESPACE`),
 * and optional server-side Bearer key (`RKX_API_KEY`).
 */
export function resolveProApiConfig(): {
  endpointBaseUrl: string;
  wpOrigin: string;
  namespace: string;
  apiKey?: string;
} {
  const rawUrl = (
    import.meta.env.WORDPRESS_API_URL ||
    (typeof process !== 'undefined' ? process.env.WORDPRESS_API_URL : undefined) ||
    ''
  ).trim();

  if (!rawUrl) {
    throw new Error(
      `[The Headless Journal - Pro Mode] Missing required environment variable WORDPRESS_API_URL. ` +
        `Set WORDPRESS_API_URL=http://localhost:8088 in your .env file before running in CONTENT_MODE=pro.`
    );
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(rawUrl);
  } catch {
    throw new Error(
      `[The Headless Journal - Pro Mode] Invalid WORDPRESS_API_URL="${rawUrl}". ` +
        `Expected a valid HTTP/HTTPS URL such as http://localhost:8088.`
    );
  }

  const rawNamespace = (
    import.meta.env.RKX_API_NAMESPACE ||
    (typeof process !== 'undefined' ? process.env.RKX_API_NAMESPACE : undefined) ||
    DEFAULT_PRO_NAMESPACE
  )
    .trim()
    .replace(/^\/+|\/+$/g, '');

  const namespace = rawNamespace || DEFAULT_PRO_NAMESPACE;
  const wpOrigin = parsedUrl.origin;
  const cleanPath = parsedUrl.pathname.replace(/\/+$/, '');

  let endpointBaseUrl: string;
  if (cleanPath.endsWith(`/wp-json/${namespace}`)) {
    endpointBaseUrl = `${wpOrigin}${cleanPath}`;
  } else if (cleanPath.endsWith('/wp-json')) {
    endpointBaseUrl = `${wpOrigin}${cleanPath}/${namespace}`;
  } else {
    endpointBaseUrl = `${wpOrigin}${cleanPath}/wp-json/${namespace}`;
  }

  const apiKey = (
    import.meta.env.RKX_API_KEY ||
    (typeof process !== 'undefined' ? process.env.RKX_API_KEY : undefined) ||
    ''
  ).trim();

  return {
    endpointBaseUrl,
    wpOrigin,
    namespace,
    apiKey: apiKey || undefined,
  };
}

/**
 * Normalize ACF `hero_image` object when returned by RKX API Studio Pro.
 */
function normalizeAcfHeroImage(
  rawHeroImage: RkxProAcfHeroImageResponse | null | undefined,
  wpOrigin: string
): AcfHeroImage | undefined {
  if (!rawHeroImage || typeof rawHeroImage !== 'object' || Array.isArray(rawHeroImage)) {
    return undefined;
  }

  const url = normalizeWordPressMediaUrl(rawHeroImage.url, wpOrigin);
  if (!url) {
    return undefined;
  }

  return {
    url,
    alt: decodeHtmlEntities(String(rawHeroImage.alt ?? '')),
    width: typeof rawHeroImage.width === 'number' && rawHeroImage.width > 0 ? rawHeroImage.width : 1200,
    height:
      typeof rawHeroImage.height === 'number' && rawHeroImage.height > 0 ? rawHeroImage.height : 675,
  };
}

/**
 * Normalize ACF `related_resources` relationship array when returned by RKX API Studio Pro.
 */
function normalizeAcfRelatedResources(
  rawRelated: RkxProAcfRelatedResourceResponse[] | null | undefined
): AcfRelatedResource[] | undefined {
  if (!Array.isArray(rawRelated) || rawRelated.length === 0) {
    return undefined;
  }

  const normalized = rawRelated
    .filter((item) => item && typeof item === 'object' && item.slug)
    .map((item) => ({
      id: Number(item.id),
      title: decodeHtmlEntities(String(item.title ?? '')),
      slug: String(item.slug ?? ''),
    }));

  return normalized.length > 0 ? normalized : undefined;
}

export class ProContentAdapter implements ContentAdapter {
  private postsCache: Article[] | null = null;
  private postsBySlugCache = new Map<string, Article>();
  private categoriesCache: Category[] | null = null;
  private categoriesBySlugCache = new Map<string, Category>();
  private featuredCache: Article | null | undefined = undefined;
  private initPromise: Promise<void> | null = null;
  private cacheTimestamp = 0;
  private static readonly CACHE_TTL_MS = 5000;

  /**
   * Build server-side request headers, supporting Bearer token authentication
   * (`Authorization: Bearer <key>`) for protected Pro endpoints without ever exposing
   * credentials to client-side code.
   */
  private buildHeaders(apiKey?: string): Record<string, string> {
    const headers: Record<string, string> = {
      Accept: 'application/json',
    };

    if (apiKey) {
      headers.Authorization = `Bearer ${apiKey}`;
    }

    return headers;
  }

  /**
   * Perform a server-side HTTP GET request against an RKX API Studio Pro endpoint.
   * When `allowNotFound` is true (used for Dynamic Route Builder single-item lookups),
   * HTTP 404 (`rkx_as_not_found`) returns `data: null` rather than throwing.
   */
  private async fetchEndpoint<T>(
    path: string,
    options?: {
      queryParams?: Record<string, string | number>;
      allowNotFound?: boolean;
    }
  ): Promise<{ data: T | null; total: number; totalPages: number; status: number }> {
    const { endpointBaseUrl, namespace, apiKey } = resolveProApiConfig();

    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const url = new URL(`${endpointBaseUrl}${normalizedPath}`);
    if (options?.queryParams) {
      for (const [key, value] of Object.entries(options.queryParams)) {
        url.searchParams.set(key, String(value));
      }
    }

    const headers = this.buildHeaders(apiKey);

    let response: Response;
    try {
      response = await fetch(url.toString(), { headers });
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      throw new Error(
        `[The Headless Journal - Pro Mode] Failed to connect to WordPress Pro endpoint "${url.toString()}". ` +
          `Ensure the local Docker WordPress container is running ("docker compose up -d") and RKX API Studio Pro is active. Underlying error: ${reason}`
      );
    }

    if (response.status === 404 && options?.allowNotFound) {
      let errorPayload: { code?: string; message?: string } | null = null;
      try {
        errorPayload = (await response.json()) as { code?: string; message?: string };
      } catch {
        // Ignore JSON parse failure on 404
      }

      // Only treat genuine record-not-found (`rkx_as_not_found`) as null;
      // if the route itself is missing (`rest_no_route`), fail clearly!
      if (errorPayload?.code === 'rkx_as_not_found') {
        return { data: null, total: 0, totalPages: 0, status: 404 };
      }
    }

    if (!response.ok) {
      let bodyDetail = '';
      try {
        const text = await response.text();
        bodyDetail = text ? ` — Response: ${text.slice(0, 280)}` : '';
      } catch {
        // Ignore body read error
      }

      throw new Error(
        `[The Headless Journal - Pro Mode] WordPress Pro endpoint "${url.toString()}" returned HTTP ${response.status} ${response.statusText}${bodyDetail}. ` +
          `Verify that RKX API Studio Pro is active, licensed, and configured with custom namespace "${namespace}" and Dynamic Route Builder endpoints.`
      );
    }

    const totalHeader = response.headers.get('X-WP-Total') ?? response.headers.get('x-wp-total');
    const totalPagesHeader =
      response.headers.get('X-WP-TotalPages') ?? response.headers.get('x-wp-totalpages');

    const data = (await response.json()) as T;
    const itemCount = Array.isArray(data) ? data.length : data ? 1 : 0;

    const total = totalHeader ? Math.max(0, Number.parseInt(totalHeader, 10) || itemCount) : itemCount;
    const totalPages = totalPagesHeader
      ? Math.max(1, Number.parseInt(totalPagesHeader, 10) || 1)
      : 1;

    return { data, total, totalPages, status: response.status };
  }

  /**
   * Fetch all pages from `/wp-json/<namespace>/posts` for static route generation.
   */
  private async fetchAllRawPosts(): Promise<RkxProPostResponse[]> {
    const firstPage = await this.fetchEndpoint<RkxProPostResponse[]>('/posts', {
      queryParams: { page: 1 },
    });

    if (!Array.isArray(firstPage.data)) {
      throw new Error(
        `[The Headless Journal - Pro Mode] Expected an array of posts from "/posts", received ${typeof firstPage.data}.`
      );
    }

    const allPosts: RkxProPostResponse[] = [...firstPage.data];
    const totalPages = firstPage.totalPages;

    for (let page = 2; page <= totalPages; page++) {
      const pageResult = await this.fetchEndpoint<RkxProPostResponse[]>('/posts', {
        queryParams: { page },
      });
      if (Array.isArray(pageResult.data)) {
        allPosts.push(...pageResult.data);
      }
    }

    return allPosts;
  }

  /**
   * Fetch a single post by slug using the Pro Dynamic Route Builder endpoint:
   * `GET /wp-json/<namespace>/posts/{slug}`
   */
  private async fetchDynamicPostBySlug(slug: string): Promise<RkxProPostResponse | null> {
    const encodedSlug = encodeURIComponent(slug);
    const result = await this.fetchEndpoint<RkxProPostResponse>(`/posts/${encodedSlug}`, {
      allowNotFound: true,
    });

    if (result.status === 404 || !result.data) {
      return null;
    }

    if (Array.isArray(result.data) || typeof result.data !== 'object') {
      throw new Error(
        `[The Headless Journal - Pro Mode] Expected a single JSON object from dynamic route "/posts/${encodedSlug}", received ${Array.isArray(result.data) ? 'array' : typeof result.data}.`
      );
    }

    return result.data;
  }

  /**
   * Fetch a single post by numeric ID using the Pro Dynamic Route Builder endpoint:
   * `GET /wp-json/<namespace>/post-ids/{id}`
   */
  async getArticleById(id: number): Promise<Article | null> {
    await this.ensureInitialized();
    const { wpOrigin, namespace } = resolveProApiConfig();

    const result = await this.fetchEndpoint<RkxProPostResponse>(`/post-ids/${id}`, {
      allowNotFound: true,
    });

    if (result.status === 404 || !result.data) {
      return null;
    }

    if (Array.isArray(result.data) || typeof result.data !== 'object') {
      throw new Error(
        `[The Headless Journal - Pro Mode] Expected a single JSON object from dynamic route "/post-ids/${id}".`
      );
    }

    const featuredSlugs = new Set<string>(
      this.featuredCache ? [this.featuredCache.slug] : []
    );

    return this.mapPost(
      result.data,
      this.categoriesBySlugCache,
      featuredSlugs,
      wpOrigin,
      `/wp-json/${namespace}/post-ids/${id}`
    );
  }

  /**
   * Fetch a single category by slug using the Pro Dynamic Route Builder endpoint:
   * `GET /wp-json/<namespace>/categories/{slug}`
   */
  private async fetchDynamicCategoryBySlug(slug: string): Promise<RkxProCategoryResponse | null> {
    const encodedSlug = encodeURIComponent(slug);
    const result = await this.fetchEndpoint<RkxProCategoryResponse>(`/categories/${encodedSlug}`, {
      allowNotFound: true,
    });

    if (result.status === 404 || !result.data) {
      return null;
    }

    if (Array.isArray(result.data) || typeof result.data !== 'object') {
      throw new Error(
        `[The Headless Journal - Pro Mode] Expected a single JSON object from dynamic route "/categories/${encodedSlug}".`
      );
    }

    return result.data;
  }

  /**
   * Map a raw RKX API Studio Pro category term to the internal `Category` model.
   */
  private mapCategory(raw: RkxProCategoryResponse): Category {
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
   * Map a raw RKX API Studio Pro post response (including normalized ACF fields)
   * into the internal `Article` model.
   */
  private mapPost(
    raw: RkxProPostResponse,
    categoriesBySlug: Map<string, Category>,
    featuredSlugs: Set<string>,
    wpOrigin: string,
    proEndpointRoute?: string
  ): Article {
    const slug = String(raw.slug || `post-${raw.id}`);
    const title = decodeHtmlEntities(String(raw.title || 'Untitled Article'));
    const content = normalizeContentMediaUrls(String(raw.content || ''), wpOrigin);
    const excerpt = resolveExcerpt(raw.excerpt, content);
    const publishedAt = normalizeWordPressDate(raw.date);
    const readingTime = computeReadingTime(content, raw.reading_time);

    // Normalize ACF `hero_image` first when present, falling back to `featured_image_url`
    const heroImageMeta = normalizeAcfHeroImage(raw.hero_image, wpOrigin);
    const featuredImage =
      heroImageMeta?.url || resolveFeaturedImageUrl(raw.featured_image_url, slug, wpOrigin);
    const featuredImageAlt =
      (heroImageMeta?.alt && heroImageMeta.alt.trim()) ||
      (raw.featured_image_alt ? decodeHtmlEntities(String(raw.featured_image_alt)) : title);

    // Normalize ACF `article_subtitle` first when present, falling back to `meta:subtitle`
    const rawSubtitle =
      (raw.article_subtitle && String(raw.article_subtitle).trim()) ||
      (raw.subtitle && String(raw.subtitle).trim()) ||
      '';
    const subtitle = rawSubtitle ? decodeHtmlEntities(rawSubtitle) : undefined;

    // Resolve category from taxonomy:category array and enrich with full description
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

    // Normalize ACF `author_info` group first when present, falling back to post meta & WP author
    const authorSlug = raw.author?.slug || '';
    const fallbackProfile = FALLBACK_AUTHOR_PROFILES[authorSlug];
    const acfAuthor =
      raw.author_info && typeof raw.author_info === 'object' && !Array.isArray(raw.author_info)
        ? raw.author_info
        : null;

    const authorName = decodeHtmlEntities(
      (acfAuthor?.name && String(acfAuthor.name).trim()) || raw.author?.name || 'Editorial Staff'
    );
    const authorRole = decodeHtmlEntities(
      (acfAuthor?.role && String(acfAuthor.role).trim()) ||
        (raw.author_role && String(raw.author_role).trim()) ||
        fallbackProfile?.role ||
        'Staff Engineer'
    );
    const authorBio = decodeHtmlEntities(
      (acfAuthor?.bio && String(acfAuthor.bio).trim()) ||
        (raw.author_bio && String(raw.author_bio).trim()) ||
        fallbackProfile?.bio ||
        'Staff writer and technical researcher at The Headless Journal.'
    );
    const rawAuthorAvatar =
      (acfAuthor?.avatar && String(acfAuthor.avatar).trim()) ||
      (raw.author_avatar && String(raw.author_avatar).trim()) ||
      raw.author?.avatar_url ||
      fallbackProfile?.avatar ||
      '/images/authors/marcus.svg';
    const authorAvatar =
      normalizeWordPressMediaUrl(rawAuthorAvatar, wpOrigin) || '/images/authors/marcus.svg';
    const authorGithub =
      (acfAuthor?.github && String(acfAuthor.github).trim()) || fallbackProfile?.github;

    const author: Author = {
      id: Number(raw.author?.id || 1),
      name: authorName,
      role: authorRole,
      avatar: authorAvatar,
      bio: authorBio,
      ...(authorGithub ? { github: authorGithub } : {}),
    };

    // Normalize ACF `related_resources` relationship field
    const relatedResources = normalizeAcfRelatedResources(raw.related_resources);
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
      ...(heroImageMeta ? { heroImageMeta } : {}),
      ...(relatedResources ? { relatedResources } : {}),
      ...(proEndpointRoute ? { proEndpointRoute } : {}),
    };
  }

  /**
   * Initialize and cache all categories, collection posts, and individual dynamic-route articles
   * for build-time static site generation.
   */
  private async ensureInitialized(): Promise<void> {
    const now = Date.now();
    if (
      this.postsCache &&
      this.categoriesCache &&
      this.featuredCache !== undefined &&
      now - this.cacheTimestamp < ProContentAdapter.CACHE_TTL_MS
    ) {
      return;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = (async () => {
      const { wpOrigin, namespace } = resolveProApiConfig();

      const [categoriesRes, collectionPosts, featuredRes] = await Promise.all([
        this.fetchEndpoint<RkxProCategoryResponse[]>('/categories'),
        this.fetchAllRawPosts(),
        this.fetchEndpoint<RkxProPostResponse[]>('/featured'),
      ]);

      if (!Array.isArray(categoriesRes.data)) {
        throw new Error(
          `[The Headless Journal - Pro Mode] Expected an array from "/categories", received ${typeof categoriesRes.data}.`
        );
      }

      if (!Array.isArray(featuredRes.data)) {
        throw new Error(
          `[The Headless Journal - Pro Mode] Expected an array from "/featured", received ${typeof featuredRes.data}.`
        );
      }

      const mappedCategories = categoriesRes.data.map((c) => this.mapCategory(c));
      this.categoriesBySlugCache = new Map<string, Category>(
        mappedCategories.map((cat) => [cat.slug, cat])
      );

      const featuredSlugs = new Set<string>(
        featuredRes.data.map((fp) => String(fp.slug || '')).filter(Boolean)
      );

      // Fetch individual article details via the Pro Dynamic Route Builder endpoint (`/posts/{slug}`)
      const detailedPosts = await Promise.all(
        collectionPosts.map(async (summaryPost) => {
          const slug = String(summaryPost.slug || '');
          const dynamicDetail = slug ? await this.fetchDynamicPostBySlug(slug) : null;
          const rawToMap = dynamicDetail ?? summaryPost;
          const routePath = dynamicDetail
            ? `/wp-json/${namespace}/posts/${encodeURIComponent(slug)}`
            : undefined;
          return this.mapPost(
            rawToMap,
            this.categoriesBySlugCache,
            featuredSlugs,
            wpOrigin,
            routePath
          );
        })
      );

      const sortedPosts = detailedPosts.sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );

      this.postsBySlugCache = new Map<string, Article>(sortedPosts.map((p) => [p.slug, p]));

      // Ensure category post counts reflect actual published posts
      this.categoriesCache = mappedCategories.map((cat) => {
        const count = sortedPosts.filter((p) => p.category.slug === cat.slug).length;
        const updated = {
          ...cat,
          count: count > 0 ? count : (cat.count ?? 0),
        };
        this.categoriesBySlugCache.set(cat.slug, updated);
        return updated;
      });

      this.postsCache = sortedPosts;

      // Resolve featured article
      if (featuredRes.data.length > 0) {
        const featuredRaw = featuredRes.data[0];
        const matchingFromAll = sortedPosts.find((p) => p.slug === featuredRaw.slug);
        this.featuredCache =
          matchingFromAll ??
          this.mapPost(
            featuredRaw,
            this.categoriesBySlugCache,
            featuredSlugs,
            wpOrigin,
            `/wp-json/${namespace}/featured`
          );
      } else {
        this.featuredCache = sortedPosts.find((p) => p.featured) ?? sortedPosts[0] ?? null;
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

  /**
   * Fetch an individual article by slug using the Pro Dynamic Route Builder endpoint
   * (`GET /wp-json/<namespace>/posts/{slug}`), returning a cached instance when already
   * resolved during build initialization or querying the dynamic endpoint directly.
   */
  async getArticleBySlug(slug: string): Promise<Article | null> {
    await this.ensureInitialized();

    const cached = this.postsBySlugCache.get(slug);
    if (cached) {
      return cached;
    }

    const { wpOrigin, namespace } = resolveProApiConfig();
    const rawDetail = await this.fetchDynamicPostBySlug(slug);
    if (!rawDetail) {
      return null;
    }

    const featuredSlugs = new Set<string>(
      this.featuredCache ? [this.featuredCache.slug] : []
    );
    const mapped = this.mapPost(
      rawDetail,
      this.categoriesBySlugCache,
      featuredSlugs,
      wpOrigin,
      `/wp-json/${namespace}/posts/${encodeURIComponent(slug)}`
    );
    this.postsBySlugCache.set(slug, mapped);
    return mapped;
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
    const currentArticle = this.postsBySlugCache.get(currentSlug);

    // Prioritize curated ACF `related_resources` relationship items when available
    const curated: Article[] = [];
    if (currentArticle?.relatedResources && currentArticle.relatedResources.length > 0) {
      for (const rel of currentArticle.relatedResources) {
        const matched = this.postsBySlugCache.get(rel.slug);
        if (matched && matched.slug !== currentSlug && !curated.some((c) => c.slug === matched.slug)) {
          curated.push(matched);
        }
      }
    }

    if (curated.length >= limit) {
      return curated.slice(0, limit);
    }

    const sameCategory = posts.filter(
      (p) =>
        p.slug !== currentSlug &&
        p.category.slug === categorySlug &&
        !curated.some((c) => c.slug === p.slug)
    );

    const combined = [...curated, ...sameCategory];
    if (combined.length >= limit) {
      return combined.slice(0, limit);
    }

    const others = posts.filter(
      (p) =>
        p.slug !== currentSlug &&
        p.category.slug !== categorySlug &&
        !combined.some((c) => c.slug === p.slug)
    );
    return [...combined, ...others].slice(0, limit);
  }

  async getCategories(): Promise<Category[]> {
    await this.ensureInitialized();
    return this.categoriesCache!;
  }

  /**
   * Fetch a single category by slug using the Pro Dynamic Route Builder endpoint
   * (`GET /wp-json/<namespace>/categories/{slug}`).
   */
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    await this.ensureInitialized();

    const rawCat = await this.fetchDynamicCategoryBySlug(slug);
    if (rawCat) {
      const mapped = this.mapCategory(rawCat);
      const existing = this.categoriesBySlugCache.get(slug);
      const enriched: Category = {
        ...mapped,
        count: existing?.count ?? mapped.count,
      };
      this.categoriesBySlugCache.set(slug, enriched);
      return enriched;
    }

    return this.categoriesBySlugCache.get(slug) ?? null;
  }
}

