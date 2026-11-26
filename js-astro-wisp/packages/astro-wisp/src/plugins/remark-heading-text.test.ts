import { describe, expect, it } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import { VFile } from 'vfile';
import remarkHeadingText, { type TocHeadingEntry } from './remark-heading-text';

async function runHeading(md: string) {
  const processor = unified().use(remarkParse).use(remarkMath).use(remarkHeadingText);
  const file = new VFile(md);
  const tree = processor.parse(file);
  await processor.run(tree, file);
  return (
    file.data as {
      astro?: {
        frontmatter?: { tocHeadingTexts?: string[]; tocHeadingEntries?: TocHeadingEntry[] };
      };
    }
  ).astro?.frontmatter;
}

async function textsOf(md: string): Promise<string[]> {
  return (await runHeading(md))?.tocHeadingTexts as string[];
}

describe('remarkHeadingText 插件', () => {
  it('标题中的行内公式还原为原始文本，而非渲染后搅乱的文本', async () => {
    expect(await textsOf('## 从 $q$ 到 $\\mathcal{H}^{res}$')).toEqual([
      '从 $q$ 到 $\\mathcal{H}^{res}$',
    ]);
  });

  it('无公式的标题原样返回，含加粗/行内代码时取文字内容', async () => {
    expect(await textsOf('## 普通 **加粗** 和 `code`')).toEqual(['普通 加粗 和 code']);
  });

  it('按文档顺序收集所有深度', async () => {
    expect(await textsOf('# 一\n\n## 二\n\n### 三')).toEqual(['一', '二', '三']);
  });

  it('块级公式与段落不影响结果', async () => {
    expect(await textsOf('## 标题\n\n$$\nx=1\n$$\n\n段落 $y$')).toEqual(['标题']);
  });

  it('tocHeadingEntries 同时记录 depth、text 与含公式标题的 slug', async () => {
    const fm = await runHeading('# 一\n\n## 普通标题\n\n### 从 $q$ 到 $\\mathcal{H}^{res}$');
    expect(fm?.tocHeadingEntries).toEqual([
      { depth: 1, text: '一' },
      { depth: 2, text: '普通标题' },
      { depth: 3, text: '从 $q$ 到 $\\mathcal{H}^{res}$', slug: '从-q-到-hres' },
    ]);
    expect(fm?.tocHeadingTexts).toEqual(['一', '普通标题', '从 $q$ 到 $\\mathcal{H}^{res}$']);
  });
});

async function idsOf(md: string): Promise<Array<string | undefined>> {
  const processor = unified().use(remarkParse).use(remarkMath).use(remarkHeadingText);
  const file = new VFile(md);
  const tree = processor.parse(file);
  await processor.run(tree, file);
  return tree.children
    .filter((n) => n.type === 'heading')
    .map((n) => (n.data as { hProperties?: { id?: string } } | undefined)?.hProperties?.id);
}

describe('含公式标题的 id', () => {
  it('由源码生成：公式只贡献 ASCII 字母数字，字体命令去掉', async () => {
    expect(
      await idsOf(
        '## mHC：把 $\\mathcal{H}^{res}$ 关进一个集合\n\n## 含公式 $H^{res}$ 的标题\n\n## 从 $\\alpha_t$ 到 $\\beta$',
      ),
    ).toEqual(['mhc把-hres-关进一个集合', '含公式-hres-的标题', '从-alphat-到-beta']);
  });

  it('没有字母数字的公式整体丢掉；重复时加序号', async () => {
    expect(await idsOf('## 步骤 $+$ 一\n\n## 步骤 $-$ 一')).toEqual(['步骤-一', '步骤-一-1']);
  });

  it('不含公式的标题不写 id（仍由 Astro 生成，已有深链接不变）', async () => {
    expect(await idsOf('## 普通标题\n\n## 带 `code` 的标题')).toEqual([undefined, undefined]);
  });
});
