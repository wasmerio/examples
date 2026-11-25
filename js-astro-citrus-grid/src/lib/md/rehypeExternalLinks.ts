import type { Nodes, Root } from 'hast'

interface Options {
  site: string
}

function transform(parent: { children: Nodes[] }, siteHost: string) {
  for (const node of parent.children) {
    if (node.type === 'element' && node.tagName === 'a') {
      const href = String(node.properties?.href ?? '')
      if (/^https?:\/\//i.test(href) && siteHost) {
        try {
          if (new URL(href).host !== siteHost) {
            node.properties.target = '_blank'
            node.properties.rel = ['noopener', 'noreferrer']
          }
        } catch {}
      }
    }
    if ('children' in node && Array.isArray((node as { children?: unknown }).children)) {
      transform(node as unknown as { children: Nodes[] }, siteHost)
    }
  }
}

export function rehypeExternalLinks(options: Options) {
  const siteHost = (() => {
    try {
      return new URL(options.site).host
    } catch {
      return ''
    }
  })()
  return (tree: Root) => {
    transform(tree, siteHost)
  }
}
