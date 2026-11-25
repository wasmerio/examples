const headingTags = new Set(['h2', 'h3', 'h4', 'h5', 'h6']);

function textContent(node) {
  if (!node) return '';
  if (node.type === 'text') return node.value || '';
  if (!Array.isArray(node.children)) return '';
  return node.children.map(textContent).join('');
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function walk(node, visitor) {
  visitor(node);
  if (Array.isArray(node.children)) {
    node.children.forEach((child) => walk(child, visitor));
  }
}

export function rehypeHeadingAnchors() {
  return (tree) => {
    const used = new Map();

    walk(tree, (node) => {
      if (node.type !== 'element' || !headingTags.has(node.tagName)) return;

      node.properties ||= {};
      const existingId = node.properties.id;
      const base = String(existingId || slugify(textContent(node)) || 'section');
      const count = used.get(base) || 0;
      used.set(base, count + 1);
      const id = count === 0 ? base : `${base}-${count + 1}`;
      node.properties.id = id;
      node.properties.className = [...(node.properties.className || []), 'group', 'scroll-m-24'];

      node.children ||= [];
      node.children.push({
        type: 'element',
        tagName: 'a',
        properties: {
          href: `#${id}`,
          className: ['heading-anchor'],
          ariaLabel: 'Link to this section'
        },
        children: [{ type: 'text', value: '#' }]
      });
    });
  };
}
