import { visit } from "unist-util-visit"

export default function rehypeLightbox() {
  return (tree) => {
    visit(tree, "element", (node) => {
      if (node.tagName === "img") {
        node.properties["data-lightbox"] = ""
        node.properties["style"] = "cursor: zoom-in"
      }
    })
  }
}
