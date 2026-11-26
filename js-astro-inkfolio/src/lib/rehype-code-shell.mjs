/**
 * Code shell: turns every highlighted block into a framed card with a header
 * (filename or language + copy button). Consecutive blocks carrying the same
 * `group="..."` fence meta are merged into a tabbed panel.
 *
 *   ```bash title="Install" group="pkg"
 *   npm install
 *   ```
 *   ```bash title="pnpm" group="pkg"
 *   pnpm install
 *   ```
 *
 * Labels come from the shiki transformer in ./shiki-code-meta.mjs, which writes
 * data-filename / data-lang / data-group onto the <pre>.
 */
const isElement = (node) => node && node.type === 'element';

function header(label) {
  return {
    type: 'element',
    tagName: 'div',
    properties: { className: ['cb-head'] },
    children: [
      {
        type: 'element',
        tagName: 'span',
        properties: { className: ['cb-name'] },
        children: [{ type: 'text', value: label }],
      },
      {
        type: 'element',
        tagName: 'button',
        properties: { type: 'button', className: ['cb-copy'], 'data-copy': '', 'aria-label': 'Copy code' },
        children: [{ type: 'text', value: 'Copy' }],
      },
    ],
  };
}

const bodyOf = (children) => ({
  type: 'element',
  tagName: 'div',
  properties: { className: ['cb-body'] },
  children,
});

function single(pre, label) {
  return {
    type: 'element',
    tagName: 'figure',
    properties: { className: ['cb'] },
    children: [header(label), bodyOf([pre])],
  };
}

function group(items) {
  const tabs = {
    type: 'element',
    tagName: 'div',
    properties: { className: ['cb-tabs'], role: 'tablist' },
    children: [
      ...items.map((item, index) => ({
        type: 'element',
        tagName: 'button',
        properties: {
          type: 'button',
          className: ['cb-tab', ...(index === 0 ? ['is-active'] : [])],
          role: 'tab',
          'data-tab': String(index),
          'aria-selected': index === 0 ? 'true' : 'false',
        },
        children: [{ type: 'text', value: item.label }],
      })),
      {
        type: 'element',
        tagName: 'button',
        properties: { type: 'button', className: ['cb-copy'], 'data-copy': '', 'aria-label': 'Copy code' },
        children: [{ type: 'text', value: 'Copy' }],
      },
    ],
  };

  const panels = items.map((item, index) => ({
    type: 'element',
    tagName: 'div',
    properties: { className: ['cb-panel', ...(index === 0 ? ['is-active'] : [])], 'data-panel': String(index) },
    children: [item.node],
  }));

  return {
    type: 'element',
    tagName: 'figure',
    properties: { className: ['cb', 'cb--group'] },
    children: [tabs, bodyOf(panels)],
  };
}

function describe(pre) {
  const props = pre.properties ?? {};
  const label = props['data-filename'] || props['data-lang'] || props['data-language'] || 'code';
  return { node: pre, label: String(label), group: props['data-group'] ? String(props['data-group']) : '' };
}

function walk(node) {
  if (!Array.isArray(node.children)) return;
  const out = [];
  let run = [];

  const flush = () => {
    if (!run.length) return;
    out.push(run.length === 1 ? single(run[0].node, run[0].label) : group(run));
    run = [];
  };

  for (const child of node.children) {
    // Blank lines between two grouped blocks must not break the run.
    if (child.type === 'text' && !child.value.trim() && run.length) continue;
    if (isElement(child) && child.tagName === 'pre') {
      const info = describe(child);
      if (info.group && run.length && run[0].group === info.group) {
        run.push(info);
        continue;
      }
      flush();
      if (info.group) run.push(info);
      else out.push(single(info.node, info.label));
      continue;
    }
    flush();
    if (child && typeof child === 'object') walk(child);
    out.push(child);
  }

  flush();
  node.children = out;
}

export default function rehypeCodeShell() {
  return (tree) => walk(tree);
}
