import type { Block, HeadingLevel } from "./blocks";
import { getRichTextPlainText } from "./blocks";

export type TocItem = {
  id: string;
  text: string;
  level: HeadingLevel;
};

export function generateToc(blocks: Block[]): TocItem[] {
  const items: TocItem[] = [];

  function visit(blockList: Block[]) {
    for (const block of blockList) {
      if (block.type === "heading") {
        items.push({
          id: block.id,
          text: getRichTextPlainText(block.richText),
          level: block.level,
        });
      }

      if (block.children?.length) {
        visit(block.children);
      }
    }
  }

  visit(blocks);
  return items;
}
