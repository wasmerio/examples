type PostData = { slug: string; date: Date };

export function validatePostPrefix(prefix: string): void {
  if (!prefix) return;
  const normalized = prefix.replace(/\/$/, '');
  if (
    prefix.startsWith('/') ||
    normalized
      .split('/')
      .some(
        (segment) =>
          !segment ||
          segment === '.' ||
          segment === '..' ||
          !/^[\p{L}\p{N}_~.-]+$/u.test(
            segment.replace(/\[(year|month|day)\]/g, '2000'),
          ),
      ) ||
    /[\\?#%\s]/.test(prefix) ||
    normalized.split('/')[0] === 'page'
  )
    throw new Error(
      'posts.pathPrefix must contain safe path segments and only [year], [month], or [day] placeholders (optional trailing slash, no leading slash or reserved page prefix).',
    );
}

/** Publication dates use the site timezone, consistently with archives and statistics. */
export function postPath(
  data: PostData,
  prefix = '',
  timezone = 'UTC',
): string {
  if (!prefix) return data.slug;
  validatePostPrefix(prefix);
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
      .formatToParts(data.date)
      .map((part) => [part.type, part.value]),
  );
  const expanded = prefix
    .replace(/\/$/, '')
    .replace(/\[(year|month|day)\]/g, (_, key: string) => parts[key]);
  return [expanded, data.slug].filter(Boolean).join('/');
}
