import { pageLocale, routeLocales } from '../../../lib/i18n';
import type { APIRoute } from 'astro';
import config from '../../../lib/config';
import { postsFor, type Post } from '../../../lib/content';
import { shareCover } from '../../../lib/share-cover';
import { articleFeatures } from '../../../lib/article-options';

export async function getStaticPaths({
  routePattern,
}: import('astro').GetStaticPathsOptions) {
  const paths = [];
  for (const lang of routeLocales(routePattern))
    for (const post of await postsFor(lang, true))
      if (articleFeatures(post.data, config.article).shareCover)
        paths.push({ params: { slug: post.data.slug }, props: { post } });
  return paths;
}
export const GET: APIRoute = async ({ props, routePattern }) => {
  const post = props.post as Post;
  return new Response(
    new Uint8Array(
      await shareCover(
        post.data.title,
        post.data.description,
        config,
        pageLocale(routePattern),
      ),
    ),
    { headers: { 'Content-Type': 'image/png' } },
  );
};
