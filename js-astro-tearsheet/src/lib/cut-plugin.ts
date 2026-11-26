// The Cut, build side: a Sätteri mdast plugin that drops everything after <!-- cut --> (MDX:
// {/* cut */}), so the members part of an issue never reaches the HTML or the RSS feed. Word counts come from the source (src/lib/cut.ts), which is not shipped.
import type { SatteriProcessorOptions } from '@astrojs/markdown-satteri';
import { CUT } from './cut';

// satteri is not a direct dependency, so its plugin type comes through the Astro adapter.
type Entry = NonNullable<SatteriProcessorOptions['mdastPlugins']>[number];
type Plugin = Extract<Entry, { name: string }>;
type Node = { type: string; value?: unknown };

const isMarker = (node: Node) =>
  (node.type === 'html' && String(node.value).trim() === CUT) ||
  (node.type === 'mdxFlowExpression' && String(node.value).trim() === '/* cut */');

// A factory, so each document gets its own set of cut footnotes.
export const cutPlugin = (): Plugin => {
  const cutFootnotes = new Set<string>();
  return {
    name: 'tearsheet-cut',
    before(root, ctx) {
      const at = root.children.findIndex(isMarker);
      if (at === -1) return;
      for (const node of root.children.slice(at))
        if (node.type === 'footnoteDefinition') cutFootnotes.add(node.identifier);
      for (let i = root.children.length - 1; i >= at; i--) ctx.removeChildAt(root, i);
    },
    // A reference above the cut whose note sat below it would print as a bare [^1].
    footnoteReference(node, ctx) {
      if (cutFootnotes.has(node.identifier)) ctx.removeNode(node);
    },
    // A marker inside a list or quote would count the issue as members-only but cut nothing.
    // Fail the build rather than publish the members text.
    html(node, ctx) {
      if (isMarker(node) && ctx.parent(node)?.type !== 'root')
        throw new Error(`${CUT} must stand on its own line between paragraphs, not inside a block`);
    },
  };
};
