/**
 * Rehype plugin that highlights unfilled placeholders. Body text written as two
 * opening brackets, `TODO:`, an instruction and two closing brackets becomes
 * `<mark class="todo-marker" data-pagefind-ignore>TODO: instruction</mark>`:
 * the brackets go, the visible prefix stays, and the search index skips it.
 *
 * Text inside `code`, `pre`, `script` and `style` is left alone, so posts can
 * show the syntax in samples. Markers in frontmatter never reach this plugin
 * and render as literal text. scripts/check-markers.ts counts the same markers
 * in the sources, which is why this file never spells one out in full.
 */

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

const SKIPPED_TAGS = new Set(["code", "pre", "script", "style"]);

// Brackets are built from parts so this file is not itself read as a marker.
const OPEN = "\\x5b\\x5b";
const CLOSE = "\\x5d\\x5d";
// The body runs to the first closing pair, so it may hold a single closing
// bracket and wrap across a soft line break, like scripts/check-markers.ts.
const PATTERN = `${OPEN}TODO:((?:(?!${CLOSE})[\\s\\S])+)${CLOSE}`;

const splitText = (node: HastNode): HastNode[] | null => {
  const value = node.value ?? "";
  // A fresh global RegExp per call: lastIndex never leaks between text nodes.
  const matches = [...value.matchAll(new RegExp(PATTERN, "g"))];
  if (matches.length === 0) return null;

  const out: HastNode[] = [];
  let last = 0;
  for (const match of matches) {
    // A whitespace-only body is not a marker; scripts/check-markers.ts skips it too.
    if (match[1].trim() === "") continue;
    const at = match.index ?? 0;
    if (at > last) out.push({ type: "text", value: value.slice(last, at) });
    out.push({
      type: "element",
      tagName: "mark",
      properties: { className: ["todo-marker"], dataPagefindIgnore: true },
      children: [
        {
          type: "text",
          value: `TODO: ${match[1].replace(/\s+/g, " ").trim()}`,
        },
      ],
    });
    last = at + match[0].length;
  }
  if (last < value.length) out.push({ type: "text", value: value.slice(last) });
  return out;
};

const walk = (node: HastNode): void => {
  if (!node.children) return;
  if (node.type === "element" && SKIPPED_TAGS.has(node.tagName ?? "")) return;

  node.children = node.children.flatMap(child => {
    if (child.type === "text") return splitText(child) ?? [child];
    walk(child);
    return [child];
  });
};

export const rehypeTodoMarkers = () => (tree: HastNode) => {
  walk(tree);
};

/**
 * The instruction of a plain-text value that is exactly one marker, else null.
 * For frontmatter strings, which never pass through this plugin.
 */
export const todoMarkerText = (value: string): string | null => {
  const match = new RegExp(`^\\s*${PATTERN}\\s*$`).exec(value);
  const body = match?.[1]?.replace(/\s+/g, " ").trim();
  return body ? `TODO: ${body}` : null;
};
