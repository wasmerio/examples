/**
 * 分步讲解的数据协议：算法写成 `(input) => Step<S>[]` 的纯函数，预先生成全部步骤；渲染器只依赖当前 state。
 */

/** 一帧：渲染器只依赖 state 即可完整绘制。label 用作顶部语义阶段标签，duration 控制自动演示停留毫秒数。 */
export type Step<S> = {
  state: S;
  caption: string;
  label?: string;
  duration?: number;
  focus?: string[];
};
export type Timeline<S> = Step<S>[];

export interface EmitOptions {
  focus?: string[];
  label?: string;
  duration?: number;
}

/** 把索引限制在 [0, length-1]；空时间线返回 0。非整数向下取整，NaN 视为 0。 */
export function clampIndex(i: number, length: number): number {
  if (length <= 0 || Number.isNaN(i)) return 0;
  return Math.min(Math.max(Math.floor(i), 0), length - 1);
}

export const isFirst = (i: number): boolean => i <= 0;
export const isLast = (i: number, length: number): boolean => i >= length - 1;

/** 取第 i 步（越界时夹紧）；空时间线抛错。 */
export function stepAt<S>(tl: Timeline<S>, i: number): Step<S> {
  if (tl.length === 0) throw new Error('时间线为空');
  return tl[clampIndex(i, tl.length)];
}

/** 二维元素 id：`cellId('a', 1, 0)` => 'a:1,0'。 */
export const cellId = (m: string, r: number, c: number): string => `${m}:${r},${c}`;

/** 一维元素 id：`itemId('arr', 3)` => 'arr:3'（数组、链表、栈等）。 */
export const itemId = (m: string, i: number): string => `${m}:${i}`;

/** 从 focus 中取出某个前缀（如 'a'）下的键集合：['a:1,0', 'b:0,0'] → {'1,0'}。 */
export function focusOf(focus: readonly string[] | undefined, prefix: string): Set<string> {
  const s = new Set<string>();
  const p = `${prefix}:`;
  for (const id of focus ?? []) if (id.startsWith(p)) s.add(id.slice(p.length));
  return s;
}

/**
 * 把命令式算法录制成时间线：算法直接修改 state，在需要停顿的地方调用 `emit(caption, focus)`，
 * 每次 emit 保存一份 state 的深拷贝（structuredClone）。适合排序、搜索、DP 等原地更新的算法。
 *
 * ```ts
 * const steps = record({ arr: [3, 1, 2] }, (s, emit) => {
 *   emit('初始数组');
 *   // ...交换元素...
 *   emit('交换 0 和 1', [itemId('arr', 0), itemId('arr', 1)]);
 * });
 * ```
 */
export function record<S>(
  initial: S,
  run: (state: S, emit: (caption: string, opts?: string[] | EmitOptions) => void) => void,
): Timeline<S> {
  const state = structuredClone(initial);
  const steps: Timeline<S> = [];
  run(state, (caption, opts) => {
    const step: Step<S> = { state: structuredClone(state), caption };
    if (Array.isArray(opts)) {
      step.focus = opts;
    } else if (opts) {
      if (opts.focus !== undefined) step.focus = opts.focus;
      if (opts.label !== undefined) step.label = opts.label;
      if (opts.duration !== undefined) step.duration = opts.duration;
    }
    steps.push(step);
  });
  if (steps.length === 0) throw new Error('record：算法没有产生任何步骤（至少调用一次 emit）');
  return steps;
}
