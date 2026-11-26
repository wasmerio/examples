// Fence meta (`title="a.js" {2,5}`) mirrors `CodeBlock`'s props; keep the two paths in step.
const RANGES = /\{([\d,\s-]+)\}/;
const TITLE = /(?:^|\s)title=(?:"([^"]*)"|'([^']*)'|(\S+))/;

function parseRanges(input) {
  const lines = new Set();

  for (const part of input.split(",")) {
    const [from, to] = part.trim().split("-").map(Number);

    if (!Number.isFinite(from)) continue;

    for (let line = from; line <= (Number.isFinite(to) ? to : from); line += 1) lines.add(line);
  }

  return lines;
}

/** Shiki transformer marking the lines named by `{1,3-5}` in the fence meta. */
export function fenceMetaTransformer() {
  return {
    name: "docs-fence-highlight",
    pre(node) {
      // Shiki's inline colors beat every stylesheet, print rules included.
      node.properties.style = undefined;

      // `_prose.css` reads the header label off `data-title`; nothing upstream sets it.
      const title = (this.options.meta?.__raw ?? "").match(TITLE);

      if (title) node.properties["data-title"] = title[1] ?? title[2] ?? title[3];
    },
    line(node, line) {
      const meta = this.options.meta?.__raw ?? "";
      const ranges = meta.match(RANGES);

      if (ranges && parseRanges(ranges[1]).has(line)) this.addClassToHast(node, "is-highlighted");
    },
  };
}
