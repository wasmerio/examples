import type { CSSProperties } from 'react';
import { toneStroke, type Tone } from '../../core/tones';
import { Tex } from '../RichText';

export interface TexLabelProps {
  /** 锚点：anchor="middle" 时是盒子中心；"start" / "end" 时是盒子左 / 右边缘的中点（与 Label 的 x、y 含义一致） */
  x: number;
  y: number;
  /**
   * 公式盒子的宽高（viewBox 单位）。必须给：foreignObject 不会按内容自动撑开，盒子太小公式会被裁掉。
   * 14px 字号下单行公式高度约 20–24，W^{UK} 这类短公式宽度约 40。
   */
  width: number;
  height: number;
  /** TeX 源码，不带 `$` */
  tex: string;
  tone?: Tone;
  muted?: boolean;
  anchor?: 'start' | 'middle' | 'end';
}

const JUSTIFY = { start: 'flex-start', middle: 'center', end: 'flex-end' } as const;

/**
 * SVG 里的公式标签：KaTeX HTML 放进 `<foreignObject>`，在给定的盒子里垂直居中，字号与 Label 相同（14px）。
 * 颜色规则同 Label：tone → 色调描边色；muted → muted；否则墨色。
 */
export default function TexLabel({
  x,
  y,
  width,
  height,
  tex,
  tone,
  muted = false,
  anchor = 'middle',
}: TexLabelProps) {
  const left = anchor === 'middle' ? x - width / 2 : anchor === 'end' ? x - width : x;
  const color = tone ? toneStroke(tone) : muted ? 'var(--wisp-muted)' : 'var(--wisp-fg)';
  const style: CSSProperties = { color, justifyContent: JUSTIFY[anchor] };
  return (
    <foreignObject x={left} y={y - height / 2} width={width} height={height}>
      <div className="wisp-explainer__tex-label" style={style}>
        <Tex tex={tex} />
      </div>
    </foreignObject>
  );
}
