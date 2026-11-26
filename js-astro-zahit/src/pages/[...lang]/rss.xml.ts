import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { ui, defaultLang } from '../../i18n/ui';
import { useTranslations } from '../../i18n/utils';
import { SITE_CONFIG } from '../../config';
import { getRelativeLocaleUrl } from 'astro:i18n';

export async function getStaticPaths() {
  return Object.keys(ui).map((lang) => ({
    params: { lang: lang === defaultLang ? undefined : lang },
  }));
}

export async function GET(context: any) {
  const { lang } = context.params;
  const currentLang = lang || defaultLang;
  const t = useTranslations(currentLang as any);
  
  const posts = await getCollection('blog', (post) => {
    return post.id.startsWith(`${currentLang}/`);
  });
  
  posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: `Zahit | ${t('home.title')}`,
    description: t('home.subtitle') || SITE_CONFIG.description,
    site: context.site || SITE_CONFIG.url,
    items: posts.map((post) => {
      const slugWithoutLang = post.id.replace(`${currentLang}/`, '');
      const htmlContent = post.rendered?.html;
      const bodyContent = post.body ? `<content:encoded><![CDATA[${post.body}]]></content:encoded>` : '';
      
      const postLink = post.data.external_url || getRelativeLocaleUrl(currentLang, `blog/${slugWithoutLang}`);
      
      return {
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link: postLink,
        content: htmlContent,
        customData: !htmlContent ? bodyContent : '',
      };
    }),
  });
}

