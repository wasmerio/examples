// Every internal link goes through link(), so the site works both at the
// root of a domain and in a subfolder such as /astro-blog-template/.

const base = import.meta.env.BASE_URL.replace(/\/+$/, '');

/** Turn a site path like "/about/" into a link that respects the base path. */
export function link(path: string = '/'): string {
  if (/^([a-z][a-z0-9+.-]*:|\/\/|#)/i.test(path)) return path;
  return `${base}/${path.replace(/^\/+/, '')}`;
}

/** URL-safe version of a tag name: "Plain HTML" becomes "plain-html". */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
