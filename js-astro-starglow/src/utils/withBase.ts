const base = import.meta.env.BASE_URL.replace(/\/+$/, "");
const baseRoot = base === "" ? "/" : `${base}/`;

/** "/en/posts/foo" → "/posts/foo", "/en" → "/"; other paths unchanged. */
export function stripLocale(pathname: string, locale: string): string {
  const prefix = `/${locale}`;
  if (pathname === prefix) return "/";
  if (pathname.startsWith(`${prefix}/`)) return pathname.slice(prefix.length);
  return pathname;
}

/** Strips the Astro `base` prefix from an absolute pathname. */
export function stripBase(pathname: string): string {
  if (base === "") {
    return pathname;
  }
  if (pathname === base) {
    return "/";
  }
  if (pathname.startsWith(baseRoot)) {
    const stripped = pathname.slice(base.length);
    return stripped === "" ? "/" : stripped;
  }
  return pathname;
}

/** Prefixes a file path with the Astro `base`. */
export function getAssetPath(path: string): string {
  const normalizedPath = path.replace(/^\/+/, "");

  if (!normalizedPath) {
    return base === "" ? "/" : base;
  }
  return baseRoot + normalizedPath;
}
