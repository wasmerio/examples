interface HastNode {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
  value?: string;
}

/**
 * Rehype plugin that adds target="_blank" and an accessible screen reader cue to external links (http://, https://, //)
 * and removes any rel attributes from <a> tags.
 */
export function rehypeExternalLinks() {
  return (tree: HastNode) => {
    function visit(node: HastNode) {
      if (!node || typeof node !== 'object') return;

      if (
        node.type === 'element' &&
        node.tagName === 'a' &&
        node.properties?.href
      ) {
        const href = String(node.properties.href);
        if (/^(https?:)?\/\//i.test(href)) {
          node.properties.target = '_blank';

          if (!node.children) node.children = [];

          const hasSrCue = node.children.some(
            (child) =>
              child.type === 'element' &&
              child.tagName === 'span' &&
              Array.isArray(child.properties?.className) &&
              child.properties?.className.includes('sr-only')
          );

          if (!hasSrCue) {
            node.children.push({
              type: 'element',
              tagName: 'span',
              properties: { className: ['sr-only'] },
              children: [{ type: 'text', value: ' (opens in a new tab)' }],
            });
          }
        }
        delete node.properties.rel;
      }

      node.children?.forEach(visit);
    }

    visit(tree);
  };
}
