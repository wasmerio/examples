/**
 * Rehype plugin for labelled blocks. Must run after Shiki and rehype-callouts.
 * Wraps each `pre.astro-code` in `div.code-block` with a language label, and
 * marks callouts with the default title (`data-default-title`) so CSS can
 * show the type as the label. Labels are kept out of the search index.
 */

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

const PLAIN_LANGUAGES = new Set(["plaintext", "text", "txt", "plain"]);

// Shiki's hast uses `class`, other plugins `className`.
const classes = (node: HastNode): string[] =>
  [node.properties?.className, node.properties?.class].flatMap(value =>
    Array.isArray(value)
      ? value.map(String)
      : typeof value === "string"
        ? value.split(/\s+/)
        : []
  );

const textOf = (node: HastNode): string =>
  node.type === "text"
    ? (node.value ?? "")
    : (node.children ?? []).map(textOf).join("");

const findByClass = (node: HastNode, name: string): HastNode | undefined => {
  for (const child of node.children ?? []) {
    if (classes(child).includes(name)) return child;
    const found = findByClass(child, name);
    if (found) return found;
  }
  return undefined;
};

const languageOf = (pre: HastNode): string => {
  const raw = String(
    pre.properties?.dataLanguage ?? pre.properties?.["data-language"] ?? ""
  ).toLowerCase();
  return !raw || PLAIN_LANGUAGES.has(raw) ? "text" : raw;
};

const codeBlock = (pre: HastNode): HastNode => ({
  type: "element",
  tagName: "div",
  properties: { className: ["code-block"] },
  children: [
    {
      type: "element",
      tagName: "span",
      properties: {
        className: ["block-label"],
        ariaHidden: "true",
        dataPagefindIgnore: true,
      },
      children: [{ type: "text", value: languageOf(pre) }],
    },
    pre,
  ],
});

const markDefaultTitle = (callout: HastNode): void => {
  const type = String(
    callout.properties?.dataCallout ??
      callout.properties?.["data-callout"] ??
      ""
  );
  const title = findByClass(callout, "callout-title-text");
  if (!type || !title) return;
  if (textOf(title).trim().toLowerCase() === type.toLowerCase()) {
    title.properties = { ...title.properties, dataDefaultTitle: true };
  }
};

const walk = (node: HastNode): void => {
  if (!node.children) return;
  node.children = node.children.map(child => {
    if (child.type !== "element") return child;
    const names = classes(child);
    if (child.tagName === "pre" && names.includes("astro-code")) {
      return codeBlock(child);
    }
    if (names.includes("callout")) markDefaultTitle(child);
    walk(child);
    return child;
  });
};

export const rehypeBlockLabels = () => (tree: HastNode) => {
  walk(tree);
};
