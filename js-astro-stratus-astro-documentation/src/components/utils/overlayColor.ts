/** Negative `overlay` darkens, positive lightens; alpha is its magnitude. */
export function overlayColor(overlay: number): string {
  const rgb = overlay < 0 ? "0, 0, 0" : "255, 255, 255";

  return `rgba(${rgb}, ${Math.abs(overlay)})`;
}
