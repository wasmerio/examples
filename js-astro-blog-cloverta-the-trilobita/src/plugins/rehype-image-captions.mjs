// Standalone Markdown images may use their optional title as a visible caption.
// Keep alt text unchanged: alternative text and captions serve different purposes.
export default function rehypeImageCaptions() {
  return (tree) => {
    function visit(parent) {
      if (!Array.isArray(parent.children)) return;

      parent.children = parent.children.map((node) => {
        if (node.type === "element" && node.tagName === "p") {
          const content = node.children.filter(
            (child) => child.type !== "text" || child.value.trim() !== "",
          );
          const onlyChild = content.length === 1 ? content[0] : null;
          const image = onlyChild?.tagName === "img"
            ? onlyChild
            : onlyChild?.tagName === "a" && onlyChild.children?.length === 1
              && onlyChild.children[0].tagName === "img"
              ? onlyChild.children[0]
              : null;
          const caption = image?.properties?.title;

          if (typeof caption === "string" && caption.trim()) {
            return {
              type: "element",
              tagName: "figure",
              properties: {},
              children: [
                onlyChild,
                {
                  type: "element",
                  tagName: "figcaption",
                  properties: {},
                  children: [{ type: "text", value: caption.trim() }],
                },
              ],
            };
          }
        }

        // Respect captions and markup authored explicitly in HTML.
        if (node.tagName !== "figure") visit(node);
        return node;
      });
    }

    visit(tree);
  };
}
