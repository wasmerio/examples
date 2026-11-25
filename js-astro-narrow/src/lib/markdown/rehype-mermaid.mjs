function visit(node) {
  if (!Array.isArray(node.children)) return;

  for (let index = 0; index < node.children.length; index += 1) {
    const child = node.children[index];
    if (
      child.type === 'element' &&
      child.tagName === 'pre' &&
      child.children?.[0]?.type === 'element' &&
      child.children[0].tagName === 'code'
    ) {
      const code = child.children[0];
      const className = code.properties?.className || [];
      if (className.includes('language-mermaid')) {
        node.children[index] = {
          type: 'element',
          tagName: 'div',
          properties: { className: ['mermaid'], dataMermaid: 'true' },
          children: code.children || []
        };
        continue;
      }
    }

    visit(child);
  }
}

export function rehypeMermaid() {
  return (tree) => visit(tree);
}
