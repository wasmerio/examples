import { describe, expect, it } from 'vitest';
import {
  escapeHtml,
  formatTitleHtml,
  preventCjkOrphan,
  segmentTitleWords,
  splitSubwordTokens,
} from './title';

describe('title segmentation', () => {
  it('avoids inserting <wbr> before Kinsoku punctuation or after opening brackets', () => {
    const { html, segmented } = segmentTitleWords(
      'DeepSeek Sparse Attention（DSA）：闪电索引器与 Top-k 稀疏注意力',
      'zh-CN',
    );
    expect(segmented).toBe(true);
    expect(html).not.toContain('（<wbr>');
    expect(html).not.toContain('<wbr>）');
    expect(html).not.toContain('<wbr>：');
    expect(html).not.toContain('Top<wbr>-');
    expect(html).not.toContain('-<wbr>k');
    expect(html).toContain('）：<wbr>闪电');
    expect(html).toContain('<wbr>与 Top-k');
    expect(html).toContain('Attention<wbr>（DSA）：');
  });

  it('keeps multi-character Chinese words intact at word boundaries', () => {
    const { html, segmented } = segmentTitleWords('与矩阵吸收', 'zh-CN');
    expect(segmented).toBe(true);
    expect(html).toBe('与<wbr>矩阵<wbr>吸\u2060收');
  });

  it('prevents trailing single-character CJK orphans across segmentTitleWords and formatTitleHtml', () => {
    expect(segmentTitleWords('Prefill 与 Decode 的双路径选择', 'zh-CN').html).toBe(
      'Prefill 与 Decode 的<wbr>双<wbr>路径<wbr>选\u2060择',
    );
    expect(formatTitleHtml('双路径选择')).toBe('双路径选\u2060择');
    expect(segmentTitleWords('闪电索引器与潜空间动态稀疏筛选', 'zh-CN').html).toMatch(
      /筛\u2060选$/,
    );
    expect(formatTitleHtml('闪电索引器与潜空间动态稀疏筛选')).toMatch(/筛\u2060选$/);
    expect(segmentTitleWords('token 之间如何交换上下文', 'zh-CN').html).toMatch(/上下\u2060文$/);
    expect(formatTitleHtml('上下文')).toBe('上下\u2060文');
    expect(segmentTitleWords('在上下文中', 'zh-CN').html).toBe('在<wbr>上下文\u2060中');
    expect(segmentTitleWords('关于“筛选”。', 'zh-CN').html).toBe('关于<wbr>“筛\u2060选”。');
    expect(preventCjkOrphan('单字')).toBe('单\u2060字');
    expect(preventCjkOrphan('字')).toBe('字');
    expect(preventCjkOrphan('双<wbr>选')).toBe('双\u2060选');
    expect(preventCjkOrphan('选\u2060择')).toBe('选\u2060择');
  });

  it('skips segmentation and escapes HTML for non-Chinese titles', () => {
    const { html, segmented } = segmentTitleWords('A & B <C>', 'en');
    expect(segmented).toBe(false);
    expect(html).toBe(escapeHtml('A & B <C>'));
  });
});

describe('splitSubwordTokens & formatTitleHtml', () => {
  it('splits CamelCase, snake_case, dotted APIs, and slash paths without isolating surrounding text', () => {
    expect(formatTitleHtml('NVLink/NCCL')).toBe('NVLink/<wbr>NCCL');
    expect(formatTitleHtml('BatchExecutionDescriptor')).toBe('Batch<wbr>Execution<wbr>Descriptor');
    expect(formatTitleHtml('BreakableACLGraphWrapper')).toBe(
      'Breakable<wbr>ACL<wbr>Graph<wbr>Wrapper',
    );
    expect(formatTitleHtml('DeepSeekMoE')).toBe('Deep<wbr>Seek<wbr>MoE');
    expect(formatTitleHtml('moe_align_block_size')).toBe('moe_<wbr>align_<wbr>block_<wbr>size');
    expect(formatTitleHtml('_is_compatible')).toBe('_is_<wbr>compatible');
    expect(formatTitleHtml('torch.compile 与 Piecewise')).toBe('torch.<wbr>compile 与 Piecewise');
    expect(formatTitleHtml('vllm/v1/worker/ubatching.py')).toBe(
      'vllm/<wbr>v1/<wbr>worker/<wbr>ubatching.py',
    );
  });

  it('preserves hyphenated product names, short extensions, arxiv citations, and double slashes', () => {
    expect(formatTitleHtml('DeepSeek-V4')).toBe('DeepSeek-V4');
    expect(formatTitleHtml('ubatching.py')).toBe('ubatching.py');
    expect(formatTitleHtml('arXiv:2512.24880')).toBe('arXiv:2512.24880');
    const urlHtml = formatTitleHtml('https://example.com/a/b');
    expect(urlHtml).not.toContain('//<wbr>');
    expect(urlHtml).toContain('a/<wbr>b');
    expect(splitSubwordTokens('')).toEqual(['']);
  });

  it('applies subword boundaries inside segmented Chinese and English titles', () => {
    const zh = segmentTitleWords('用 BatchExecutionDescriptor 串联 NVLink/NCCL', 'zh-CN');
    expect(zh.segmented).toBe(true);
    expect(zh.html).toContain('Batch<wbr>Execution<wbr>Descriptor');
    expect(zh.html).toContain('NVLink/<wbr>NCCL');

    const zhUrl = segmentTitleWords('参考 https://example.com/a/b 说明', 'zh-CN');
    expect(zhUrl.html).not.toContain('//<wbr>');

    const en = segmentTitleWords('Inside BreakableACLGraphWrapper', 'en');
    expect(en.segmented).toBe(false);
    expect(en.html).toBe('Inside Breakable<wbr>ACL<wbr>Graph<wbr>Wrapper');
  });
});
