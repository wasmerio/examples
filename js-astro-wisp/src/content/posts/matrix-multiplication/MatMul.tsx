/**
 * 矩阵乘法讲解 —— 文章私有组件，演示如何用 astro-wisp/explainers 的积木写一个具体讲解：
 * 算法（matmul.ts，纯函数 → Step[]）+ 画面（Stage / Matrix / Label）+ 外壳（Explainer）。
 */
import { useMemo, type ReactNode } from 'react';
import {
  CELL,
  Explainer,
  LABEL_H,
  Matrix,
  Stage,
  TexLabel,
  focusOf,
  formatNumber as f,
  plainInlineMath,
  matrixHeight,
  matrixWidth,
} from 'astro-wisp/explainers';
import { matmul, type MatMulState } from './matmul';
import './matmul.css';

export interface MatMulProps {
  a: number[][];
  b: number[][];
  title?: string;
}

const GAP = 28;

function Formula({ s }: { s: MatMulState }): ReactNode {
  if (s.i === null || s.j === null)
    return <span className="matmul__muted">逐元素计算 C 的每个位置</span>;
  const { i, j } = s;
  const K = s.a[0].length;
  const cur = s.k ?? K - 1;
  const terms = Array.from({ length: K }, (_, k) => {
    const cls =
      k === cur && s.phase === 'multiply' ? 'is-current' : k > cur ? 'is-pending' : 'is-done';
    return (
      <span key={k}>
        {k > 0 && (
          <span className={`matmul__op ${cls === 'is-pending' ? 'is-pending' : ''}`}> + </span>
        )}
        <span className={`matmul__term ${cls}`}>
          {f(s.a[i][k])}×{f(s.b[k][j])}
        </span>
      </span>
    );
  });
  return (
    <>
      <span className="matmul__lhs">
        C[{i}][{j}]
      </span>{' '}
      = {terms} = <strong>{s.partial === null ? '' : f(s.partial)}</strong>
    </>
  );
}

function Scene({ s, focus }: { s: MatMulState; focus?: string[] }) {
  const m = s.a.length;
  const K = s.a[0].length;
  const n = s.b[0].length;
  const wA = matrixWidth(s.a);
  const wB = matrixWidth(s.b);
  const hB = matrixHeight(s.b, CELL, 'B');
  // 经典布局：B 在右上，A 在左下，C 在右下
  const bx = wA + GAP;
  const ay = hB + GAP;

  const softA = new Set<string>(),
    softB = new Set<string>();
  if (s.i !== null && s.j !== null) {
    for (let k = 0; k < K; k++) {
      softA.add(`${s.i},${k}`);
      softB.add(`${k},${s.j}`);
    }
  }

  return (
    <Stage
      width={wA + GAP + wB}
      height={ay + LABEL_H + m * CELL}
      label={`矩阵乘法 A(${m}×${K}) × B(${K}×${n}) = C(${m}×${n})`}
    >
      <Matrix
        x={bx}
        y={0}
        label={`B  ${K}×${n}`}
        values={s.b}
        tone="k"
        highlight={focusOf(focus, 'b')}
        soft={softB}
      />
      <Matrix
        x={0}
        y={ay}
        label={`A  ${m}×${K}`}
        values={s.a}
        tone="q"
        highlight={focusOf(focus, 'a')}
        soft={softA}
      />
      <Matrix
        x={bx}
        y={ay}
        label={`C  ${m}×${n}`}
        values={s.c}
        tone="v"
        highlight={focusOf(focus, 'c')}
      />
      <TexLabel
        x={wA / 2}
        y={hB / 2 + LABEL_H / 2}
        width={wA}
        height={LABEL_H}
        tex="C = AB"
        muted
      />
    </Stage>
  );
}

export default function MatMul({ a, b, title }: MatMulProps) {
  const steps = useMemo(() => matmul(a, b), [a, b]);
  return (
    <Explainer
      steps={steps}
      title={title}
      label={title ? `${plainInlineMath(title)}：矩阵乘法讲解` : '矩阵乘法讲解'}
    >
      {(step) => (
        <>
          <Scene s={step.state} focus={step.focus} />
          <div className="matmul__formula" aria-hidden="true">
            <Formula s={step.state} />
          </div>
        </>
      )}
    </Explainer>
  );
}
