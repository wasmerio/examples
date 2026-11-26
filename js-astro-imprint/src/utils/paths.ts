const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function pathFor(path = '') {
  const normalized = path.replace(/^\/+|\/+$/g, '');
  if (!normalized) return `${base || ''}/`;
  const suffix = /\.[a-z0-9]+$/i.test(normalized) ? '' : '/';
  return `${base}/${normalized}${suffix}`;
}
