/**
 * 图题语法（所有 figure 共用：draw.io / Excalidraw、Mermaid、Markdown 图片、<Figure>）。
 *
 * 题注以图号开头时（「图 05-1：」「图 3:」「Figure 2.」「Fig. 2:」）把图号拆出来，
 * 排成 `<span class="wisp-fig-no">`（墨色、600、表格数字），其余文字保持 muted。
 * 作者没写图号就不拆，也不自动编号。
 *
 * 只依赖字符串：render-diagram（打进 SSR）、remark/rehype 插件、Figure.astro 都能引用。
 */

/**
 * 图号：
 * - 前缀：`图` / `圖` / `Figure` / `Fig` / `Fig.`（大小写不敏感），前缀与数字之间空格可有可无；
 * - 编号：`3`、`05-1`、`2.1`、`3–2`、`10a`（数字段之间用 - – . 连接，末尾可带一个字母）；
 * - 分隔：全角或半角冒号、全角句点、后面跟空白的半角句点（算进图号），
 *   或两侧有空格的破折号「 — 」「 – 」（不算进图号），或题注只有图号本身。
 *   半角句点必须后跟空白：「Figure 2.1 shows」不会回溯成「Figure 2.」+「1 shows」。
 * 「图 3 展示了……」这样以图号开头的句子没有分隔符，不会被拆。
 */
export const FIGURE_LABEL =
  /^((?:图|圖|Figure|Fig\.?)[ \t 　]*\d+(?:[-–.]\d+)*[A-Za-z]?)(?:([ \t 　]*(?:[:：．]|\.(?=\s|$)))|(?=[ \t 　]+[—–][ \t 　])|(?=[ \t 　]*$))/i;

export interface FigureCaptionParts {
  /** 图号（含冒号 / 句点），没有图号时为 undefined */
  label?: string;
  /** 图号之后的文字（保留作者写的前导空白）；没有图号时就是整段题注 */
  text: string;
}

export function splitFigureCaption(caption: string): FigureCaptionParts {
  const m = FIGURE_LABEL.exec(caption);
  if (!m) return { text: caption };
  const label = m[1]! + (m[2]?.trim() ?? '');
  return { label, text: caption.slice(m[0].length) };
}

const escText = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** 题注的 HTML（已转义）：`<span class="wisp-fig-no">图 1：</span>自注意力`。 */
export function figureCaptionHtml(caption: string): string {
  const { label, text } = splitFigureCaption(caption);
  return label
    ? `<span class="wisp-fig-no">${escText(label)}</span>${escText(text)}`
    : escText(text);
}
