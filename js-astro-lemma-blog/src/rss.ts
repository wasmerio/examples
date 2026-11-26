import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE, getPosts, postUrl, prefix, ui, type Lang } from './i18n';

export const rssFeed = (lang: Lang) => async (context: APIContext) => {
  const posts = await getPosts(lang);
  // The channel links to the home page of its language, and to itself (atom:link).
  const home = new URL(`${prefix(lang)}/`, context.site!);
  return rss({
    title: SITE.title,
    description: ui[lang].description,
    site: home,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: `<language>${lang === 'zh' ? 'zh-CN' : 'en'}</language><atom:link href="${new URL('rss.xml', home).href}" rel="self" type="application/rss+xml"/>`,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: postUrl(post),
    })),
  });
};
