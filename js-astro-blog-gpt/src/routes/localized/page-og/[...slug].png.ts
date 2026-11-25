import { pageLocale, routeLocales } from '../../../lib/i18n';
import type { APIRoute } from 'astro';
import config from '../../../lib/config';
import {
  textEntriesFor,
  isIntroOnly,
  type TextEntry,
} from '../../../lib/content';
import { shareCover } from '../../../lib/share-cover';
import { articleFeatures } from '../../../lib/article-options';
export async function getStaticPaths({
  routePattern,
}: import('astro').GetStaticPathsOptions) {
  const paths = [];
  for (const lang of routeLocales(routePattern))
    for (const page of await textEntriesFor('pages', lang))
      if (
        !isIntroOnly(page.data.slug) &&
        articleFeatures(page.data, config.article).shareCover
      )
        paths.push({ params: { slug: page.data.slug }, props: { page } });
  return paths;
}
export const GET: APIRoute = async ({ props, routePattern }) => {
  const page = props.page as TextEntry;
  return new Response(
    new Uint8Array(
      await shareCover(
        page.data.title,
        page.data.description,
        config,
        pageLocale(routePattern),
      ),
    ),
    { headers: { 'Content-Type': 'image/png' } },
  );
};
