type HastNode = {
  type: string
  tagName?: string
  properties?: Record<string, unknown>
  children?: HastNode[]
}

/**
 * Markdown images ship without loading hints. Upstream runs every body image
 * through Hugo's image pipeline, which sets lazy loading and async decoding;
 * this keeps the same behaviour for plain <img> output.
 */
export function rehypeImageAttrs() {
  return (tree: HastNode) => {
    const walk = (node: HastNode) => {
      if (!node.children) return
      for (const child of node.children) {
        if (child.type === "element" && child.tagName === "img") {
          child.properties = {
            loading: "lazy",
            decoding: "async",
            ...child.properties,
          }
        } else {
          walk(child)
        }
      }
    }
    walk(tree)
  }
}
