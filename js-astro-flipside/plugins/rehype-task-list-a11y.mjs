// GFM task lists render `- [x]` as a disabled `<input type="checkbox">` with
// no accessible name, which fails the axe/Lighthouse "form elements have
// labels" check. Give each one an aria-label (the checked/unchecked STATE is
// announced separately by the AT, so the label is just a name). No
// unist-util-visit dep — a plain recursive walk over the hast tree.
export function rehypeTaskListA11y(label = "task") {
  const walk = (node) => {
    if (
      node.tagName === "input" &&
      node.properties &&
      node.properties.type === "checkbox"
    ) {
      node.properties.ariaLabel = label;
    }
    if (node.children) for (const child of node.children) walk(child);
  };
  return (tree) => walk(tree);
}
