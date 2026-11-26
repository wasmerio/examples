import rss from '@astrojs/rss';
import { articles, articleUrl, articleSummary } from './content';
import { getTranslations, type Lang } from '../i18n';
export async function feed(lang: Lang, site: URL | undefined, collection: 'posts' | 'seriesPosts' = 'posts') {
 const t = getTranslations(lang);
 const items = await Promise.all((await articles(lang, collection)).map(async post => ({ title: post.data.title, description: await articleSummary(post), pubDate: post.data.pubDate, link: articleUrl(post), author: post.data.author, categories: post.data.tags })));
 return rss({ title: `${t.siteTitle} · ${collection === 'posts' ? t.latest : t.nav.series}`, description: t.siteTitle, site: site!, items, customData: `<language>${lang === 'zh' ? 'zh-cn' : 'en'}</language>` });
}
