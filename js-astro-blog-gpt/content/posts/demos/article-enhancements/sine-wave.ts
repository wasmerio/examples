export type SineParameters = {
  amplitude: number;
  period: number;
  phase: number;
};
export const sineValue = (
  x: number,
  { amplitude, period, phase }: SineParameters,
) => amplitude * Math.sin((2 * Math.PI * x) / period + phase);

/** Fixed axes keep changes in amplitude and period visually comparable. */
export function sinePath(parameters: SineParameters): string {
  return Array.from({ length: 481 }, (_, index) => {
    const x = -2 * Math.PI + (4 * Math.PI * index) / 480;
    const px = 36 + (568 * index) / 480;
    const py = 140 - (sineValue(x, parameters) * 108) / 3.5;
    return `${index === 0 ? 'M' : 'L'}${px.toFixed(2)},${py.toFixed(2)}`;
  }).join(' ');
}
