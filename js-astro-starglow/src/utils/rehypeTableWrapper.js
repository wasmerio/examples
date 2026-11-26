/**
 * Rehype plugin that wraps each table in a focusable scrolling region
 * (`div.table-wrapper`), inside a `div.table-block` that carries the numbered
 * label outside the scroller so it is never clipped. Options: `{ label }`, the
 * region's accessible name. Tables inside `<ResponsiveTable>` are skipped.
 */
export const rehypeTableWrapper =
  (options = {}) =>
  tree => {
    const { label = "Scrollable table" } = options;
    let count = 0;
    const wrap = node => {
      if (!node.children) return;
      if (node.type === "mdxJsxFlowElement" && node.name === "ResponsiveTable")
        return;

      node.children = node.children.map(child => {
        if (child.type === "element" && child.tagName === "table") {
          count += 1;
          return {
            type: "element",
            tagName: "div",
            properties: { className: ["table-block"] },
            children: [
              {
                type: "element",
                tagName: "span",
                properties: {
                  className: ["block-label"],
                  ariaHidden: "true",
                  dataPagefindIgnore: true,
                },
                children: [{ type: "text", value: `table ${count}` }],
              },
              {
                type: "element",
                tagName: "div",
                properties: {
                  className: ["table-wrapper"],
                  tabIndex: 0,
                  role: "region",
                  ariaLabel: label,
                },
                children: [child],
              },
            ],
          };
        }
        wrap(child);
        return child;
      });
    };

    wrap(tree);
  };
