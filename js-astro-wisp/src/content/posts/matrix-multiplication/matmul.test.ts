import { describe, expect, it } from 'vitest';
import { matmul, matmulStepCount } from './matmul';

const real = (a: number[][], b: number[][]) =>
  a.map((r) => b[0].map((_, j) => r.reduce((s, v, k) => s + v * b[k][j], 0)));

describe('matmul', () => {
  it('2×2', () => {
    const a = [
        [1, 2],
        [3, 4],
      ],
      b = [
        [5, 6],
        [7, 8],
      ];
    const tl = matmul(a, b);
    expect(tl).toHaveLength(2 * 2 * 2 + 4 + 2);
    expect(tl[0].state.phase).toBe('start');
    const last = tl.at(-1)!.state;
    expect(last.phase).toBe('done');
    expect(last.c).toEqual(real(a, b));
    expect(last.c).toEqual([
      [19, 22],
      [43, 50],
    ]);
    expect(tl[1].caption).toBe('C[0][0] += 1 × 5 → 5');
    expect(tl[1].focus).toEqual(['a:0,0', 'b:0,0', 'c:0,0']);
    expect(tl[2].caption).toBe('C[0][0] += 2 × 7 → 19');
    expect(tl[3].caption).toBe('写入 C[0][0] = 19');
    expect(tl[3].state.c[0][0]).toBe(19);
    expect(tl[3].state.c[0][1]).toBeNull();
  });

  it('2×3 · 3×2', () => {
    const a = [
        [1, 2, 3],
        [4, 5, 6],
      ],
      b = [
        [7, 8],
        [9, 10],
        [11, 12],
      ];
    const tl = matmul(a, b);
    expect(tl).toHaveLength(matmulStepCount(2, 2, 3));
    expect(tl).toHaveLength(2 * 2 * 3 + 2 * 2 + 2);
    expect(tl.at(-1)!.state.c).toEqual(real(a, b));
    expect(tl.filter((s) => s.state.phase === 'multiply')).toHaveLength(12);
    expect(tl.filter((s) => s.state.phase === 'write')).toHaveLength(4);
    const s = tl.find((x) => x.caption === 'C[1][0] += 6 × 11 → 139')!;
    expect(s.focus).toEqual(['a:1,2', 'b:2,0', 'c:1,0']);
    expect(s.state).toMatchObject({ i: 1, j: 0, k: 2, partial: 139 });
  });

  it('1×1', () => {
    const tl = matmul([[3]], [[4]]);
    expect(tl).toHaveLength(4);
    expect(tl.at(-1)!.state.c).toEqual([[12]]);
  });

  it('负数使用真正的减号', () => {
    const tl = matmul([[-2]], [[3]]);
    expect(tl[1].caption).toBe('C[0][0] += −2 × 3 → −6');
  });

  it('state 互不共享可变数据', () => {
    const tl = matmul([[1, 2]], [[3], [4]]);
    expect(tl[1].state.c[0][0]).toBeNull();
    expect(tl.at(-1)!.state.c[0][0]).toBe(11);
  });

  it('非法输入抛错', () => {
    expect(() => matmul([[1, 2]], [[1, 2]])).toThrow();
    expect(() => matmul([], [[1]])).toThrow();
    expect(() => matmul([[1]], [])).toThrow();
    expect(() => matmul([[]], [[1]])).toThrow();
    expect(() => matmul([[1, 2], [3]], [[1], [2]])).toThrow();
    expect(() => matmul([[NaN]], [[1]])).toThrow();
  });
});
