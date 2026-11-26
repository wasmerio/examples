import { motion, useReducedMotion } from 'motion/react';
import { toneFill, toneStroke, type Tone } from '../../core/tones';

/** 强高亮描边宽度 */
const STRONG_STROKE = 2.5;

export type CellState = 'none' | 'soft' | 'strong';

export interface CellProps {
  x: number;
  y: number;
  size: number;
  text: string;
  /** 色调：语义色（q / k / v / visited …）或 hue（blue / amber …） */
  tone: Tone;
  state?: CellState;
  /** 值尚未产生（如未写回的结果） */
  empty?: boolean;
  /** 覆盖文字字号。默认走 .wisp-explainer__cell-text（16px，不随格子缩放）；
   * 格子较小或内容较长（如 '0.33'）时应显式传小一号，避免文字溢出互叠。 */
  fontSize?: number;
  /** 底色填充强度（0–1），用于热力图；默认 1。 */
  fillOpacity?: number;
  /** 热力强度（0–1）：在底色上叠加同色调的亮色层，用于表达数值高低。 */
  heat?: number;
}

/** 单个格子。高亮用叠加层的透明度做 150ms 过渡（Motion）；reduced-motion 下直接切换。 */
export default function Cell({
  x,
  y,
  size,
  text,
  tone,
  state = 'none',
  empty = false,
  fontSize,
  fillOpacity = 1,
  heat,
}: CellProps) {
  const reduce = useReducedMotion();
  const transition = {
    duration: reduce ? 0 : 0.24,
    ease: [0.22, 1, 0.36, 1] as const,
  };
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={size}
        height={size}
        rx={4}
        style={{ fill: toneFill(tone), fillOpacity, stroke: toneStroke(tone), strokeWidth: 1.25 }}
      />
      {heat !== undefined && (
        <rect
          x={x}
          y={y}
          width={size}
          height={size}
          rx={4}
          style={{
            fill: toneStroke(tone),
            opacity: `calc(var(--wisp-cell-heat, 0.44) * ${((0.04 + 0.4 * Math.max(0, Math.min(1, heat))) / 0.44).toFixed(4)})`,
          }}
        />
      )}
      <motion.rect
        x={x}
        y={y}
        width={size}
        height={size}
        rx={4}
        initial={false}
        animate={{ opacity: state === 'soft' ? 1 : 0 }}
        transition={transition}
        style={{ fill: toneStroke(tone), fillOpacity: 0.2 }}
      />
      {/* 强高亮的描边向内收半个线宽：整条描边都在格子范围内，不会被 Stage 的 pad 或 SVG 边界裁掉 */}
      <motion.rect
        x={x + STRONG_STROKE / 2}
        y={y + STRONG_STROKE / 2}
        width={size - STRONG_STROKE}
        height={size - STRONG_STROKE}
        rx={4 - STRONG_STROKE / 2}
        initial={false}
        animate={{ opacity: state === 'strong' ? 1 : 0 }}
        transition={transition}
        style={{
          fill: toneFill('highlight'),
          stroke: toneStroke('highlight'),
          strokeWidth: STRONG_STROKE,
        }}
      />
      <text
        x={x + size / 2}
        y={y + size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        className="wisp-explainer__cell-text"
        style={{ fill: empty ? 'var(--wisp-muted)' : 'var(--wisp-fg)', fontSize }}
      >
        {text}
      </text>
    </g>
  );
}
