import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import expressiveCode from 'astro-expressive-code';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import config from './src/lib/config';
import contentBundles from './src/integrations/content-bundles';
import localeRoutes from './src/integrations/locale-routes';
import relativeLinks from './src/integrations/relative-links';
import { hasLocalePrefix, localeHref } from './src/lib/locale-routing';
import remarkMath from 'remark-math';
import rehypeMath from './src/plugins/rehype-math';
import remarkCallouts from './src/plugins/remark-callouts';
import { unified, type RemarkPlugins } from '@astrojs/markdown-remark';

// Parse TeX even when rendering is disabled so MDX never treats formula braces
// as JavaScript expressions. Without KaTeX it falls back to source code.
const remarkPlugins: RemarkPlugins = [
  remarkMath,
  [
    remarkCallouts,
    {
      defaultLocale: config.site.defaultLocale,
      locales: config.site.locales,
      enabled: config.article.callouts,
    },
  ],
];
const excludedSitemapPaths = new Set([
  `${config.site.base}404/`,
  `${config.site.base}404.html`,
  ...config.site.locales.map((locale) =>
    localeHref(config.site, locale, 'search/'),
  ),
]);

export default defineConfig({
  site: config.site.url,
  base: config.site.base,
  output: 'static',
  trailingSlash: 'always',
  markdown: {
    processor: unified({
      remarkPlugins,
      rehypePlugins: [[rehypeMath, { enabled: config.article.math }]],
    }),
  },
  integrations: [
    localeRoutes(config),
    contentBundles(config),
    expressiveCode({
      plugins: [pluginLineNumbers()],
      themes: [
        config.appearance.codeThemes.light,
        config.appearance.codeThemes.dark,
      ],
      themeCssSelector: (theme) =>
        theme.name === config.appearance.codeThemes.dark
          ? '[data-theme="dark"]'
          : '[data-theme="light"]',
      useDarkModeMediaQuery: false,
      defaultProps: { showLineNumbers: config.appearance.showCodeLineNumbers },
      styleOverrides: { borderRadius: '0.8rem', codeFontSize: '0.875rem' },
    }),
    mdx(),
    icon({ include: { lucide: ['*'], 'simple-icons': ['*'] } }),
    sitemap({
      filter: (page) => {
        const path = new URL(page).pathname;
        if (
          config.site.localePrefixPolicy === 'redirect-to-default' &&
          !hasLocalePrefix(path, config.site)
        )
          return false;
        // Individual article visibility is enforced again by build-search.mjs.
        return !excludedSitemapPaths.has(path);
      },
    }),
    relativeLinks(config.site.baseUrl),
  ],
  vite: { plugins: [tailwindcss()] },
});
