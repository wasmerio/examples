import type { AstroIntegration } from 'astro';
import type { BlogConfig } from '../types/config';

const templates = [
  ['/', 'index.astro'],
  ['/archives', 'archives.astro'],
  ['/links', 'links.astro'],
  ['/search', 'search.astro'],
  ['/search-data.json', 'search-data.json.ts'],
  ['/rss.xml', 'rss.xml.ts'],
  ['/posts', 'posts/index.astro'],
  ['/posts/page/[page]', 'posts/page/[page].astro'],
  ['/posts/[...slug]', 'posts/[...slug].astro'],
  ['/og/[...slug].png', 'og/[...slug].png.ts'],
  ['/page-og/[...slug].png', 'page-og/[...slug].png.ts'],
  ['/[taxonomy]', '[taxonomy]/index.astro'],
  ['/[taxonomy]/[...term]', '[taxonomy]/[...term].astro'],
  ['/[...page]', '[...page].astro'],
] as const;

/** Register final URLs directly: the default language never needs a redirect chain. */
export default function localeRoutes(config: BlogConfig): AstroIntegration {
  return {
    name: 'bloggpt-locale-routes',
    hooks: {
      'astro:config:setup': ({ injectRoute }) => {
        for (const locale of config.site.locales) {
          const prefix =
            config.site.localePrefixPolicy === 'omit-default-prefix' &&
            locale === config.site.defaultLocale
              ? ''
              : `/${locale}`;
          for (const [route, file] of templates)
            injectRoute({
              pattern: `${prefix}${route === '/' ? '' : route}` || '/',
              entrypoint: new URL(
                `../routes/localized/${file}`,
                import.meta.url,
              ),
              prerender: true,
            });
        }
        if (
          !config.site.localePrefixPolicy ||
          config.site.localePrefixPolicy === 'redirect-to-default'
        )
          injectRoute({
            pattern: '/[...unprefixed]',
            entrypoint: new URL('../routes/redirect.astro', import.meta.url),
            prerender: true,
          });
      },
    },
  };
}
