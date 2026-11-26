import { pageFlag } from "../frontmatter-flags"

type MdastNode = {
  type: string
  lang?: string | null
  value?: string
  data?: Record<string, unknown>
  children?: MdastNode[]
}

/**
 * Mermaid blocks must reach the browser as plain text, not as highlighted
 * spans. Marking the node during the remark phase lets mdast-util-to-hast emit
 * the final `<div class="mermaid">` directly, so nothing depends on the order
 * of rehype plugins relative to Shiki.
 *
 * A page can opt out with `mermaid: false` in its front matter; the block then
 * stays a regular highlighted code block.
 */
export function remarkMermaid() {
  return (tree: MdastNode, file: unknown) => {
    if (pageFlag(file, "mermaid") === false) return

    const walk = (node: MdastNode) => {
      if (!node.children) return
      for (const child of node.children) {
        if (child.type === "code" && child.lang === "mermaid") {
          child.data = {
            hName: "div",
            hProperties: { className: ["mermaid"], "data-mermaid": "" },
            hChildren: [{ type: "text", value: child.value ?? "" }],
          }
        }
        walk(child)
      }
    }
    walk(tree)
  }
}
