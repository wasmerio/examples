import { pageLocale } from '../../lib/i18n';
import { localeInfo } from '../../lib/translations';
import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import config from '../../lib/config';
import { discoverablePosts, postHref } from '../../lib/content';
import { localize } from '../../lib/i18n';
export const GET: APIRoute = async ({ routePattern }) => {
  const lang = pageLocale(routePattern);
  const posts = (await discoverablePosts(lang)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
  return rss({
    title: localize(config.site.title, lang),
    description: localize(config.text.siteDescription, lang),
    site: config.site.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: postHref(post, lang),
    })),
    customData: `<language>${localeInfo(lang).lang}</language>`,
  });
};
