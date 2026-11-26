// Depth is relative to a stack of enclosing indents, so any consistent unit works.
const INDENT = "   ";
const CONTINUE = "│  ";
const BRANCH = "├─ ";
const LAST = "└─ ";

const indentWidth = (line: string) => line.length - line.trimStart().length;

export function drawFileTree(lines: string[]): string[] {
  const nodes: { depth: number; label: string }[] = [];
  const indents: number[] = [];

  for (const line of lines) {
    if (!line.trim()) continue;

    const width = indentWidth(line);

    while (indents.length && width <= indents[indents.length - 1]!) indents.pop();

    nodes.push({ depth: indents.length, label: line.trim() });
    indents.push(width);
  }

  return nodes.map(({ depth, label }, index) => {
    let prefix = "";

    for (let level = 0; level < depth - 1; level += 1) {
      prefix += hasLaterSibling(nodes, index, level + 1) ? CONTINUE : INDENT;
    }

    if (depth > 0) prefix += hasLaterSibling(nodes, index, depth) ? BRANCH : LAST;

    return prefix + label;
  });
}

/** Whether the ancestor at `depth` has another child below `index`. */
function hasLaterSibling(nodes: { depth: number }[], index: number, depth: number): boolean {
  for (let next = index + 1; next < nodes.length; next += 1) {
    if (nodes[next]!.depth < depth) return false;
    if (nodes[next]!.depth === depth) return true;
  }

  return false;
}
