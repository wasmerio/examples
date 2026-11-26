import { toString } from 'mdast-util-to-string';
import type { Root, Table } from 'mdast';
// Side-effect type import: loads mdast-util-to-hast's `data.hProperties`
// module augmentation (see remark-code-meta.ts for details).
import type {} from 'mdast-util-to-hast';

type TableData = NonNullable<Table['data']> & { caption?: string };
import { parseTableCaptionLine } from '../utils/table-caption';

/** Move `Table: …` paragraphs into table `data` so rehype can build `<caption>`. */
export function remarkTableCaptions() {
  return (tree: Root) => {
    const { children } = tree;

    for (let i = 0; i < children.length; i++) {
      const node = children[i];
      if (node.type !== 'table') continue;

      let caption: string | undefined;
      let removeAt = -1;

      for (let j = i - 1; j >= 0; j--) {
        const prev = children[j];
        if (prev.type !== 'paragraph') break;

        const text = toString(prev).trim();
        if (!text) continue;

        caption = parseTableCaptionLine(text);
        if (caption) removeAt = j;
        break;
      }

      if (!caption || removeAt < 0) continue;

      const data = (node.data ?? {}) as TableData;
      data.caption = caption;
      data.hProperties = { ...data.hProperties, dataCaption: caption };
      node.data = data;

      children.splice(removeAt, 1);
      i -= 1;
    }
  };
}
