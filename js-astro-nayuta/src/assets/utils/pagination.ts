import type { PaginateFunction } from 'astro';

/** Normalize URL/input page numbers and clamp against the available pages. */
export function normalizePageNumber(number: number, lastPage: number): number {
  return Number.isSafeInteger(number) && number > 0
    ? Math.min(number, Math.max(1, lastPage))
    : 1;
}

/** At most five numbered controls, regardless of the collection size. */
export function getVisiblePages(
  currentPage: number,
  lastPage: number,
): number[] {
  if (lastPage < 1) return [];
  const nearbyStart = Math.max(2, Math.min(currentPage - 1, lastPage - 3));
  const numbers = new Set([1, lastPage]);
  for (
    let number = nearbyStart;
    number <= Math.min(lastPage - 1, nearbyStart + 2);
    number++
  ) {
    numbers.add(number);
  }
  return [...numbers].sort((a, b) => a - b);
}

/** Keep the search terms, other query parameters and hash when changing pages. */
export function getQueryPageUrl(
  currentUrl: string,
  pageNumber: number,
): string {
  const url = new URL(currentUrl, 'https://pagination.invalid');
  url.searchParams.set('page', String(pageNumber));
  return `${url.pathname}${url.search}${url.hash}`;
}

/** Keep page one at the archive URL and subsequent pages under /page/<number>. */
export function getPageUrl(firstPageUrl: string, pageNumber: number): string {
  if (pageNumber === 1) return firstPageUrl;
  const trailingSlash = firstPageUrl.endsWith('/') ? '/' : '';
  return `${firstPageUrl.replace(/\/$/, '')}/page/${pageNumber}${trailingSlash}`;
}

/**
 * Use in a [...page].astro route. Astro owns slicing and page metadata; this
 * adapter keeps the first URL and reserves /page/<number> for later pages.
 * Supply entries in their final display order before calling this helper.
 */
export function paginateList<T>(
  paginate: PaginateFunction,
  entries: readonly T[],
  options: {
    pageSize?: number;
    params?: Record<string, string>;
  } = {},
) {
  const { pageSize = 10, params = {} } = options;
  if (!Number.isSafeInteger(pageSize) || pageSize < 1) {
    throw new Error('Pagination pageSize must be a positive safe integer.');
  }

  const routes = paginate(entries, { pageSize, params });
  // Astro leaves spaces and Unicode in generated paths. Normalize without
  // double-encoding the escapes it already supplies for reserved characters.
  const firstPageUrl = new URL(
    routes[0].props.page.url.current,
    'https://pagination.invalid',
  ).pathname;

  return routes.map((route) => {
    const { page } = route.props;
    const { currentPage, lastPage } = page;
    return {
      params: {
        ...route.params,
        page: currentPage === 1 ? undefined : `page/${currentPage}`,
      },
      props: {
        page: {
          ...page,
          url: {
            current: getPageUrl(firstPageUrl, currentPage),
            prev:
              currentPage > 1
                ? getPageUrl(firstPageUrl, currentPage - 1)
                : undefined,
            next:
              currentPage < lastPage
                ? getPageUrl(firstPageUrl, currentPage + 1)
                : undefined,
            first: currentPage > 1 ? firstPageUrl : undefined,
            last:
              currentPage < lastPage
                ? getPageUrl(firstPageUrl, lastPage)
                : undefined,
          },
        },
      },
    };
  });
}
