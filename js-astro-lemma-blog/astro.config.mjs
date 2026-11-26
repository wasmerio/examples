// @ts-check
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkDirective from 'remark-directive';

// Every site setting comes from lemma.config.mjs.
//
// Local modules are imported with a hash of their sources (and of the data
// files they read), for two reasons:
// - Node caches imports for the life of the process, and Astro re-imports only
//   this file on change; without the hash a running dev server keeps old plugin code.
// - Astro caches rendered posts until the config changes; the hash is part of
//   the config (plugin options), so an edit re-renders every post.
const read = (/** @type {string} */ f) => (existsSync(new URL(f, import.meta.url)) ? readFileSync(new URL(f, import.meta.url)) : '');
const hash = (/** @type {string[]} */ files) => createHash('sha1').update(files.map(read).join('')).digest('hex').slice(0, 12);
const CONFIG = './lemma.config.mjs';
const { default: lemma } = await import(`${CONFIG}?v=${hash([CONFIG])}`);
const MODULES = [
  './plugins/remark-tikz.mjs',
  './plugins/remark-theorems.mjs',
  './plugins/remark-reading.mjs',
  './plugins/remark-cite.mjs',
  './plugins/rehype-mathjax4.mjs',
  './plugins/rehype-toc.mjs',
  './plugins/rehype-tables.mjs',
  './plugins/rehype-footnotes.mjs',
  './plugins/media.mjs',
  './plugins/shiki-themes.mjs',
  './plugins/lemma-theme.mjs',
  './plugins/about.mjs',
  './plugins/search.mjs',
];
const DATA = [lemma.bibliography.style, ...lemma.bibliography.files, './src/media-r2.json'];
const LOCAL = [CONFIG, ...MODULES, ...DATA];
const version = hash(LOCAL);
const [
  { default: remarkTikz },
  { default: remarkTheorems },
  { default: remarkReading },
  { default: remarkCite },
  { default: rehypeMathJax4, mathIntegration },
  { default: rehypeToc },
  { default: rehypeTables },
  { default: rehypeFootnotes },
  { default: remarkMedia, mediaIntegration },
  { default: codeThemes },
  { default: lemmaTheme },
  { aboutIntegration, SAMPLE },
  { searchIntegration },
] = await Promise.all(MODULES.map((f) => import(`${f}?v=${version}`)));
const url = (/** @type {string} */ f) => new URL(f, import.meta.url);
const posts = url('./src/content/posts/');
const tikzCache = url('./tikz-cache/');
const manifest = url('./src/media-r2.json');
// Video sizes from ffprobe, cached and committed like tikz-cache/. Not watched:
// the plugin writes it.
const dimensions = url('./src/media-dimensions.json');
const { macros, packages } = lemma.math;
const media = { posts, manifest, dimensions, maxBytes: lemma.media.maxBytes, r2: lemma.media.r2 };
// Code colors are checked against the code block background of each theme.
const themes = await codeThemes(lemma.code.themes, { light: lemma.theme.colors.light.surface, dark: lemma.theme.colors.dark.surface });
// hreflang codes of the supported locales.
const HREFLANG = { zh: 'zh-CN', en: 'en' };
// Sitemap lastmod, by URL path: a post's `updated`, else its `date`; a home
// page takes the newest of its posts. Read from the frontmatter, as the
// content collections do not exist yet when the config loads.
const lastmod = new Map();
for (const file of readdirSync(posts, { recursive: true, encoding: 'utf8' })) {
  const [, slug, lang] = file.replaceAll('\\', '/').match(/^(.+)\/(\w+)\.md$/) ?? [];
  if (!lemma.locales.list.includes(lang)) continue;
  const front = readFileSync(new URL(file, posts), 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
  const field = (/** @type {string} */ key) => front.match(new RegExp(`^${key}:\\s*['"]?([^'"\\s#]+)`, 'm'))?.[1];
  const when = field('updated') ?? field('date');
  if (field('draft') === 'true' || !when) continue;
  const iso = new Date(when).toISOString();
  const home = lang === lemma.locales.default ? '/' : `/${lang}/`;
  lastmod.set(`${home}posts/${slug}/`, iso);
  if (!(lastmod.get(home) >= iso)) lastmod.set(home, iso);
}

export default defineConfig({
  site: lemma.site.url,
  // The sample about page (LEMMA_ABOUT=sample) keeps a content cache of its
  // own; switching modes also changes this config, which clears the dev
  // server's content store, so neither profile is ever in the other's cache.
  cacheDir: SAMPLE ? './node_modules/.astro-sample' : './node_modules/.astro',
  integrations: [
    // Colors, font stacks, layout tokens and font files from the config.
    lemmaTheme(lemma.theme),
    // The home page formula, rendered like the math in posts.
    mathIntegration({ formula: lemma.site.intro.formula, macros, packages }),
    // hreflang alternates pair /posts/x/ with /en/posts/x/.
    sitemap({
      i18n: {
        defaultLocale: lemma.locales.default,
        locales: Object.fromEntries(lemma.locales.list.map((/** @type {keyof typeof HREFLANG} */ l) => [l, HREFLANG[l]])),
      },
      // Only lastmod: Google ignores changefreq and priority.
      serialize: (item) => {
        const date = lastmod.get(decodeURI(new URL(item.url).pathname));
        return date ? { ...item, lastmod: date } : item;
      },
    }),
    mediaIntegration(media),
    // Files the about page links to (cv.pdf); LEMMA_ABOUT=sample serves the sample profile.
    aboutIntegration(),
    // Pagefind index of the posts after a build (dist/pagefind/), served in dev from the last build.
    searchIntegration(),
    // Restart the dev server when the config, a local plugin or a data file changes.
    {
      name: 'watch-local-modules',
      hooks: {
        'astro:config:setup': ({ addWatchFile }) => LOCAL.forEach((f) => addWatchFile(url(f))),
      },
    },
  ],
  // Markdown images get a srcset and are scaled down for small screens.
  image: { layout: 'constrained' },
  i18n: {
    locales: lemma.locales.list,
    defaultLocale: lemma.locales.default,
    routing: { prefixDefaultLocale: false },
  },
  markdown: {
    // Unified (remark/rehype) pipeline, needed for remark-math and MathJax.
    processor: unified({
      // Off: punctuation stays exactly as typed (no curly quotes, no -- to en dash).
      smartypants: false,
      // GFM is added below instead, without single-tilde strikethrough: `~` is a
      // TeX tie (\cite[Thm.~3]{key}, Section~\ref{x}), and two of them in one
      // paragraph would strike out the text between. ~~text~~ still works.
      gfm: false,
      remarkPlugins: [
        [remarkGfm, { singleTilde: false }],
        remarkMath,
        remarkDirective,
        [remarkTikz, { cache: tikzCache, macros }],
        [remarkTheorems, { labels: lemma.theorems.labels }],
        [remarkReading, lemma.reading],
        [remarkCite, { bibliographies: lemma.bibliography.files.map(url), style: url(lemma.bibliography.style) }],
        [remarkMedia, media],
      ],
      rehypePlugins: [[rehypeMathJax4, { macros, packages, version }], rehypeToc, rehypeTables, rehypeFootnotes],
    }),
    shikiConfig: {
      themes,
      defaultColor: false,
    },
  },
});
