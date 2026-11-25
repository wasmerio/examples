import { getPosts, taxonomy } from '@/lib/content';
import { rss } from '@/lib/content/feeds';
export async function getStaticPaths() {
  const posts = await getPosts();
  return [
    { params: { feed: 'posts' }, props: { posts, title: 'Posts' } },
    ...(['categories', 'tags', 'series'] as const).flatMap((kind) => [
      { params: { feed: kind }, props: { posts, title: kind } },
      ...taxonomy(posts, kind).map((g) => ({
        params: { feed: decodeURI(g.path).replace(/^\/|\/$/g, '') },
        props: { posts: g.posts, title: g.name },
      })),
    ]),
  ];
}
export function GET({
  props,
}: {
  props: { posts: Awaited<ReturnType<typeof getPosts>>; title: string };
}) {
  return new Response(rss(props.posts, props.title), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
