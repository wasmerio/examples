import GithubSlugger from 'github-slugger';
import type { Heading, PhrasingContent, Root } from 'mdast';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

interface AstroFileData {
  astro?: { frontmatter?: Record<string, unknown> };
}

/**
 * 把标题节点的行内内容还原为接近源码的纯文本：
 * 行内公式恢复为 `$...$`，其余标记（加粗、行内代码等）取其文字内容。
 * 渲染后的 hast 经 rehype-katex 处理后再提取纯文本会把公式搅乱（如 $w$ → "www"），
 * 目录等需要纯文本标题的场景必须用渲染前的形式。
 */
function rawText(nodes: PhrasingContent[]): string {
  let out = '';
  for (const node of nodes) {
    if (node.type === 'text' || node.type === 'inlineCode') out += node.value;
    else if (node.type === 'inlineMath') out += `$${node.value}$`;
    else if ('children' in node && Array.isArray((node as { children?: unknown }).children)) {
      out += rawText((node as { children: PhrasingContent[] }).children);
    }
  }
  return out;
}

/** 字体 / 样式类命令只改字形，不贡献文字：`\mathcal{H}` → `H`、`\text{res}` → `res`。 */
const TEX_STYLE =
  /\\(?:math[a-z]*|text[a-z]*|operatorname\*?|bold(?:symbol)?|bm|rm|bf|it|sf|tt|cal|scr|frak|displaystyle|textstyle|scriptstyle|left|right|big+[lr]?|Big+[lr]?)(?![a-zA-Z])/g;

/**
 * 行内公式在标题 id 里的写法：只留 ASCII 字母和数字。
 * `H^{res}` → `Hres`，`\mathcal{H}^{res}` → `Hres`，`\alpha_t` → `alphat`；没有字母数字时整体丢掉。
 */
export function texSlugText(tex: string): string {
  return tex
    .replace(TEX_STYLE, '')
    .replace(/\\([a-zA-Z]+)/g, '$1')
    .replace(/[^a-zA-Z0-9]+/g, '');
}

function slugText(nodes: PhrasingContent[]): string {
  let out = '';
  for (const node of nodes) {
    if (node.type === 'text' || node.type === 'inlineCode') out += node.value;
    else if (node.type === 'inlineMath') out += texSlugText(node.value);
    else if ('children' in node && Array.isArray((node as { children?: unknown }).children)) {
      out += slugText((node as { children: PhrasingContent[] }).children);
    }
  }
  return out;
}

function hasMath(nodes: PhrasingContent[]): boolean {
  return nodes.some(
    (n) =>
      n.type === 'inlineMath' ||
      ('children' in n &&
        Array.isArray((n as { children?: unknown }).children) &&
        hasMath((n as { children: PhrasingContent[] }).children)),
  );
}

export interface TocHeadingEntry {
  depth: number;
  text: string;
  slug?: string;
}

/**
 * remark 插件：按文档顺序收集所有标题的"渲染前"纯文本，
 * 写入 `file.data.astro.frontmatter.tocHeadingTexts`（字符串数组）与
 * `file.data.astro.frontmatter.tocHeadingEntries`（含 depth / text / 可选 slug）；
 * 并给含行内公式的标题写入由源码生成的 id。
 * 路由层用它覆盖 render() 返回的 headings[i].text（同时按 depth/slug 对齐以避开 MDX 中的 JSX 标题），
 * 供 Toc 组件在构建时用 KaTeX 渲染标题中的行内公式。
 */
const remarkHeadingText: Plugin<[], Root> = () => (tree, file) => {
  const texts: string[] = [];
  const entries: TocHeadingEntry[] = [];
  // 含行内公式的标题：id 由源码生成。否则 Astro 在 rehype-katex 之后从渲染结果取文字，
  // KaTeX 的 MathML + HTML 两份文字会拼成 `hreshreshres` 这样的乱码。
  // 只处理含公式的标题：其他标题仍由 Astro 生成 id，已有的深链接不变。
  const slugger = new GithubSlugger();
  visit(tree, 'heading', (node: Heading) => {
    const text = rawText(node.children);
    texts.push(text);
    if (!hasMath(node.children)) {
      entries.push({ depth: node.depth, text });
      return;
    }
    const data = (node.data ??= {}) as { hProperties?: Record<string, unknown> };
    data.hProperties ??= {};
    if (typeof data.hProperties.id !== 'string')
      data.hProperties.id = slugger.slug(slugText(node.children).replace(/\s+/g, ' ').trim());
    entries.push({ depth: node.depth, text, slug: String(data.hProperties.id) });
  });

  const data = file.data as AstroFileData;
  data.astro ??= {};
  data.astro.frontmatter ??= {};
  data.astro.frontmatter.tocHeadingTexts = texts;
  data.astro.frontmatter.tocHeadingEntries = entries;
};

export default remarkHeadingText;
