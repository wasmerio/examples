// Wrap each table in a scroll container, so wide tables scroll on narrow
// screens while the <table> keeps real table layout (and its semantics).
import { visit } from 'unist-util-visit';

export default function rehypeTables() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'table' || parent?.properties?.className?.includes('table-wrap')) return;
      parent.children[index] = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['table-wrap'] },
        children: [node],
      };
    });
  };
}
