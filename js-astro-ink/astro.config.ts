import { defineConfig } from 'astro/config'

// UnoCSS integration
import unocss from '@unocss/astro'
// Sitemap generation (https://docs.astro.build/en/guides/integrations-guide/sitemap)
import postSitemap from './src/plugins/post-sitemap.ts'
import { unified } from '@astrojs/markdown-remark'
// KaTeX math rendering: $...$ / $$...$$ in Markdown
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

// Shiki code-block pipeline (ported from astro-theme-pure)
import {
  addCollapse,
  addCopyButton,
  addLanguage,
  addTitle,
  updateStyle
} from './src/plugins/shiki-custom-transformers.ts'
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerRemoveNotationEscape
} from './src/plugins/shiki-official/transformers.ts'
// Lazy-load Markdown images
import rehypeImageAttributes from './src/plugins/rehype-image-attributes.ts'
import rehypeContentFeatures from './src/plugins/rehype-content-features.ts'
import rehypeBaseLinks from './src/plugins/rehype-base-links.ts'

// Sub-path base, used when deployed under a project Pages URL
// (e.g. /astro-theme-ink/). Empty locally & for user/project root deploys.
const base = process.env.BASE_PATH || ''

// https://astro.build/config
export default defineConfig({
  // Real site URL — also injected by the GitHub Pages deploy workflow.
  // Needed for sitemap & canonical links.
  site: process.env.SITE_URL || 'https://example.com',

  // Sub-path base (empty locally & for root deploys).
  base: base || undefined,

  // The site is fully static, so we can prerender everything.
  output: 'static',
  // A former permalink must never shadow another page (including paginated lists).
  prerenderConflictBehavior: 'error',

  // Preserve Astro 6's HTML-aware whitespace behavior. Astro 7 defaults to
  // JSX whitespace rules, which can remove spaces between adjacent inline elements.
  compressHTML: true,

  // Prefetch every internal link on hover/scroll for instant navigation
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },

  // [Markdown]
  markdown: {
    // Keep the unified pipeline for math, image attributes, site links and content detection.
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [
        rehypeImageAttributes,
        [rehypeBaseLinks, base],
        rehypeKatex,
        rehypeContentFeatures
      ]
    }),
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark'
      },
      transformers: [
        // Notation: `[!code diff]` / `[!code highlight]` etc.
        // @ts-ignore — multiple copies of @shikijs/types can confuse TS
        transformerNotationDiff(),
        // @ts-ignore
        transformerNotationHighlight(),
        // @ts-ignore
        transformerRemoveNotationEscape(),
        // Structure & controls
        // @ts-ignore
        updateStyle(),
        // @ts-ignore
        addTitle(),
        // @ts-ignore
        addLanguage(),
        // @ts-ignore
        addCopyButton(2000, base), // timeout in ms
        // @ts-ignore
        addCollapse(15, base) // max lines that needs to collapse
      ]
    }
  },

  integrations: [unocss(), ...postSitemap(base)]
})
