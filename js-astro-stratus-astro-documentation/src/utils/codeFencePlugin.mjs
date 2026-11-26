// In MDX, the components below (and each `CodeTab`) hold their multi-line text in
// a fenced block between the tags, because CloudCannon writes a multi-line string
// prop with raw newlines MDX can't parse. This folds the fence back into the prop
// the component takes. Keep in step with each component's raw snippet.
const FENCE_PROPS = {
  CodeBlock: "code",
  CodeDiff: "code",
  CodeAnnotations: "code",
  FileTree: "paths",
  Diagram: "definition",
};

const TAB_KEYS = ["label", "language", "highlight"];

const expressionAttribute = (name, value) => ({
  type: "mdxJsxAttribute",
  name,
  value: { type: "mdxJsxAttributeValueExpression", value: JSON.stringify(value) },
});

const findFence = (element) => element.children.find((child) => child.type === "code");

const hasAttribute = (element, name) =>
  element.attributes.some((attribute) => attribute.name === name);

function readTab(element) {
  const tab = {};

  for (const attribute of element.attributes) {
    if (
      attribute.type === "mdxJsxAttribute" &&
      TAB_KEYS.includes(attribute.name) &&
      typeof attribute.value === "string"
    ) {
      tab[attribute.name] = attribute.value;
    }
  }
  const fence = findFence(element);

  if (!tab.language && fence?.lang) tab.language = fence.lang;
  tab.code = fence?.value ?? "";

  return tab;
}

function foldCodeTabs(node, ctx) {
  const tabElements = node.children.filter(
    (child) => child.type === "mdxJsxFlowElement" && child.name === "CodeTab"
  );

  if (tabElements.length === 0) return;

  ctx.replaceNode(node, {
    ...node,
    attributes: [
      ...node.attributes.filter((attribute) => attribute.name !== "tabs"),
      expressionAttribute("tabs", tabElements.map(readTab)),
    ],
    children: [],
  });
}

function foldFence(node, ctx, prop) {
  const fence = findFence(node);

  if (!fence) return;

  const attributes = node.attributes.filter((attribute) => attribute.name !== prop);

  attributes.push(expressionAttribute(prop, fence.value));
  if (prop === "code" && fence.lang && !hasAttribute(node, "language")) {
    attributes.push(expressionAttribute("language", fence.lang));
  }

  ctx.replaceNode(node, { ...node, attributes, children: [] });
}

/** Sätteri mdast plugin: turns the fence inside a code component into its prop. */
export const codeFencePlugin = {
  name: "code-fence-props",
  mdxJsxFlowElement(node, ctx) {
    if (node.name === "CodeTabs") foldCodeTabs(node, ctx);
    else if (Object.hasOwn(FENCE_PROPS, node.name)) foldFence(node, ctx, FENCE_PROPS[node.name]);
  },
};
