import { cellId, formatNumber as f, type Timeline } from 'astro-wisp/explainers/core';

export type MatMulPhase = 'start' | 'multiply' | 'write' | 'done';

export interface MatMulState {
  a: number[][];
  b: number[][];
  /** 部分结果；尚未写回的元素为 null */
  c: (number | null)[][];
  i: number | null;
  j: number | null;
  k: number | null;
  /** 当前 C[i][j] 的累加值（start/done 为 null） */
  partial: number | null;
  phase: MatMulPhase;
}

function check(name: string, x: number[][]): void {
  if (!Array.isArray(x) || x.length === 0 || !Array.isArray(x[0]) || x[0].length === 0)
    throw new Error(`矩阵 ${name} 不能为空`);
  const w = x[0].length;
  for (const row of x) {
    if (!Array.isArray(row) || row.length !== w) throw new Error(`矩阵 ${name} 各行长度不一致`);
    for (const v of row)
      if (typeof v !== 'number' || !Number.isFinite(v)) throw new Error(`矩阵 ${name} 含非法数值`);
  }
}

/**
 * 步骤数 = 1（start）+ m·n·k（multiply）+ m·n（write）+ 1（done） = m·n·k + m·n + 2。
 * 顺序：对每个 (i, j)，依次 k=0..K-1 的 multiply，再一帧 write。
 */
export function matmulStepCount(m: number, n: number, k: number): number {
  return m * n * k + m * n + 2;
}

export function matmul(a: number[][], b: number[][]): Timeline<MatMulState> {
  check('A', a);
  check('B', b);
  const m = a.length,
    K = a[0].length,
    n = b[0].length;
  if (b.length !== K) throw new Error(`尺寸不匹配：A 为 ${m}×${K}，B 为 ${b.length}×${n}`);

  const c: (number | null)[][] = Array.from({ length: m }, () =>
    Array<number | null>(n).fill(null),
  );
  const snap = (
    phase: MatMulPhase,
    i: number | null,
    j: number | null,
    k: number | null,
    partial: number | null,
  ): MatMulState => ({ a, b, c: c.map((r) => r.slice()), i, j, k, partial, phase });

  const tl: Timeline<MatMulState> = [
    {
      state: snap('start', null, null, null, null),
      caption: `计算 $C = AB$：A 为 ${m}×${K}，B 为 ${K}×${n}，C 为 ${m}×${n}；每个元素 $C_{ij} = \\sum_k A_{ik}B_{kj}$`,
    },
  ];

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      let acc = 0;
      for (let k = 0; k < K; k++) {
        const p = a[i][k] * b[k][j];
        acc += p;
        tl.push({
          state: snap('multiply', i, j, k, acc),
          caption: `C[${i}][${j}] += ${f(a[i][k])} × ${f(b[k][j])} → ${f(acc)}`,
          focus: [cellId('a', i, k), cellId('b', k, j), cellId('c', i, j)],
        });
      }
      c[i][j] = acc;
      tl.push({
        state: snap('write', i, j, null, acc),
        caption: `写入 C[${i}][${j}] = ${f(acc)}`,
        focus: [cellId('c', i, j)],
      });
    }
  }
  tl.push({ state: snap('done', null, null, null, null), caption: `完成：C 为 ${m}×${n} 矩阵` });
  return tl;
}
