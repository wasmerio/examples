// Base-aware URL builder.
//
// Florin runs at the site root by default (`npm run dev` → http://localhost:4321),
// but can also be mounted under a sub-path by building with a base:
//   FLORIN_BASE=/florin/ npm run build   → links become /florin/overview/, …
// Every in-app link goes through url() so both modes stay correct.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

// Page links get a trailing slash to match the directory-per-page output Astro
// emits — hosts that canonicalise to the slashed form then serve them directly
// instead of answering every navigation with a 301. File paths (/favicon.svg)
// and the special 404 route are left alone.
export const url = (path: string) => {
  const slashed = /\.[a-z0-9]+$/i.test(path) || path.endsWith('/') || path === '/404' ? path : `${path}/`;
  return `${BASE}${slashed}`;
};
