import { unified } from '@astrojs/markdown-remark'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import swup from '@swup/astro'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import remarkBreaks from 'remark-breaks'
import remarkEmoji from 'remark-emoji'
import remarkMath from 'remark-math'
import { ensurePostSlugs } from './scripts/ensure-post-slugs.js'
import { generateLqips } from './scripts/generate-lqips.js'
import { updatePostUpdated } from './scripts/update-post-updated.js'
import enJson from './src/i18n/en.json'
import jaJson from './src/i18n/ja.json'
import zhJson from './src/i18n/zh.json'
import { rehypeCodeBlock } from './src/lib/md/rehypeCodeBlock.ts'
import { rehypeExternalLinks } from './src/lib/md/rehypeExternalLinks.ts'
import { rehypeImages } from './src/lib/md/rehypeImages.ts'
import { rehypeRawToElements } from './src/lib/md/rehypeRawToElements.ts'
import { rehypeRelativeLinks } from './src/lib/md/rehypeRelativeLinks.ts'
import { rehypeTableWrap } from './src/lib/md/rehypeTableWrap.ts'
import { remarkContainers } from './src/lib/md/remarkContainers.ts'
import { remarkDiff } from './src/lib/md/remarkDiff.ts'
import { siteConfig } from './src/lib/mergedSiteConfig.ts'
import { shouldIgnoreSwup } from './src/lib/url.ts'

const site = siteConfig.url

// 脚注标题走 i18n：markdown 处理器是构建期全局配置，取站点默认语言
const footnoteLabel = { zh: zhJson, ja: jaJson, en: enJson }[siteConfig.defaultLang].post.footnotes

export default defineConfig({
  site,
  server: { host: '::' },
  preview: { host: '::' },
  build: {
    inlineStylesheets: 'always',
  },
  markdown: {
    syntaxHighlight: false,
    processor: unified({
      gfm: true,
      smartypants: false,
      remarkRehype: { footnoteLabel, clobberPrefix: 'post-' },
      remarkPlugins: [remarkBreaks, remarkEmoji, remarkMath, remarkDiff, remarkContainers],
      rehypePlugins: [
        rehypeKatex,
        rehypeCodeBlock,
        rehypeImages,
        rehypeRawToElements,
        rehypeRelativeLinks,
        rehypeTableWrap,
        [rehypeExternalLinks, { site }],
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'append',
            properties: {
              className: ['heading-anchor'],
              tabIndex: -1,
              ariaLabel: 'Heading anchor',
            },
            content: { type: 'element', tagName: 'span', properties: {}, children: [] },
          },
        ],
      ],
    }),
  },
  integrations: [
    mdx(),
    swup({
      theme: false,
      animationClass: 'transition-swup-',
      containers: ['#swup-container'],
      smoothScrolling: false,
      cache: true,
      preload: { hover: true, visible: true },
      accessibility: true,
      progress: true,
      updateHead: true,
      updateBodyClass: false,
      globalInstance: true,
      ignore: shouldIgnoreSwup,
    }),
    sitemap(),
  ],
  vite: {
    server: {
      watch: {
        ignored: ['**/.pnpm-store/**', '**/dist/**'],
      },
    },
    plugins: [
      tailwindcss(),
      ensurePostSlugs(),
      generateLqips(),
      updatePostUpdated({ enabled: siteConfig.autoUpdatePostUpdated }),
    ],
    optimizeDeps: {
      include: [
        'photoswipe',
        'photoswipe/lightbox',
        'astro/virtual-modules/transitions-*.js',
        '@swup/astro/idle',
        '@swup/astro/serialise',
        '@swup/astro/client/Swup',
        '@swup/astro/client/SwupA11yPlugin',
        '@swup/astro/client/SwupHeadPlugin',
        '@swup/astro/client/SwupProgressPlugin',
        '@swup/astro/client/SwupPreloadPlugin',
        '@swup/astro/client/SwupScriptsPlugin',
      ],
    },
    build: {
      minify: 'esbuild',
      esbuildOptions: {
        minify: true,
        drop: ['debugger'],
        pure: ['console.log', 'console.debug'],
      },
      cssCodeSplit: true,
      cssMinify: 'lightningcss',
      assetsInlineLimit: 4096,
    },
  },
})
