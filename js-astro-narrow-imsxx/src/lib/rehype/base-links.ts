import { url } from "../url"

type HastNode = {
  type: string
  tagName?: string
  properties?: Record<string, unknown>
  children?: HastNode[]
}

/**
 * Prefix root-relative links and image sources with the deployment base.
 * Content links (`[x](/posts/y)`, `![alt](/images/z.png)`) are written by the
 * author, so the base has to be applied during rendering rather than by hand.
 */
export function rehypeBaseLinks() {
  return (tree: HastNode) => {
    const walk = (node: HastNode) => {
      if (!node.children) return
      for (const child of node.children) {
        if (
          child.type === "element" &&
          (child.tagName === "a" || child.tagName === "img")
        ) {
          const key = child.tagName === "a" ? "href" : "src"
          const value = child.properties?.[key]
          if (
            typeof value === "string" &&
            value.startsWith("/") &&
            !value.startsWith("//")
          ) {
            child.properties![key] = url(value)
          }
        }
        walk(child)
      }
    }
    walk(tree)
  }
}
