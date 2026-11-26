import type { Element, ElementContent, Root } from 'hast';
import { SKIP, visit } from 'unist-util-visit';
import { splitFigureCaption } from './figure-caption';

/**
 * 带标题的独立图片 → figure + 题注：
 *
 *   ![alt](./x.webp '图 05-3：…')
 *   <p><img src alt title></p>
 *   → <figure class="wisp-figure wisp-image"><img src alt><figcaption><span class="wisp-fig-no">图 05-3：</span>…</figcaption></figure>
 *
 * - 只处理「段落里只有一张图片」的情况；没有 title 的图片、行内图片、包在链接里的图片保持原样。
 * - title 移到 figcaption，同时从 img 上去掉（不再出现重复的悬停提示）。
 * - 必须是 rehype 插件：Astro 的图片优化（rehype-images / MDX 的 rehypeImageToComponent）在用户
 *   rehype 插件之后按 tagName 查找 img，与父元素无关，所以换成 figure 不影响 src 解析。
 * - 图表引用（.excalidraw / .drawio）在 remark 阶段已由 remark-diagram 换成 figure，到这里已不是 img。
 */
export default function rehypeFigure() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element, index, parent) => {
      if (node.tagName !== 'p' || !parent || index === undefined) return;
      const kids = node.children.filter((c) => !(c.type === 'text' && !c.value.trim()));
      const img = kids[0];
      if (kids.length !== 1 || img?.type !== 'element' || img.tagName !== 'img') return;
      const title = img.properties?.title;
      const caption = typeof title === 'string' ? title.trim() : '';
      if (!caption) return;
      delete img.properties.title;

      const { label, text } = splitFigureCaption(caption);
      const content: ElementContent[] = [];
      if (label)
        content.push({
          type: 'element',
          tagName: 'span',
          properties: { className: ['wisp-fig-no'] },
          children: [{ type: 'text', value: label }],
        });
      if (text) content.push({ type: 'text', value: text });

      parent.children[index] = {
        type: 'element',
        tagName: 'figure',
        properties: { className: ['wisp-figure', 'wisp-image'] },
        children: [
          img,
          { type: 'element', tagName: 'figcaption', properties: {}, children: content },
        ],
      };
      return SKIP;
    });
  };
}
