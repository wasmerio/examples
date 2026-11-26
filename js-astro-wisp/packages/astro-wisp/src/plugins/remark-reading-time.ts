import type { Root } from 'mdast';
import type { Plugin } from 'unified';
import { SKIP, visit } from 'unist-util-visit';

/** 中文阅读速度：字/分钟 */
const CJK_PER_MINUTE = 350;
/** 西文阅读速度：词/分钟 */
const WORDS_PER_MINUTE = 200;
/** 代码块内容的权重 */
const CODE_WEIGHT = 0.3;

/**
 * CJK 字符范围：
 * 㐀-鿿（U+3400–U+9FFF，统一表意文字扩展 A 与基本区）、
 * 豈-﫿（U+F900–U+FAFF，兼容表意文字）、
 * ぀-ヿ（U+3040–U+30FF，平假名与片假名）、
 * 以及扩展 B（U+20000–U+2A6DF）。
 */
const CJK_RE = /[぀-ヿ㐀-鿿豈-﫿\u{20000}-\u{2A6DF}]/gu;
/** 西文词：字母或数字组成的串，允许中间有撇号或连字符 */
const WORD_RE = /[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu;

function countWeighted(text: string): { cjk: number; words: number } {
  const cjk = text.match(CJK_RE)?.length ?? 0;
  const western = text.replace(CJK_RE, ' ');
  const words = western.match(WORD_RE)?.length ?? 0;
  return { cjk, words };
}

/**
 * 估算阅读时长（分钟，向上取整，最少 1 分钟）。
 * @param text 正文纯文本（不含代码块）
 * @param codeText 代码块内容，按 0.3 权重计入
 */
export function estimateReadingTime(text: string, codeText = ''): number {
  const prose = countWeighted(text);
  const code = countWeighted(codeText);
  const minutes =
    (prose.cjk + CODE_WEIGHT * code.cjk) / CJK_PER_MINUTE +
    (prose.words + CODE_WEIGHT * code.words) / WORDS_PER_MINUTE;
  // 先舍入到 1e-9 精度，避免浮点误差让 2.0000000001 被向上取整成 3
  const rounded = Math.round(minutes * 1e9) / 1e9;
  return Math.max(1, Math.ceil(rounded));
}

interface AstroFileData {
  astro?: { frontmatter?: Record<string, unknown> };
}

/**
 * remark 插件：计算阅读时长，写入 `file.data.astro.frontmatter.readingTime`。
 * 代码块（code 节点）按 0.3 权重计入；公式（math / inlineMath）不计入正文。
 */
const remarkReadingTime: Plugin<[], Root> = () => (tree, file) => {
  const prose: string[] = [];
  const code: string[] = [];

  visit(tree, (node) => {
    switch (node.type) {
      case 'code':
        code.push(node.value);
        return SKIP;
      case 'math':
      case 'inlineMath':
        return SKIP;
      case 'text':
      case 'inlineCode':
        prose.push(node.value);
        return;
      default:
        return;
    }
  });

  const readingTime = estimateReadingTime(prose.join('\n'), code.join('\n'));

  const data = file.data as AstroFileData;
  data.astro ??= {};
  data.astro.frontmatter ??= {};
  data.astro.frontmatter.readingTime = readingTime;
};

export default remarkReadingTime;
