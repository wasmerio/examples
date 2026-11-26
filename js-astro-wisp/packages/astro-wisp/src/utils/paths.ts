/** Resolve an internal site path against Astro's configured base path. */
export function sitePath(base: string, path: string): string {
  if (!path || path.startsWith('#') || path.startsWith('//') || /^[a-z][a-z\d+.-]*:/i.test(path))
    return path;
  const prefix = base === '/' ? '' : `/${base.replace(/^\/+|\/+$/g, '')}`;
  const suffix = path === '/' ? '/' : `/${path.replace(/^\/+/, '')}`;
  return prefix && (suffix === prefix || suffix.startsWith(`${prefix}/`))
    ? suffix
    : `${prefix}${suffix}`;
}
