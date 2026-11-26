import { formatNumber } from '../../core/format';
import type { Tone } from '../../core/tones';
import Cell from './Cell';
import Label from './Label';

/** 默认格子边长（含 4px 间隙）。移动端每格至少 28px（explainers.md §1）。 */
export const CELL = 44;
export const LABEL_H = 24;

export type GridValue = number | string | null;

export interface MatrixProps {
  x: number;
  y: number;
  values: GridValue[][];
  tone: Tone;
  /** 标题（如 "A  2×3"）；不传时不占标签高度 */
  label?: string;
  /** 格子边长，默认 CELL */
  cellSize?: number;
  /** 数字格式化；字符串原样显示，null 显示为 "·" */
  format?: (v: number) => string;
  /** 强高亮的格子，键为 "r,c" */
  highlight?: ReadonlySet<string>;
  /** 弱高亮（整行 / 整列），键为 "r,c" */
  soft?: ReadonlySet<string>;
}

const labelH = (label?: string) => (label ? LABEL_H : 0);
export const matrixWidth = (values: unknown[][], cellSize = CELL) =>
  (values[0]?.length ?? 0) * cellSize;
export const matrixHeight = (values: unknown[][], cellSize = CELL, label?: string) =>
  values.length * cellSize + labelH(label);

/**
 * 二维格子（矩阵、DP 表、注意力权重……；1 行即数组）。(x, y) 是左上角，有 label 时格子在标签下方 LABEL_H 处。
 */
export default function Matrix({
  x,
  y,
  values,
  tone,
  label,
  cellSize = CELL,
  format = formatNumber,
  highlight,
  soft,
}: MatrixProps) {
  const w = matrixWidth(values, cellSize);
  const top = y + labelH(label);
  const cols = values[0]?.length ?? 0;
  return (
    <g role="img" aria-label={`${label ? `${label}：` : ''}${values.length} × ${cols}`}>
      {label && <Label x={x + w / 2} y={y + LABEL_H / 2} text={label} tone={tone} />}
      {values.map((row, r) =>
        row.map((v, c) => {
          const key = `${r},${c}`;
          return (
            <Cell
              key={key}
              x={x + c * cellSize}
              y={top + r * cellSize}
              size={cellSize - 4}
              text={v === null ? '·' : typeof v === 'number' ? format(v) : v}
              empty={v === null}
              tone={tone}
              state={highlight?.has(key) ? 'strong' : soft?.has(key) ? 'soft' : 'none'}
            />
          );
        }),
      )}
    </g>
  );
}
