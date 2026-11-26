/**
 * 文字中的行内公式：把 `Step.caption` / 标题里的 `$…$` 切成文本段和公式段。纯函数，不依赖 KaTeX。
 *
 * 规则（与 Pandoc 的 tex_math_dollars 一致，避免把金额当成公式）：
 * - `$` 后面紧跟空白时不是开头；结尾的 `$` 前面不能是空白，后面不能紧跟数字。所以 `$5 和 $10` 仍是普通文字。
 * - `$$…$$` 也按行内公式处理（讲解的说明区里没有块级公式）。
 * - `\$` 是字面量美元符号；公式内部的 `\$`、`\{` 等转义原样交给 KaTeX。
 * - 没有配对的 `$` 原样保留。
 */
export type RichSegment = { type: 'text'; value: string } | { type: 'math'; value: string };

const isSpace = (c: string | undefined) => c !== undefined && /\s/.test(c);
const isDigit = (c: string | undefined) => c !== undefined && c >= '0' && c <= '9';

/** 从 from 开始找单个 `$` 的结尾位置；找不到返回 -1。 */
function findClose(s: string, from: number): number {
  for (let j = from; j < s.length; j++) {
    const c = s[j];
    if (c === '\\') {
      j++;
      continue;
    }
    if (c === '$') {
      if (isSpace(s[j - 1]) || isDigit(s[j + 1])) continue;
      return j;
    }
  }
  return -1;
}

/** 从 from 开始找 `$$` 的结尾位置；找不到返回 -1。 */
function findDoubleClose(s: string, from: number): number {
  for (let j = from; j < s.length - 1; j++) {
    if (s[j] === '\\') {
      j++;
      continue;
    }
    if (s[j] === '$' && s[j + 1] === '$') return j;
  }
  return -1;
}

/** `'令 $q = W^Q x$，\\$ 是美元'` → 文本「令 」、公式「q = W^Q x」、文本「，$ 是美元」。 */
export function parseInlineMath(s: string): RichSegment[] {
  const out: RichSegment[] = [];
  let text = '';
  const flush = () => {
    if (text) out.push({ type: 'text', value: text });
    text = '';
  };
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === '\\' && s[i + 1] === '$') {
      text += '$';
      i += 2;
      continue;
    }
    if (c === '$') {
      if (s[i + 1] === '$') {
        const end = findDoubleClose(s, i + 2);
        const body = end === -1 ? '' : s.slice(i + 2, end);
        if (body.trim()) {
          flush();
          out.push({ type: 'math', value: body });
          i = end + 2;
          continue;
        }
        text += '$$';
        i += 2;
        continue;
      }
      if (i + 1 < s.length && !isSpace(s[i + 1])) {
        const end = findClose(s, i + 1);
        if (end !== -1) {
          flush();
          out.push({ type: 'math', value: s.slice(i + 1, end) });
          i = end + 1;
          continue;
        }
      }
    }
    text += c;
    i++;
  }
  flush();
  return out;
}

/** 去掉公式定界符的纯文本（用作 aria-label 等只能放纯文本的地方）：`'图 1：$C = AB$'` → `'图 1：C = AB'`。 */
export const plainInlineMath = (s: string): string =>
  parseInlineMath(s)
    .map((x) => x.value)
    .join('');

/** 字符串里是否有至少一段公式（决定要不要加载 KaTeX）。 */
export const hasInlineMath = (s: string | undefined): boolean =>
  !!s && s.includes('$') && parseInlineMath(s).some((x) => x.type === 'math');

/**
 * 拆出标题开头的图号：`'图 05-2a：注意力'` → `{ label: '图 05-2a', rest: '：注意力' }`。
 * 认得 图 / 表 / Figure / Fig. / Table，编号由字母、数字、`.`、`-` 组成，后面必须跟冒号（全角或半角）或句点加空格。
 * 没有图号时 label 为 undefined，rest 为原标题。
 */
export function splitFigureLabel(title: string): { label?: string; rest: string } {
  const m = /^((?:图|表|Figure|Fig\.|Table)\s*[0-9A-Za-z][0-9A-Za-z.-]*?)(\s*[：:]\s*|\.\s+)/u.exec(
    title,
  );
  if (!m) return { rest: title };
  return { label: m[1], rest: title.slice(m[1].length) };
}
