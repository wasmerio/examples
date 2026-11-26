import GithubSlugger from "github-slugger"
import { h as hastscript } from "hastscript"
import { t } from "../../i18n"
import { url } from "../url"

const h = hastscript as unknown as (
  selector: string,
  properties?: Record<string, unknown>,
  ...children: unknown[]
) => HastNode

type HastNode = {
  type: string
  tagName?: string
  properties?: Record<string, unknown>
  children?: HastNode[]
  value?: string
}

const HEADINGS = new Set(["h1", "h2", "h3", "h4", "h5", "h6"])

function textOf(node: HastNode): string {
  if (node.type === "text") return node.value ?? ""
  if (!node.children) return ""
  return node.children.map(textOf).join("")
}

/**
 * Append the hover anchor the upstream `render-heading.html` hook renders.
 * Astro assigns heading ids after user rehype plugins run, so this walks the
 * headings itself with the same slugger Astro uses and writes the id up front.
 */
export function rehypeHeadingAnchors() {
  return (tree: HastNode) => {
    const slugger = new GithubSlugger()

    const walk = (node: HastNode) => {
      if (!node.children) return
      for (const child of node.children) {
        if (
          child.type === "element" &&
          child.tagName &&
          HEADINGS.has(child.tagName)
        ) {
          const text = textOf(child).trim()
          const id =
            typeof child.properties?.id === "string" && child.properties.id
              ? child.properties.id
              : slugger.slug(text)
          child.properties = { ...child.properties, id }

          const already = (child.children ?? []).some(
            (item) =>
              item.type === "element" &&
              Array.isArray(item.properties?.className) &&
              item.properties?.className.includes("heading-anchor"),
          )
          if (!already) {
            child.children = [
              ...(child.children ?? []),
              h(
                "a",
                {
                  href: `#${id}`,
                  class: "heading-anchor",
                  "aria-label": t.nav.anchor,
                },
                [
                  h(
                    "svg",
                    {
                      class: "h-4 w-4",
                      viewBox: "0 0 24 24",
                      "aria-hidden": "true",
                    },
                    [
                      h("use", {
                        href: `${url("/icons/sprite.svg")}#icon-link`,
                      }),
                    ],
                  ),
                ],
              ),
            ]
          }
        }
        walk(child)
      }
    }
    walk(tree)
  }
}
