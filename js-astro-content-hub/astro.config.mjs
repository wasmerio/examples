import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import { rewriteRelativeMdLinks } from './src/lib/remark-rewrite-links.mjs';
import { addHeadingIds } from './src/lib/heading-ids.mjs';

// Sub-path the site is served under. '/' for a root deploy (custom domain,
// Cloudflare Pages root); '/astro-content-hub/' for a GitHub Pages project
// path (https://<owner>.github.io/<repo>/). Built assets are prefixed with it,
// and `withBase()` in lib/i18n.ts reads it back via `import.meta.env.BASE_URL`
// to prefix every internal link/asset/redirect.
const base = '/astro-content-hub/';

export default defineConfig({
  // Full deployed URL (origin + sub-path, no trailing slash) for canonical,
  // Open Graph, and hreflang absolute URLs. For a project-path deploy the
  // sub-path here must match `base` below.
  site: 'https://awareride.github.io/astro-content-hub',
  base,
  output: 'static',

  markdown: {
    // Astro 7 uses Sätteri as its Markdown processor. We pass a Sätteri mdast
    // plugin that rewrites relative `.md` links in markdown bodies to hub
    // routes at build time, so source files can keep GitHub-friendly relative
    // links. `base` is passed in because the plugin is a plain .mjs loaded at
    // config time and cannot read `import.meta.env.BASE_URL`.
    processor: satteri({
      mdastPlugins: [rewriteRelativeMdLinks(base)],
      // Adds `id` attributes to h1-h4 so anchor links and the TOC resolve to
      // real in-page targets. The built-in heading-ids plugin still populates
      // render().headings (the TOC data) and reuses these ids for its array.
      hastPlugins: [addHeadingIds()],
    }),
    shikiConfig: {
      theme: 'css-variables',
    },
  },

  integrations: [
    // MDX support: registers the `.mdx` content entry type (via
    // addContentEntryType) so docs/posts collections can contain MDX files.
    // The template ships no built-in component library for MDX; authors who
    // want interactive docs can import their own .astro components (or use
    // plain .md with inline <script>). See docs/en/authoring.md
    // "Markdown & MDX".
    mdx(),
    // Generates /sitemap-index.xml from the build. Uses `site` for absolute
    // URLs and respects `base`. Automatically embeds hreflang alternates for
    // each page (Layout.astro already emits <link rel="alternate" hreflang>).
    // The 404 page is excluded so it is never advertised to crawlers.
    sitemap({
      filter: (page) => !page.includes('/404'),
      // Group each page's locale versions into <xhtml:link rel="alternate">
      // hreflang entries. `en` is the default (no URL prefix); `zh-Hans` lives
      // under /zh-Hans/. The HTML head already emits hreflang too; this adds the
      // sitemap-level grouping so crawlers see the locale relations in one place.
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', 'zh-Hans': 'zh-Hans' },
      },
    }),
  ],
});
