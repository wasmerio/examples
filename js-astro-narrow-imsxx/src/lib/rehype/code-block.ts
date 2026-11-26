import { url } from "../url"
import { h as hastscript } from "hastscript"
import { t } from "../../i18n"
import { siteConfig } from "../../config/site"

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

function textOf(node: HastNode): string {
  if (node.type === "text") return node.value ?? ""
  if (!node.children) return ""
  return node.children.map(textOf).join("")
}

/** Shiki runs before this plugin and records the language as `dataLanguage`. */
function languageOf(pre: HastNode): string {
  const value = pre.properties?.dataLanguage
  return typeof value === "string" ? value : "text"
}

function icon(name: string, className: string) {
  return h(
    "svg",
    { class: className, viewBox: "0 0 24 24", "aria-hidden": "true" },
    [h("use", { href: `${url("/icons/sprite.svg")}#icon-${name}` })],
  )
}

function buildShell(pre: HastNode, index: number) {
  const codeId = `code-${index}`
  const language = languageOf(pre)
  const display = language === "text" ? "TEXT" : language.toUpperCase()
  const source = textOf(pre)

  const collapse = siteConfig.codeblock.collapse
  const collapseEnabled = collapse.enabled
  const defaultState = collapse.defaultState
  const maxLines = collapse.maxLines
  const collapsedHeight = collapse.collapsedHeight

  // Reuse the upstream stylesheet, which targets Chroma's wrapper class.
  pre.properties = {
    ...pre.properties,
    class: ["chroma", pre.properties?.class ?? ""],
  }

  return h(
    "div",
    {
      class:
        "code-block-container border-border bg-card my-6 overflow-hidden rounded-md border",
      "data-code-block": "",
      "data-code-id": codeId,
      "data-collapsible": String(collapseEnabled),
      "data-default-state": defaultState,
      "data-collapsed": "false",
      "data-max-lines": String(maxLines),
      "data-collapsed-height": String(collapsedHeight),
    },
    [
      h(
        "div",
        {
          class:
            "code-block-header bg-muted/40 border-border flex items-center justify-between border-b px-3 py-2",
        },
        [
          h("div", { class: "flex items-center gap-2" }, [
            h("div", { class: "text-muted-foreground shrink-0" }, [
              icon("code", "h-4 w-4"),
            ]),
            h(
              "span",
              { class: "text-muted-foreground text-xs font-medium" },
              display,
            ),
          ]),
          h("div", { class: "flex items-center gap-2" }, [
            collapseEnabled &&
              h(
                "button",
                {
                  class:
                    "collapse-code-btn text-muted-foreground hover:bg-muted hover:text-foreground inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs font-medium transition-colors",
                  type: "button",
                  "data-code-action": "toggle-collapse",
                  "data-label-expand": t.code.expand,
                  "data-label-collapse": t.code.collapse,
                  title: t.code.collapse,
                  "aria-label": t.code.collapse,
                  "aria-controls": codeId,
                  "aria-expanded": "true",
                },
                [
                  h(
                    "span",
                    {
                      class:
                        "collapse-chevron transition-transform duration-200 ease-out",
                    },
                    [icon("chevron-down", "h-3 w-3")],
                  ),
                  h(
                    "span",
                    { class: "collapse-text hidden sm:inline" },
                    t.code.collapse,
                  ),
                ],
              ),
            h(
              "button",
              {
                class:
                  "copy-code-btn text-muted-foreground hover:bg-muted hover:text-foreground inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs font-medium transition-colors",
                type: "button",
                "data-code-action": "copy",
                "data-label-copy": t.code.copy,
                "data-label-copied": t.code.copied,
                title: t.code.copy,
                "aria-label": t.code.copy,
              },
              [
                h("span", { class: "copy-icon" }, [icon("copy", "h-3 w-3")]),
                h("span", { class: "copy-text hidden sm:inline" }, t.code.copy),
              ],
            ),
          ]),
        ],
      ),
      h("div", { class: "code-block-content relative", id: codeId }, [
        // Upstream's Chroma wrapper: padding, scrolling and typography live on
        // `.highlight`, while the inner <pre> stays flush. Shiki's <pre> carries
        // the `.chroma` class, so it needs the same parent to inherit that CSS.
        h("div", { class: "highlight" }, [pre]),
        h("div", { hidden: true, "data-code-source": "" }, source),
        h(
          "div",
          {
            class:
              "collapse-overlay to-card/90 pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-transparent opacity-0 transition-opacity duration-300",
            hidden: true,
          },
          [
            h(
              "button",
              {
                class:
                  "collapse-overlay-btn text-muted-foreground bg-background border-border hover:bg-muted hover:text-foreground absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center justify-center rounded-md border p-1.5 transition-colors",
                type: "button",
                "data-code-action": "expand",
                "aria-label": t.code.expand,
                title: t.code.expand,
              },
              [icon("chevron-down", "h-5 w-5")],
            ),
          ],
        ),
      ]),
    ],
  )
}

/**
 * Wrap every highlighted code block in the shell the upstream theme expects:
 * header with language label, copy button, optional collapse, and a hidden
 * copy of the raw source.
 */
function containsMermaid(node: HastNode): boolean {
  if (node.properties && "data-mermaid" in node.properties) return true
  return node.children?.some(containsMermaid) ?? false
}

export function rehypeCodeBlockShell() {
  return (tree: HastNode) => {
    let index = 0

    const walk = (node: HastNode) => {
      if (!node.children) return
      for (let i = 0; i < node.children.length; i += 1) {
        const child = node.children[i]
        if (child.type === "element" && child.tagName === "pre") {
          if (containsMermaid(child)) continue
          node.children[i] = buildShell(child, index) as HastNode
          index += 1
        } else {
          walk(child)
        }
      }
    }

    walk(tree)
  }
}
