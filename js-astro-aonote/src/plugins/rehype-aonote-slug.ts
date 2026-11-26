import type { Root } from 'hast';
import type { Element } from 'hast';
import { toString } from 'mdast-util-to-string';
import { visit } from 'unist-util-visit';
import { headingSlugify } from '../utils/slug';

/** Heading ids using upstream CJK-friendly slug rules (replaces rehype-slug). */
export function rehypeAonoteSlug() {
  const seen = new Map<string, number>();

  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (!/^h[1-6]$/.test(node.tagName)) return;
      const text = toString(node).trim();
      if (!text) return;

      const base = headingSlugify(text);
      if (!base) return;

      let id = base;
      let count = seen.get(base) ?? 0;
      while (seen.has(id)) {
        count += 1;
        id = `${base}-${count}`;
      }
      seen.set(id, count);

      node.properties = { ...node.properties, id };
    });
  };
}
