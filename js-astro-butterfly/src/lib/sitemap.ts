import { getCollection } from 'astro:content';
import { getPosts, postUrl, getTags, getCategories } from './posts';
import { url, absolute } from './url';

/** Indexable URLs (posts, pages, taxonomies) with last-modified dates. */
export async function sitemapEntries() {
  const posts = await getPosts();
  const pages = await getCollection('pages');
  const latest = posts[0]?.data.updated ?? new Date();
  const entries: { loc: string; lastmod: Date }[] = [
    { loc: url('/'), lastmod: latest },
    ...posts.map((p) => ({ loc: postUrl(p), lastmod: p.data.updated })),
    ...pages.map((p) => ({ loc: url(`/${p.id}/`), lastmod: p.data.date ?? latest })),
    { loc: url('/archives/'), lastmod: latest },
    { loc: url('/tags/'), lastmod: latest },
    { loc: url('/categories/'), lastmod: latest },
    ...(await getTags()).map((t) => ({ loc: t.url, lastmod: t.posts[0].data.updated })),
    ...(await getCategories()).map((c) => ({ loc: c.url, lastmod: c.posts[0].data.updated })),
  ];
  return entries.map((e) => ({ ...e, loc: encodeURI(absolute(e.loc)) }));
}
