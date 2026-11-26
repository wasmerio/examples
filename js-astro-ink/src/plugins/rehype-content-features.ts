import type { Root, RootContent } from 'hast'

interface MarkdownFile {
  data: { astro?: { frontmatter?: Record<string, unknown> } }
}

/** Run after rehype-katex: code samples containing $ are not rendered math. */
export default function rehypeContentFeatures() {
  return (tree: Root, file: MarkdownFile) => {
    const containsMath = (node: Root | RootContent): boolean => {
      if (node.type === 'element') {
        const classes = node.properties.className
        if (Array.isArray(classes) && classes.includes('katex')) return true
      }
      return 'children' in node && node.children.some(containsMath)
    }
    if (file.data.astro) {
      file.data.astro.frontmatter ??= {}
      file.data.astro.frontmatter.hasMath = containsMath(tree)
    }
  }
}
