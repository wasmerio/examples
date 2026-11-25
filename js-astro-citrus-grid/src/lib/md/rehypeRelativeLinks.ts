import type { Nodes, Root } from 'hast'

import { isInContentDir } from '../contentImages'
import { loadPostIndex, type PostIndex, resolveHrefTarget } from './linkResolve'
import { resolveFilePath, type VFileLike } from './vfile'

const RAW_HREF_RE = /\bhref=(["'])(.*?)\1/g

function transform(parent: { children: Nodes[] }, filePath: string, index: PostIndex) {
  for (const node of parent.children) {
    if (node.type === 'element' && node.tagName === 'a') {
      const href = String(node.properties?.href ?? '')
      const resolved = resolveHrefTarget(href, filePath, index)
      if (resolved) node.properties.href = resolved
    } else if (
      node.type === 'raw' &&
      typeof node.value === 'string' &&
      node.value.includes('href=')
    ) {
      node.value = node.value.replace(RAW_HREF_RE, (whole, quote: string, url: string) => {
        const resolved = resolveHrefTarget(url, filePath, index)
        return resolved ? `href=${quote}${resolved}${quote}` : whole
      })
    }
    if ('children' in node && Array.isArray((node as { children?: unknown }).children)) {
      transform(node as unknown as { children: Nodes[] }, filePath, index)
    }
  }
}

export function rehypeRelativeLinks() {
  return (tree: Root, file: VFileLike) => {
    const filePath = resolveFilePath(file)
    if (!filePath || !isInContentDir(filePath)) return
    transform(tree, filePath, loadPostIndex())
  }
}
