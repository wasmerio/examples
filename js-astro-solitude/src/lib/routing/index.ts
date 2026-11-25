import {
  getPosts,
  getPages,
  homePosts,
  paginate,
  taxonomy,
  contentPath,
  assertUniquePaths,
  type Post,
  type Page,
} from '@/lib/content';
import { config, cfg, t } from '@/lib/site';
export interface Route {
  path: string;
  kind: 'home' | 'post' | 'page' | 'taxonomy' | 'term' | 'redirect';
  title: string;
  entry?: Post | Page;
  posts?: Post[];
  current?: number;
  total?: number;
  taxonomy?: 'tags' | 'categories' | 'series';
  type?: string;
  target?: string;
}
export async function getRoutes(): Promise<Route[]> {
  const posts = await getPosts(),
    pages = await getPages();
  const chunks = paginate(homePosts(posts), config.pagination);
  const routes: Route[] = chunks.map((items, i) => ({
    path: i ? `/page/${i + 1}/` : '/',
    kind: 'home',
    title: config.title,
    posts: items,
    current: i + 1,
    total: chunks.length,
  }));
  for (const entry of posts)
    routes.push({
      path: contentPath(entry),
      kind: 'post',
      title: entry.data.title,
      entry,
      type: 'post',
    });
  for (const kind of ['tags', 'categories', 'series'] as const) {
    routes.push({
      path: `/${kind}/`,
      kind: 'taxonomy',
      title: t(kind),
      taxonomy: kind,
    });
    for (const group of taxonomy(posts, kind))
      routes.push({
        path: group.path,
        kind: 'term',
        title: group.name,
        posts: group.posts,
        taxonomy: kind,
      });
  }
  const defaults: [string, string, string][] = [
    ['/archives/', 'archives', t('allPosts')],
    ['/about/', 'about', t('about')],
    ['/links/', 'links', t('links')],
    ['/equipment/', 'kit', t('equipment')],
    ['/music/', 'music', t('music')],
    ['/message/', 'message', t('message')],
    ['/brevity/', 'brevity', t('brevity')],
    ['/recentcomments/', 'recentcomment', t('recentComments')],
  ];
  for (const [path, type, title] of defaults)
    if (!pages.some((p) => contentPath(p) === path))
      routes.push({ path, kind: 'page', type, title });
  for (const entry of pages)
    routes.push({
      path: contentPath(entry),
      kind: 'page',
      title: entry.data.title,
      entry,
      type: entry.data.type ?? 'page',
    });
  for (const entry of [...posts, ...pages])
    for (const alias of entry.data.aliases)
      routes.push({
        path: contentPath({
          id: '',
          collection: 'pages',
          data: { url: alias },
        }),
        kind: 'redirect',
        title: entry.data.title,
        target: contentPath(entry),
      });
  assertUniquePaths([
    ...routes.map((r) => r.path),
    '/404.html',
    '/index.xml',
    '/search.xml',
    '/links.json',
    '/sitemap.xml',
    '/robots.txt',
    ...(cfg.pwa.enable ? [cfg.pwa.manifest] : []),
  ]);
  return routes;
}
