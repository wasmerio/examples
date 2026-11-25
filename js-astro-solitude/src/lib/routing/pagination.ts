/** One-based compact pagination shared by server and browser renderers. */
export function pageRange(current: number, total: number): (number | 'gap')[] {
  total = Math.max(1, Math.floor(total));
  current = Math.max(1, Math.min(total, Math.floor(current)));
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, 'gap', total];
  if (current >= total - 3)
    return [1, 'gap', total - 4, total - 3, total - 2, total - 1, total];
  return [1, 'gap', current - 1, current, current + 1, 'gap', total];
}
