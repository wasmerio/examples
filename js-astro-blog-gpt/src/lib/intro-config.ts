import type { BlogConfig } from '../types/config';

export const introRoutes = [
  'posts',
  'categories',
  'tags',
  'archives',
  'links',
] as const;
export function introPageSlug(
  config: BlogConfig,
  route: string,
): string | undefined {
  const item = [...config.sidebar.items, ...config.sidebar.menu].find(
    (item) => item.type === 'builtin' && item.route === route && item.page,
  );
  return item?.type === 'builtin' ? item.page : undefined;
}
