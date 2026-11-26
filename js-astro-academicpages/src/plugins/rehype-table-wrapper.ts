interface HastNode {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
  value?: string;
}

/**
 * Rehype plugin that wraps <table> elements in <div class="table-wrapper overflow-x-auto my-5">
 * to provide responsive horizontal scrolling at build time without requiring client-side DOM manipulation.
 */
export function rehypeTableWrapper() {
  return (tree: HastNode) => {
    function visit(node: HastNode) {
      if (!node || !node.children || !Array.isArray(node.children)) return;

      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (
          child.type === 'element' &&
          child.tagName === 'table' &&
          !(
            node.type === 'element' &&
            node.tagName === 'div' &&
            Array.isArray(node.properties?.className) &&
            (node.properties?.className as string[]).includes('table-wrapper')
          )
        ) {
          const wrapper: HastNode = {
            type: 'element',
            tagName: 'div',
            properties: {
              className: ['table-wrapper', 'overflow-x-auto', 'my-5'],
            },
            children: [child],
          };
          node.children[i] = wrapper;
        } else visit(child);
      }
    }

    visit(tree);
  };
}
