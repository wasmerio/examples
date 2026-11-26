import { h } from "hastscript"
import { siteConfig } from "../../config/site"
import { pageFlag } from "../frontmatter-flags"

type HastNode = {
  type: string
  tagName?: string
  properties?: Record<string, unknown>
  children?: HastNode[]
  value?: string
}

const isElement = (node: HastNode, name: string) =>
  node.type === "element" && node.tagName === name

function findImage(node: HastNode): HastNode | null {
  if (!node.children) return null
  for (const child of node.children) {
    if (isElement(child, "img")) return child
    const nested = findImage(child)
    if (nested) return nested
  }
  return null
}

function buildFigure(img: HastNode, lightboxOverride?: boolean) {
  const src = String(img.properties?.src ?? "")
  const caption = img.properties?.title ? String(img.properties.title) : ""
  const lightbox = lightboxOverride ?? siteConfig.lightbox.enabled

  delete img.properties?.title

  return h(
    "figure",
    {
      class: "image-figure not-prose my-8",
      "data-lightbox-enabled": String(lightbox),
      "data-gallery-type": "auto",
      "data-image-src": src,
      ...(lightbox ? {} : { "data-no-lightbox": "" }),
    },
    [
      h("div", { class: "image-container" }, [img as never]),
      caption ? h("figcaption", { class: "image-caption" }, caption) : null,
    ].filter(Boolean) as never[],
  ) as HastNode
}

/**
 * Wrap body images in the figure shell the upstream gallery scripts expect.
 * A paragraph that only holds an image is replaced entirely, otherwise the
 * gallery would nest a block element inside a paragraph.
 */
export function rehypeImageFigure() {
  return (tree: HastNode, file: unknown) => {
    if (!siteConfig.gallery.enabled) return
    const lightbox = pageFlag(file, "lightbox")

    const walk = (node: HastNode) => {
      if (!node.children) return
      for (let i = 0; i < node.children.length; i += 1) {
        const child = node.children[i]
        if (isElement(child, "p")) {
          const img = findImage(child)
          const meaningful = child.children?.filter(
            (grand) => !(grand.type === "text" && !grand.value?.trim()),
          )
          if (img && meaningful?.length === 1) {
            node.children[i] = buildFigure(img, lightbox)
            continue
          }
        }
        if (isElement(child, "img")) {
          node.children[i] = buildFigure(child, lightbox)
          continue
        }
        walk(child)
      }
    }

    walk(tree)
  }
}
