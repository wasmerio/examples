import { describe, expect, it } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import { VFile } from 'vfile';
import remarkHasMath from './remark-has-math';

/** 只运行 transformer（不需要 stringify），返回处理后的 VFile */
async function runPlugin(md: string): Promise<VFile> {
  const processor = unified().use(remarkParse).use(remarkMath).use(remarkHasMath);
  const file = new VFile(md);
  const tree = processor.parse(file);
  await processor.run(tree, file);
  return file;
}

async function hasMathOf(md: string): Promise<boolean> {
  const file = await runPlugin(md);
  return (file.data as { astro?: { frontmatter?: { hasMath?: boolean } } }).astro?.frontmatter
    ?.hasMath as boolean;
}

describe('remarkHasMath 插件', () => {
  it('识别行内公式', async () => {
    expect(await hasMathOf('质能方程 $E=mc^2$ 很有名。')).toBe(true);
  });

  it('识别块级公式', async () => {
    expect(await hasMathOf('下面是公式：\n\n$$\n\\sum_{i=1}^{n} i\n$$\n')).toBe(true);
  });

  it('没有公式时写入 false', async () => {
    expect(await hasMathOf('# 标题\n\n普通段落，没有公式。\n\n```js\nconst a = 1;\n```')).toBe(
      false,
    );
  });

  it('金额等美元符号不被误判（无闭合时）', async () => {
    expect(await hasMathOf('价格是 $5 左右。')).toBe(false);
  });

  it('文件 data 为空时会创建 astro.frontmatter 并写入布尔值', async () => {
    const file = await runPlugin('plain');
    const data = file.data as { astro: { frontmatter: { hasMath: boolean } } };
    expect(data.astro.frontmatter.hasMath).toBe(false);
  });
});
