import { describe, expect, it } from 'vitest';
import { clampIndex, focusOf, itemId, record, cellId, stepAt } from './timeline';
import { toneFill, toneStroke } from './tones';

describe('timeline', () => {
  it('clampIndex', () => {
    expect(clampIndex(-1, 3)).toBe(0);
    expect(clampIndex(9, 3)).toBe(2);
    expect(clampIndex(1.7, 3)).toBe(1);
    expect(clampIndex(Number.NaN, 3)).toBe(0);
    expect(clampIndex(2, 0)).toBe(0);
  });
  it('stepAt 越界夹紧且空时间线抛错', () => {
    const steps = [
      { state: 'a', caption: '第一步' },
      { state: 'b', caption: '第二步' },
    ];
    expect(stepAt(steps, -2)).toBe(steps[0]);
    expect(stepAt(steps, 1.9)).toBe(steps[1]);
    expect(stepAt(steps, 99)).toBe(steps[1]);
    expect(stepAt(steps, Number.NaN)).toBe(steps[0]);
    expect(() => stepAt([], 0)).toThrow(/空/);
  });
  it('record 每次 emit 保存独立快照，支持可选 label / duration / focus', () => {
    const steps = record({ arr: [3, 1, 2] }, (s, emit) => {
      emit('初始');
      [s.arr[0], s.arr[1]] = [s.arr[1], s.arr[0]];
      emit('交换', [itemId('arr', 0), itemId('arr', 1)]);
      emit('完成', { label: '完成', duration: 4200, focus: [itemId('arr', 0)] });
    });
    expect(steps.map((x) => x.state.arr)).toEqual([
      [3, 1, 2],
      [1, 3, 2],
      [1, 3, 2],
    ]);
    expect(steps[0]).not.toHaveProperty('focus');
    expect(steps[0]).not.toHaveProperty('label');
    expect(steps[1].focus).toEqual(['arr:0', 'arr:1']);
    expect(steps[2]).toMatchObject({
      caption: '完成',
      label: '完成',
      duration: 4200,
      focus: ['arr:0'],
    });
  });
  it('record 不修改输入，且至少要有一步', () => {
    const input = { n: 1 };
    record(input, (s, emit) => {
      s.n = 2;
      emit('x');
    });
    expect(input.n).toBe(1);
    expect(() => record(input, () => {})).toThrow(/至少/);
  });
  it('focusOf 按前缀取键', () => {
    expect([...focusOf([cellId('a', 1, 0), cellId('b', 0, 0), 'ab:1'], 'a')]).toEqual(['1,0']);
    expect(focusOf(undefined, 'a').size).toBe(0);
  });
});

describe('tones', () => {
  it('语义色与 hue 分别映射到各自的令牌', () => {
    expect(toneStroke('q')).toBe('var(--wisp-sem-q)');
    expect(toneFill('visited')).toBe('var(--wisp-sem-visited-fill)');
    expect(toneStroke('blue')).toBe('var(--wisp-hue-blue)');
    expect(toneFill('slate')).toBe('var(--wisp-hue-slate-fill)');
  });
});
