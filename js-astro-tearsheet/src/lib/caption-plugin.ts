// Captions, build side: a Sätteri mdast plugin. A paragraph holding only an image, followed by a
// paragraph that is one run of emphasis (`*Caption. Photo: name, licence.*`), makes the second
// one a caption: class `caption`, styled in global.css. CSS alone cannot tell it apart from a
// paragraph that merely contains one emphasised word, because :only-child ignores text.
import type { SatteriProcessorOptions } from '@astrojs/markdown-satteri';

type Entry = NonNullable<SatteriProcessorOptions['mdastPlugins']>[number];
type Plugin = Extract<Entry, { name: string }>;
type Node = { type: string; children?: Node[]; data?: unknown };

const only = (node: Node | undefined, type: string) =>
  node?.type === 'paragraph' && node.children?.length === 1 && node.children[0]!.type === type;

/** Indexes of the top-level blocks that are captions. Exported for cut.check.ts. */
export const captionIndexes = (blocks: Node[]) =>
  blocks.flatMap((block, i) =>
    i > 0 && only(blocks[i - 1], 'image') && only(block, 'emphasis') ? [i] : [],
  );

export const captionPlugin: Plugin = {
  name: 'tearsheet-caption',
  before(root, ctx) {
    const blocks = root.children as unknown as Node[];
    for (const i of captionIndexes(blocks).reverse()) {
      // Plain copy: the visitor hands out read-only views, and a new node must be a plain object.
      const caption = {
        ...JSON.parse(JSON.stringify(blocks[i])),
        data: { hProperties: { className: ['caption'] } },
      };
      ctx.removeChildAt(root, i);
      ctx.insertChildAt(root, i, [caption] as never);
    }
  },
};
