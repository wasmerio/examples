import { formatHex, rgb, wcagContrast } from 'culori';
import { PELE_FILL_STROKE_PERCENT } from './generate';
import { hueNamesOf, palette as defaultPalette, type Mode, type Palette } from './palette';

export interface Row {
  mode: Mode;
  pair: string;
  ratio: number;
  pass: boolean;
}
export const MIN_CONTRAST = 4.5;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export const mixSrgb = (a: string, b: string, aPercent: number): string => {
  const ca = rgb(a);
  const cb = rgb(b);
  if (!ca || !cb) throw new Error(`无法解析颜色: ${!ca ? a : b}`);
  const weight = aPercent / 100;
  return formatHex({
    mode: 'rgb',
    r: clamp01(ca.r * weight + cb.r * (1 - weight)),
    g: clamp01(ca.g * weight + cb.g * (1 - weight)),
    b: clamp01(ca.b * weight + cb.b * (1 - weight)),
  });
};

/** fg / muted / accent 与 8 个 hue stroke 在两种主题下与背景（及各自 fill）的对比度。 */
export function checkContrast(p: Palette = defaultPalette): Row[] {
  const rows: Row[] = [];
  for (const mode of ['light', 'dark'] as Mode[]) {
    const b = p.color.base;
    const bg = b.bg[mode];
    const add = (pair: string, a: string, c: string) => {
      const ratio = wcagContrast(a, c);
      rows.push({ mode, pair, ratio, pass: ratio >= MIN_CONTRAST });
    };
    for (const k of ['fg', 'muted', 'accent']) add(`${k} / bg`, b[k][mode], bg);
    for (const h of hueNamesOf(p)) {
      const { stroke, fill } = p.color.hue[h];
      add(`${h} stroke / bg`, stroke[mode], bg);
      add(`${h} stroke / ${h} fill`, stroke[mode], fill[mode]);
      const peleFill = mixSrgb(stroke[mode], bg, PELE_FILL_STROKE_PERCENT[mode]);
      add(`fg / ${h} Pele fill`, b.fg[mode], peleFill);
    }
  }
  return rows;
}
