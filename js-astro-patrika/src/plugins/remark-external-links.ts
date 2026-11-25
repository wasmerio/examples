import { visit } from 'unist-util-visit';
import type { Root, Link } from 'mdast';

export function remarkExternalLinks() {
  return (tree: Root) => {

    visit(tree, 'link', (node: Link) => {

      const isExternal =
        /^https?:\/\//.test(node.url);

      if (!isExternal) return;

      node.data ??= {};

      node.data.hProperties = {
        ...(node.data.hProperties || {}),
        target: '_blank',
        rel: 'noopener noreferrer',
      };
    });
  };
}

export default remarkExternalLinks;