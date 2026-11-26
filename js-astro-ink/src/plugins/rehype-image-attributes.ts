import type { Root } from 'hast'

/**
 * Add `loading="lazy"` and `decoding="async"` to every image rendered from
 * Markdown, so below-the-fold images don't block rendering. (Local hero
 * images are handled by the Astro <Image> component instead.)
 */
export default function rehypeImageAttributes() {
  return (tree: Root) => {
    const walk = (node: unknown): void => {
      if (!node || typeof node !== 'object') return
      const el = node as {
        type?: string
        tagName?: string
        properties?: Record<string, unknown>
        children?: unknown[]
      }
      if (el.type === 'element' && el.tagName === 'img' && el.properties) {
        el.properties.loading = 'lazy'
        el.properties.decoding = 'async'
      }
      el.children?.forEach(walk)
    }
    walk(tree)
  }
}
