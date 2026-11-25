import type * as mdast from 'mdast'
import type { RemarkPlugin } from '@astrojs/markdown-remark'
import { toString } from 'mdast-util-to-string'

const remarkDescription: RemarkPlugin = (options?: { maxChars?: number }) => {
  const maxChars = (options && options.maxChars) || 200
  return function (tree, { data }) {
    function findFirstParagraph(
      node: mdast.Root | mdast.RootContent,
    ): string | undefined {
      if ('children' in node && Array.isArray(node.children)) {
        for (const child of node.children) {
          if (
            child.type === 'paragraph' &&
            child.children.length > 0 &&
            child.children[0].type !== 'image'
          ) {
            const s = toString(child).trim()
            if (s.length > 0) {
              return s
            }
          } else {
            const result = findFirstParagraph(child)
            if (result) {
              return result
            }
          }
        }
      }
      return undefined
    }
    let description = data.astro?.frontmatter?.description || findFirstParagraph(tree)
    if (description && data.astro?.frontmatter) {
      if (description.length > maxChars) {
        const lastSpace = description.slice(0, maxChars).lastIndexOf(' ')
        description = description.slice(0, lastSpace) + '…'
      }
      data.astro.frontmatter.description = description
    }
  }
}

export default remarkDescription
