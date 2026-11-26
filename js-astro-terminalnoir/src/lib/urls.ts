type Locale = 'en' | 'pt-br';

const normalize = (value: string) => '/' + value.split('/').filter(Boolean).join('/');

export function route(path: string, locale: Locale, base = '/'): string {
  const [pathname, hash] = path.split('#');
  const parts = [base, locale === 'en' ? '' : locale, pathname];
  const result = normalize(parts.join('/'));
  return hash === undefined ? result : `${result}#${hash}`;
}

export function alternate(pathname: string, locale: Locale, base = '/'): string {
  const prefix = normalize(base);
  let local = pathname;
  if (prefix !== '/' && (local === prefix || local.startsWith(prefix + '/'))) local = local.slice(prefix.length) || '/';
  local = local.replace(/^\/pt-br(?=\/|$)/, '') || '/';
  return route(local, locale, base);
}

export function asset(path: string, base = '/'): string {
  const prefix = normalize(base);
  const file = normalize(path);
  return prefix === '/' ? file : `${prefix}${file}`;
}
