import { describe, expect, it } from 'vitest';
import { hasInlineMath, parseInlineMath, plainInlineMath, splitFigureLabel } from './math';

const t = (value: string) => ({ type: 'text', value });
const m = (value: string) => ({ type: 'math', value });

describe('parseInlineMath', () => {
  it('没有公式时整段是文本', () => {
    expect(parseInlineMath('普通说明')).toEqual([t('普通说明')]);
    expect(parseInlineMath('')).toEqual([]);
  });
  it('切出行内公式', () => {
    expect(parseInlineMath('令 $q = W^{Q} x$，再乘 $K^\\top$')).toEqual([
      t('令 '),
      m('q = W^{Q} x'),
      t('，再乘 '),
      m('K^\\top'),
    ]);
    expect(parseInlineMath('$C_{ij}$')).toEqual([m('C_{ij}')]);
  });
  it('\\$ 是字面量美元符号', () => {
    expect(parseInlineMath('价格 \\$5，公式 $x$')).toEqual([t('价格 $5，公式 '), m('x')]);
  });
  it('公式内的转义不会提前结束公式', () => {
    expect(parseInlineMath('$a \\$ b$')).toEqual([m('a \\$ b')]);
    expect(parseInlineMath('$\\{x\\}$ 后')).toEqual([m('\\{x\\}'), t(' 后')]);
  });
  it('金额不是公式（Pandoc 规则）', () => {
    expect(parseInlineMath('从 $5 涨到 $10')).toEqual([t('从 $5 涨到 $10')]);
    expect(parseInlineMath('$ x$')).toEqual([t('$ x$')]);
    expect(parseInlineMath('$x $')).toEqual([t('$x $')]);
  });
  it('未配对的 $ 原样保留', () => {
    expect(parseInlineMath('只有一个 $x')).toEqual([t('只有一个 $x')]);
    expect(parseInlineMath('结尾 $')).toEqual([t('结尾 $')]);
  });
  it('$$…$$ 当作行内公式；空的 $$ 是文字', () => {
    expect(parseInlineMath('看 $$a+b$$ 吧')).toEqual([t('看 '), m('a+b'), t(' 吧')]);
    expect(parseInlineMath('$$')).toEqual([t('$$')]);
    expect(parseInlineMath('$$x')).toEqual([t('$$x')]);
  });
  it('plainInlineMath 去掉定界符', () => {
    expect(plainInlineMath('图 1：$C = AB$，\\$5')).toBe('图 1：C = AB，$5');
  });
  it('hasInlineMath', () => {
    expect(hasInlineMath('a $x$ b')).toBe(true);
    expect(hasInlineMath('$5 和 $10')).toBe(false);
    expect(hasInlineMath('W^UK')).toBe(false);
    expect(hasInlineMath(undefined)).toBe(false);
  });
});

describe('splitFigureLabel', () => {
  it('中文图号', () => {
    expect(splitFigureLabel('图 05-2a：MLA 的吸收')).toEqual({
      label: '图 05-2a',
      rest: '：MLA 的吸收',
    });
    expect(splitFigureLabel('图3: x')).toEqual({ label: '图3', rest: ': x' });
    expect(splitFigureLabel('表 1：对比')).toEqual({ label: '表 1', rest: '：对比' });
  });
  it('英文图号', () => {
    expect(splitFigureLabel('Figure 2: Attention')).toEqual({
      label: 'Figure 2',
      rest: ': Attention',
    });
    expect(splitFigureLabel('Fig. 4.1. Tiling')).toEqual({ label: 'Fig. 4.1', rest: '. Tiling' });
  });
  it('没有图号', () => {
    expect(splitFigureLabel('矩阵乘法')).toEqual({ rest: '矩阵乘法' });
    expect(splitFigureLabel('图解注意力')).toEqual({ rest: '图解注意力' });
    expect(splitFigureLabel('Figures of merit: x')).toEqual({ rest: 'Figures of merit: x' });
  });
});
