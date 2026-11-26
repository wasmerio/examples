import { describe, expect, it } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import { VFile } from 'vfile';
import remarkReadingTime, { estimateReadingTime } from './remark-reading-time';

/** 只运行 transformer（不需要 stringify），返回处理后的 VFile */
async function runPlugin(md: string, plugins: 'with-math' | 'bare' = 'with-math'): Promise<VFile> {
  const processor =
    plugins === 'with-math'
      ? unified().use(remarkParse).use(remarkMath).use(remarkReadingTime)
      : unified().use(remarkParse).use(remarkReadingTime);
  const file = new VFile(md);
  const tree = processor.parse(file);
  await processor.run(tree, file);
  return file;
}

async function readingTimeOf(md: string): Promise<number> {
  const file = await runPlugin(md);
  const fm = (file.data as { astro?: { frontmatter?: { readingTime?: number } } }).astro
    ?.frontmatter;
  return fm?.readingTime as number;
}

describe('estimateReadingTime', () => {
  it('纯中文 700 字为 2 分钟', () => {
    expect(estimateReadingTime('中'.repeat(700))).toBe(2);
  });

  it('纯英文 400 词为 2 分钟', () => {
    expect(estimateReadingTime(Array(400).fill('word').join(' '))).toBe(2);
  });

  it('空文本为 1 分钟（最少 1 分钟）', () => {
    expect(estimateReadingTime('')).toBe(1);
    expect(estimateReadingTime('   \n  ')).toBe(1);
  });

  it('向上取整：351 个中文字为 2 分钟', () => {
    expect(estimateReadingTime('中'.repeat(351))).toBe(2);
  });

  it('覆盖平假名、片假名、兼容表意文字', () => {
    expect(estimateReadingTime('あ'.repeat(350))).toBe(1);
    expect(estimateReadingTime('ア'.repeat(701))).toBe(3);
    expect(estimateReadingTime('豈'.repeat(701))).toBe(3);
  });

  it('代码块按 0.3 权重计入（中文字符）', () => {
    // 3000 字代码 × 0.3 / 350 ≈ 2.57 → 3 分钟；按全量计算会是 9 分钟
    expect(estimateReadingTime('', '中'.repeat(3000))).toBe(3);
  });

  it('代码块按 0.3 权重计入（西文词）', () => {
    // 1000 词代码 × 0.3 / 200 = 1.5 → 2 分钟；按全量计算会是 5 分钟
    expect(estimateReadingTime('', Array(1000).fill('x').join(' '))).toBe(2);
  });

  it('正文与代码块的 CJK 和西文分别统计后合并', () => {
    // 正文 350 字 → 1 分钟，代码 200 词 × 0.3 / 200 = 0.3 → 合计 1.3 → 2 分钟
    expect(estimateReadingTime('中'.repeat(350), Array(200).fill('a').join(' '))).toBe(2);
  });
});

describe('remarkReadingTime 插件', () => {
  it('把结果写入 file.data.astro.frontmatter.readingTime', async () => {
    expect(await readingTimeOf('中'.repeat(700))).toBe(2);
  });

  it('文件 data 为空时会创建 astro.frontmatter', async () => {
    const file = await runPlugin('hello world', 'bare');
    const data = file.data as { astro: { frontmatter: { readingTime: number } } };
    expect(data.astro.frontmatter.readingTime).toBe(1);
  });

  it('代码块内容按 0.3 权重计入（Markdown 整体）', async () => {
    const code = Array(1000).fill('x').join(' ');
    const md = '```ts\n' + code + '\n```\n';
    // 只有代码块，1000 词 × 0.3 / 200 = 1.5 → 2
    expect(await readingTimeOf(md)).toBe(2);
    // 代码块不加权时 1000 / 200 = 5；这里确认确实按 0.3 计入
    expect(await readingTimeOf(md)).toBeLessThan(5);
  });

  it('公式不计入正文字数', async () => {
    const formula = Array(2000).fill('x').join(' ');
    const md = `$$\n${formula}\n$$\n\n行内 $${formula}$ 结束`;
    expect(await readingTimeOf(md)).toBe(1);
  });

  it('行内代码计入正文', async () => {
    const md = '`word` '.repeat(400);
    expect(await readingTimeOf(md)).toBe(2);
  });
});
