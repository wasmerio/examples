import { parseFragment, type DefaultTreeAdapterTypes } from 'parse5'
import type { SearchSection } from './search'

const blockElements = new Set([
  'article',
  'aside',
  'blockquote',
  'br',
  'dd',
  'div',
  'dt',
  'figcaption',
  'hr',
  'li',
  'p',
  'pre',
  'section',
  'td',
  'th',
  'tr'
])
const hiddenElements = new Set(['button', 'noscript', 'script', 'style', 'svg', 'template'])

/** Store positions in one copy of the rendered text. Use the same heading IDs as the article. */
export function extractSearchContent(html: string) {
  let content = ''
  const sections: SearchSection[] = []
  const append = (value: string) => {
    const text = value.replace(/\s+/g, ' ')
    content += content && !content.endsWith(' ') ? text : text.trimStart()
  }

  function visit(node: DefaultTreeAdapterTypes.ChildNode) {
    if ('value' in node) return append(node.value)
    if (!('tagName' in node) || hiddenElements.has(node.tagName)) return
    if (
      node.attrs.some(
        (a) => a.name === 'hidden' || (a.name === 'aria-hidden' && a.value === 'true')
      )
    )
      return

    const heading = /^h[1-6]$/.test(node.tagName)
    const block = heading || blockElements.has(node.tagName)
    if (block) append(' ')
    const start = content.length
    if (node.tagName === 'img') {
      append(node.attrs.find((a) => a.name === 'alt')?.value ?? '')
    } else {
      // Index the highlighted code without labels or controls from Shiki's wrapper.
      const children = node.attrs.some(
        (a) => a.name === 'class' && a.value.split(/\s+/).includes('astro-code')
      )
        ? node.childNodes.filter((child) => child.nodeName === 'pre')
        : node.childNodes
      children.forEach(visit)
    }
    if (heading) {
      const id = node.attrs.find((a) => a.name === 'id')?.value
      const title = content.slice(start).trim()
      if (id && title) sections.push({ id, title, start })
    }
    if (block) append(' ')
  }

  parseFragment(html).childNodes.forEach(visit)
  return { content: content.trimEnd(), sections }
}
