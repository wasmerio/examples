// Prefix for root-absolute paths. Empty when the site is served from the root of a domain.
// Astro sets BASE_URL from the `base` option (the BASE_PATH env var, see astro.config.mjs).
const BASE: string = import.meta.env.BASE_URL.replace(/\/+$/, '');

export function withBase(path: string): string {
  return `${BASE}${path.startsWith('/') ? path : `/${path}`}`;
}

export function withoutBase(pathname: string): string {
  if (BASE === '' || !pathname.startsWith(BASE)) return pathname;
  return pathname.slice(BASE.length) || '/';
}
