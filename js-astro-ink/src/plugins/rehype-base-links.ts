import type { Root, RootContent } from 'hast'

/** Treat root-relative Markdown links as site paths, without the deployment prefix. */
export default function rehypeBaseLinks(base: string) {
  const prefix = base.replace(/^\/+|\/+$/g, '')

  return (tree: Root) => {
    if (!prefix) return
    const siteBase = `/${prefix}`

    const walk = (node: Root | RootContent): void => {
      if (node.type === 'element' && node.tagName === 'a') {
        const { href } = node.properties
        if (typeof href === 'string' && href.startsWith('/') && !href.startsWith('//')) {
          node.properties.href = `${siteBase}${href}`
        }
      }
      if ('children' in node) node.children.forEach(walk)
    }

    walk(tree)
  }
}
