import type { Root, Blockquote, Paragraph, Text } from 'mdast';
import { visit } from 'unist-util-visit';

/**
 * GitHub-style alerts:  > [!NOTE] / [!TIP] / [!IMPORTANT] / [!WARNING] / [!CAUTION]
 * Rendered with Butterfly's own note classes, e.g. <div class="note info flat">:
 * NOTE→info, TIP→success, IMPORTANT→primary, WARNING→warning, CAUTION→danger.
 * Rarer Butterfly variants (default, colours, custom icons) use `:::note{…}`.
 * An optional title can follow the marker: > [!TIP] 小技巧
 */
const TYPES: Record<string, string> = { note: 'info', tip: 'success', important: 'primary', warning: 'warning', caution: 'danger' };
const MARKER = /^\[!(\w+)\][ \t]*([^\n]*)\n?/;

export default function remarkAlerts() {
  return (tree: Root) => {
    visit(tree, 'blockquote', (node: Blockquote) => {
      const first = node.children[0] as Paragraph | undefined;
      if (first?.type !== 'paragraph') return;
      const text = first.children[0] as Text | undefined;
      if (text?.type !== 'text') return;
      const m = text.value.match(MARKER);
      if (!m || !(m[1].toLowerCase() in TYPES)) return;

      const type = m[1].toLowerCase();
      const title = m[2].trim();
      text.value = text.value.slice(m[0].length);
      if (text.value === '') first.children.shift();
      // drop a leading <br> left by the marker line
      if (first.children[0]?.type === 'break') first.children.shift();
      if (first.children.length === 0) node.children.shift();

      if (title) {
        node.children.unshift({
          type: 'paragraph',
          data: { hProperties: { className: ['note-title'] } },
          children: [{ type: 'text', value: title }],
        } as unknown as Paragraph);
      }
      (node as { data?: unknown }).data = {
        hName: 'div',
        hProperties: { className: ['note', TYPES[type], 'flat'], role: 'note' },
      };
    });
  };
}
