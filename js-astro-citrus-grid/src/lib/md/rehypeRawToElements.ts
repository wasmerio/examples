import type { Nodes, Root } from 'hast'
import rehypeRaw from 'rehype-raw'

import { resolveFilePath, type VFileLike } from './vfile'

export function rehypeRawToElements() {
  return (tree: Root, file: VFileLike) => {
    if (!/\.mdx$/i.test(resolveFilePath(file))) return

    const convert = rehypeRaw()
    const walk = (parent: { children?: Nodes[] }) => {
      const children = parent.children
      if (!children) return
      for (let i = 0; i < children.length; i++) {
        const child = children[i]
        if (child.type === 'raw') {
          const parsed = convert({ type: 'root', children: [child] } as Root, file as never)
          const nodes: Nodes[] = parsed?.children ?? []
          if (nodes.length > 0) {
            children.splice(i, 1, ...nodes)
            i += nodes.length - 1
          }
        } else if ('children' in child && Array.isArray(child.children)) {
          walk(child as { children?: Nodes[] })
        }
      }
    }
    walk(tree)
  }
}
