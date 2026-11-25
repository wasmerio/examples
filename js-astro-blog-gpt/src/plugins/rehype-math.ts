import rehypeKatex from 'rehype-katex';
import { markdownFeature } from '../lib/article-options.ts';

export default function rehypeMath({ enabled = true } = {}) {
  const render = rehypeKatex({ trust: false });
  return (
    tree: Parameters<typeof render>[0],
    file: Parameters<typeof render>[1],
  ) => {
    if (markdownFeature(file, 'math', enabled)) return render(tree, file);
    // Keep disabled formulas as readable TeX without an unknown "math" grammar.
    const visit = (node: typeof tree | (typeof tree)['children'][number]) => {
      if (
        node.type === 'element' &&
        node.tagName === 'code' &&
        Array.isArray(node.properties.className)
      ) {
        node.properties.className = node.properties.className.map((name) =>
          name === 'language-math' ? 'language-tex' : name,
        );
      }
      if ('children' in node) for (const child of node.children) visit(child);
    };
    visit(tree);
  };
}
