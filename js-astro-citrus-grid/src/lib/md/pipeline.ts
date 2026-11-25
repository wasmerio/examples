import { pathToFileURL } from 'node:url'
import type { Options as AutolinkOptions } from 'rehype-autolink-headings'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import remarkBreaks from 'remark-breaks'
import remarkEmoji from 'remark-emoji'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { rehypeCodeBlock } from './rehypeCodeBlock'
import { rehypeExternalLinks } from './rehypeExternalLinks'
import { rehypeImages } from './rehypeImages'
import { rehypeRelativeLinks } from './rehypeRelativeLinks'
import { rehypeTableWrap } from './rehypeTableWrap'
import { remarkContainers } from './remarkContainers'
import { remarkDiff } from './remarkDiff'

export interface RenderOptions {
  filePath?: string
  site: string
}

function buildProcessor(site: string) {
  return (
    unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkBreaks)
      .use(remarkEmoji)
      .use(remarkMath)
      .use(remarkDiff)
      .use(remarkContainers)
      .use(remarkRehype, {
        allowDangerousHtml: true,
        footnoteLabel: 'footnote',
        clobberPrefix: 'post-',
      })
      .use(rehypeKatex)
      .use(rehypeCodeBlock)
      .use(rehypeImages)
      .use(rehypeRelativeLinks)
      .use(rehypeExternalLinks, { site })
      .use(rehypeSlug)
      .use(rehypeAutolinkHeadings, {
        behavior: 'append',
        properties: { className: ['heading-anchor'], tabIndex: -1, ariaLabel: 'heading anchor' },
        content: { type: 'element', tagName: 'span', properties: {}, children: [] },
      } satisfies AutolinkOptions)
      .use(rehypeRaw)
      // 放在 rehypeRaw 之后：markdown 里手写的原生 <table> 也能包上表头栏
      .use(rehypeTableWrap)
      .use(rehypeStringify, { allowDangerousHtml: true })
  )
}

// 每次调用重建完整 unified 管线的初始化开销可观（RSS 生成会对每篇文章调用一次），
// 按 site 记忆化复用 processor
const processorCache = new Map<string, ReturnType<typeof buildProcessor>>()

export async function renderMarkdownHtml(source: string, options: RenderOptions): Promise<string> {
  let proc = processorCache.get(options.site)
  if (!proc) {
    proc = buildProcessor(options.site)
    processorCache.set(options.site, proc)
  }
  const file = options.filePath
    ? { value: source, path: pathToFileURL(options.filePath).href }
    : { value: source }
  const result = await proc.process(file as never)
  return String(result)
}
