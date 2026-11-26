import { pageFlag } from "../frontmatter-flags"

type HastNode = {
  type: string
  tagName?: string
  properties?: Record<string, unknown>
  children?: HastNode[]
  value?: string
}

type VFileLike = { path?: string }

/** Minimal transformer signature — avoids depending on unified's types. */
type Transformer = (tree: HastNode, file: VFileLike) => void

function isMathNode(node: HastNode): boolean {
  const classes = node.properties?.className
  const list = Array.isArray(classes) ? classes : [classes]
  const tokens = list.flatMap((name) => String(name ?? "").split(/\s+/))
  return tokens.some(
    (token) =>
      token === "math" ||
      token === "language-math" ||
      token.startsWith("math-"),
  )
}

function textOf(node: HastNode): string {
  if (node.type === "text") return node.value ?? ""
  if (!node.children) return ""
  return node.children.map(textOf).join("")
}

/**
 * KaTeX renders at build time, so a page-level opt-out has to happen before
 * rehype-katex runs: turn math nodes back into their literal source.
 */
export function rehypeKatexGuard(): Transformer {
  return (tree, file) => {
    if (pageFlag(file, "katex") !== false) return

    const walk = (node: HastNode) => {
      if (!node.children) return
      for (let i = 0; i < node.children.length; i += 1) {
        const child = node.children[i]
        if (child.type === "element" && isMathNode(child)) {
          node.children[i] = { type: "text", value: textOf(child) }
        } else {
          walk(child)
        }
      }
    }

    walk(tree)
  }
}
