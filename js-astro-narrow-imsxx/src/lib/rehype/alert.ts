import { url } from "../url"
import { h as hastscript } from "hastscript"
import { t } from "../../i18n"

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

type AlertType = "note" | "tip" | "important" | "warning" | "caution"

const ICONS: Record<AlertType, string> = {
  note: "info-circle",
  tip: "lightbulb",
  important: "exclamation-triangle",
  warning: "alert-triangle",
  caution: "alert-circle",
}

/** `[!NOTE]`, `[!TIP]+ Title`, `[!WARNING]-` … */
const MARKER = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]([+-]?)[ \t]*(.*)$/i

function icon(name: string, className: string) {
  return h(
    "svg",
    { class: className, viewBox: "0 0 24 24", "aria-hidden": "true" },
    [h("use", { href: `${url("/icons/sprite.svg")}#icon-${name}` })],
  )
}

type Match = {
  paragraph: HastNode
  text: HastNode
  /** Index of the newline separating the marker line from the body, -1 if absent. */
  newline: number
  type: AlertType
  sign: string
  title: string
}

/**
 * A GitHub-style alert is a blockquote whose first paragraph starts with a
 * `[!TYPE]` marker. The marker line may carry a custom title and a `+` / `-`
 * sign that makes it collapsible.
 */
function matchAlert(blockquote: HastNode): Match | null {
  const children = blockquote.children ?? []
  const index = children.findIndex(
    (child) => child.type !== "text" || Boolean(child.value?.trim()),
  )
  const paragraph = children[index]
  if (paragraph?.type !== "element" || paragraph.tagName !== "p") return null

  const text = paragraph.children?.[0]
  if (text?.type !== "text") return null

  const value = text.value ?? ""
  const newline = value.indexOf("\n")
  const head = (newline === -1 ? value : value.slice(0, newline)).trim()
  const marker = MARKER.exec(head)
  if (!marker) return null

  return {
    paragraph,
    text,
    newline,
    type: marker[1].toLowerCase() as AlertType,
    sign: marker[2],
    title: marker[3].trim(),
  }
}

/** Strip the marker line from the first paragraph and return the remaining body. */
function takeBody(blockquote: HastNode, match: Match): HastNode[] {
  const children = blockquote.children ?? []
  const index = children.indexOf(match.paragraph)
  const rest = children.slice(index + 1)

  if (match.newline === -1) return rest

  match.text.value = (match.text.value ?? "").slice(match.newline + 1)
  const empty = (match.paragraph.children ?? []).every(
    (child) => child.type === "text" && !child.value?.trim(),
  )
  return empty ? rest : [match.paragraph, ...rest]
}

function buildAlert(match: Match, body: HastNode[]): HastNode {
  const { type, sign } = match
  const title = match.title || t.article.alert[type]
  const collapsible = sign === "+" || sign === "-"
  const classes = `alert alert-${type}`

  const content = h(
    "div",
    { class: "alert-content prose prose-sm max-w-none" },
    body,
  )

  if (collapsible) {
    const header = h("summary", { class: "alert-header" }, [
      h("span", { class: "alert-icon", "aria-hidden": "true" }, [
        icon(ICONS[type], "h-4 w-4"),
      ]),
      h("span", { class: "alert-title" }, title),
      h("span", { class: "alert-chevron", "aria-hidden": "true" }, [
        icon("chevron-down", "h-4 w-4"),
      ]),
    ])
    return h(
      "details",
      { class: classes, ...(sign === "+" ? { open: true } : {}) },
      [header, content],
    )
  }

  const header = h("div", { class: "alert-header" }, [
    h("span", { class: "alert-icon", "aria-hidden": "true" }, [
      icon(ICONS[type], "h-4 w-4"),
    ]),
    h("span", { class: "alert-title" }, title),
  ])
  return h("div", { class: classes, role: "note" }, [header, content])
}

/**
 * Replace Astro's plain blockquotes with the alert markup the upstream theme
 * renders through Hugo's `render-blockquote.html` hook.
 */
export function rehypeAlert() {
  return (tree: HastNode) => {
    const walk = (node: HastNode) => {
      if (!node.children) return
      for (let i = 0; i < node.children.length; i += 1) {
        const child = node.children[i]
        if (child.type === "element" && child.tagName === "blockquote") {
          const match = matchAlert(child)
          if (match) {
            const body = takeBody(child, match)
            node.children[i] = buildAlert(match, body)
            continue
          }
        }
        walk(child)
      }
    }
    walk(tree)
  }
}
