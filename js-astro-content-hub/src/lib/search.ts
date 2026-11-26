// Client-side site search (Pagefind).
//
// The Pagefind index is generated at build time (see astro.config.mjs hook):
// the CLI walks the built `dist/` HTML, reads each page's language from
// <html lang>, and stores per-language indexes plus per-page scope filters
// (collected from `data-pagefind-filter="scope:..."` attributes emitted by
// Layout/DocsLayout). The JS bundle is then copied to `dist/pagefind/`.
//
// This module wraps that bundle behind a small API used by SearchModal.astro:
//   - scoped search: pass `scope` ('' | 'posts' | 'docs' | 'products') and it
//     is merged into every query as a Pagefind filter, so the results are
//     confined to the selected content type. An optional `productScope`
//     (e.g. 'product:vite') narrows the docs scope to a single product.
//   - locale isolation: Pagefind keeps one index per language (keyed on the
//     page's <html lang>). init() delegates to pagefind.init() which loads the
//     index matching the current page's language, so search on a /zh-Hans/...
//     page only hits Chinese pages (and the en fallbacks shown in the zh-Hans
//     shell are indexed as en, keeping the fallback content discoverable).
//   - base-aware asset path: the bundle is loaded from `base/pagefind/...` so
//     the search UI works under a sub-path deploy.

/** Content-type scopes available in the search UI. '' = entire index. */
export type SearchScope = '' | 'posts' | 'docs' | 'products';

/** Scope chips that narrow to a single product: docs of that product only. */
export type ProductScope = `product:${string}`;

/**
 * Active search context. `scope` is the content-type pill; `productScope`
 * (when set) further narrows that scope to one product's docs — the
 * page-derived default on a `/docs` page, matching GitHub's repo-scoped
 * search. Merged into every Pagefind query as filters.
 */
export interface SearchContext {
  scope: SearchScope;
  productScope?: ProductScope;
}

/** Localized copy the modal renders with (injected from Astro frontmatter). */
export interface SearchCopy {
  placeholder: string;
  noResults: string;
  loading: string;
  resultsFor: string; // '{query}' substituted at render time
  error: string;
  matchCount: string; // '{n}' substituted at render time
  close: string;
}

/** A single search result to render. */
export interface SearchResult {
  url: string;
  title: string;
  excerpt: string; // sanitized HTML (Pagefind escapes everything it emits)
  subTitle?: string;
  subUrl?: string;
}

let bundlePath: string | null = null;
let pagefind: any = null;
let pagefindPromise: Promise<any> | null = null;
let initPromise: Promise<void> | null = null;

/** Asset base (e.g. '/astro-content-hub/' or '/') the bundle lives under.
 *  Injected once by SearchModal.astro. */
export function configureSearch(base: string): void {
  bundlePath = `${base.replace(/\/$/, '')}/pagefind/pagefind.js`;
  // A reconfigure invalidates any cached import (e.g. after a locale change
  // that points at a different base).
  pagefind = null;
  pagefindPromise = null;
  initPromise = null;
}

async function ensurePagefind(): Promise<any> {
  if (!bundlePath) {
    // A page that has no bundle path simply won't search; the modal still
    // renders its shell (init flag not set).
    throw new Error('Search not configured');
  }
  // Cache the promise, not just the resolved module: if the bundle is missing
  // (e.g. dev server before the first build, or an index not yet generated),
  // a failed import would otherwise retry on every keystroke and spam 404s.
  if (!pagefindPromise) {
    pagefindPromise = loadPagefindBundle(bundlePath).then((pf) => {
      // Explicit basePath: with a blob:-URL import there is no
      // document.currentScript for pagefind to infer the bundle location
      // from, so point it at base/pagefind/ ourselves.
      return pf.options?.({ basePath: bundlePath!.replace(/pagefind\.js$/, '') }).then(() => pf);
    }).catch((err) => {
      pagefindPromise = null; // allow a retry after a successful index build
      throw err;
    });
  }
  pagefind ??= await pagefindPromise;
  return pagefind;
}

/** Load the Pagefind bundle without going through Vite's module resolver.
 *
 *  The bundle lives in public/ (dev) and dist/ (prod), both served under
 *  /<base>/pagefind/pagefind.js. Importing it via `import()` would make Vite
 *  try to transform a /public file (it refuses: "should not be imported from
 *  source code"). Fetching the text and importing it from a blob: URL works
 *  in both environments — blob imports are never rewritten by Vite — and keeps
 *  the module's own base-path detection intact (we also pass basePath
 *  explicitly via options()).
 */
async function loadPagefindBundle(path: string): Promise<any> {
  const res = await fetch(path, { credentials: 'same-origin' });
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  const code = await res.text();
  const blob = new Blob([code], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);
  try {
    return await import(/* @vite-ignore */ url);
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Debounce wrapper that still returns a promise for the latest call. */
function debounce<A extends unknown[], R>(
  fn: (...args: A) => Promise<R>,
  ms: number,
): (...args: A) => Promise<R> {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let last: { args: A; resolve: (v: R) => void; reject: (e: unknown) => void } | null = null;
  const run = () => {
    if (!last) return;
    const { args, resolve, reject } = last;
    last = null;
    fn(...args).then(resolve, reject);
  };
  return (...args: A) =>
    new Promise<R>((resolve, reject) => {
      if (timer) clearTimeout(timer);
      last = { args, resolve, reject };
      timer = setTimeout(run, ms);
    });
}

/** Run a search. Debounced: fast typing coalesces into one query. */
export const search = debounce(
  async (
    term: string,
    context: SearchContext,
    opts: { signal?: AbortSignal } = {},
  ): Promise<SearchResult[] | null> => {
    if (!term.trim()) return [];
    const pf = await ensurePagefind();
    if (opts.signal?.aborted) return null;
    const { scope, productScope } = context;
    const filters = scope ? { scope, ...(productScope ? { product: productScope.slice('product:'.length) } : {}) } : undefined;
    const res = await pf.search(term, { filters });
    if (opts.signal?.aborted) return null;
    const results = await Promise.all(
      res.results.slice(0, 20).map(async (r: any) => {
        const d = await r.data();
        const sub = d.sub_results?.[0];
        return {
          url: d.url,
          title: d.meta?.title ?? d.title ?? 'Untitled',
          excerpt: sub?.excerpt ?? d.excerpt ?? '',
          subTitle: sub?.title !== d.meta?.title ? sub?.title : undefined,
          subUrl: sub?.url,
        } satisfies SearchResult;
      }),
    );
    return results;
  },
  150,
);
/** Type-ahead preload so the index is warm by the time the query lands. */
export const preload = debounce(async (term: string): Promise<void> => {
  if (!term.trim()) return;
  const pf = await ensurePagefind();
  await pf.preload?.(term);
}, 80);
/** Initialize the Pagefind runtime (loads the per-language index). */
export function initSearch(): Promise<void> {
  if (!initPromise) {
    initPromise = ensurePagefind()
      .then((pf) => pf.init?.())
      .catch(() => {
        initPromise = null; // allow a retry on next open
      });
  }
  return initPromise;
}

/** Forget the loaded runtime (used when the current page's language
 *  cannot change without a reload; kept for completeness). */
export function destroySearch(): void {
  pagefind = null;
  pagefindPromise = null;
  initPromise = null;
}
