import type { Root, Code } from 'mdast';
import { visit } from 'unist-util-visit';

/**
 * ```mermaid fences become `<div class="mermaid-diagram">source</div>` before
 * Expressive Code sees them; scripts/mermaid.ts draws them in the browser. The
 * source is the fallback without JavaScript, and stays out of the search index.
 */
export default function remarkMermaid() {
  return (tree: Root) => {
    visit(tree, 'code', (node: Code, index, parent) => {
      if (node.lang !== 'mermaid' || !parent || typeof index !== 'number') return;
      parent.children[index] = {
        type: 'mermaidDiagram',
        position: node.position,
        data: {
          hName: 'div',
          hProperties: { className: ['mermaid-diagram'], dataPagefindIgnore: '' },
          hChildren: [{ type: 'text', value: node.value }],
        },
      } as unknown as Code;
    });
  };
}
