import { defaultTreeAdapter as tree, html, parseFragment, serialize } from 'parse5'
import type { DefaultTreeAdapterTypes as DOM } from 'parse5'

const prose = new Set(
  'a abbr b blockquote br caption cite code dd del details div dl dt em figcaption figure h1 h2 h3 h4 h5 h6 hr i img kbd li mark ol p pre q s samp small strong sub summary sup table tbody td tfoot th thead tr u ul'.split(
    ' '
  )
)
const math = new Set(
  'math semantics mrow mi mo mn ms mtext mspace mfrac msqrt mroot msup msub msubsup munder mover munderover mmultiscripts mprescripts none mtable mtr mtd menclose mstyle mpadded mphantom'.split(
    ' '
  )
)
const omit = new Set(
  'button script style iframe template form noscript object textarea annotation annotation-xml'.split(
    ' '
  )
)
const attributes = new Set(
  'alt title width height colspan rowspan start reversed scope dir lang display mathvariant stretchy fence'.split(
    ' '
  )
)

function absoluteFeedUrl(value: string, article: URL, siteBase: URL, isLink: boolean) {
  if (!value) return null
  const url = URL.parse(value, article)
  if (!url) return null
  if (isLink && (url.protocol === 'mailto:' || url.protocol === 'tel:')) return url.href
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null

  // Local assets produced by Astro already include the deployment prefix.
  // Handwritten image paths under public/ may still be relative to the root.
  const basePath = siteBase.pathname.replace(/\/$/, '')
  if (
    basePath &&
    value.startsWith('/') &&
    !value.startsWith('//') &&
    url.origin === siteBase.origin &&
    url.pathname !== basePath &&
    !url.pathname.startsWith(basePath + '/')
  ) {
    url.pathname = basePath + url.pathname
  }
  return url.href
}

/** Render a portable version of the article from the same HTML as the website. */
export function feedContent(renderedHtml: string, article: URL, siteBase: URL): string {
  const fragment = parseFragment(renderedHtml)

  function clean(parent: DOM.ParentNode) {
    const children: DOM.ChildNode[] = []
    for (const node of parent.childNodes) {
      if (tree.isTextNode(node)) {
        children.push(node)
        continue
      }
      if (!tree.isElementNode(node) || omit.has(node.tagName) || node.namespaceURI === html.NS.SVG)
        continue
      const classes = node.attrs.find((attr) => attr.name === 'class')?.value.split(/\s+/) ?? []
      // KaTeX's native MathML works without the site's stylesheet. Its other
      // subtree is a duplicate visual rendering built from styled spans.
      if (classes.includes('katex-html') || classes.includes('collapse-fade')) continue
      if (
        classes.includes('language') &&
        tree.isElementNode(parent) &&
        parent.attrs.some(
          (attr) => attr.name === 'class' && attr.value.split(/\s+/).includes('astro-code')
        )
      )
        continue

      if (
        node.tagName === 'input' &&
        node.attrs.some((a) => a.name === 'type' && a.value === 'checkbox')
      ) {
        children.push(tree.createTextNode(node.attrs.some((a) => a.name === 'checked') ? '☑' : '☐'))
        continue
      }
      clean(node)
      if (!(node.namespaceURI === html.NS.HTML ? prose : math).has(node.tagName)) {
        children.push(...node.childNodes)
        continue
      }
      node.attrs = node.attrs.filter((attr) => {
        if (attr.namespace) return false
        const link = node.tagName === 'a' && attr.name === 'href'
        const image = node.tagName === 'img' && attr.name === 'src'
        if (!link && !image) return attributes.has(attr.name)

        const url = absoluteFeedUrl(attr.value.trim(), article, siteBase, link)
        if (!url) return false
        attr.value = url
        return true
      })
      children.push(node)
    }
    parent.childNodes = children
    for (const child of children) child.parentNode = parent
  }

  clean(fragment)
  return serialize(fragment)
}
