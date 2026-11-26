export function nextTab(index: number, key: string, count: number): number {
  if (count < 1) return 0;
  if (key === 'Home') return 0;
  if (key === 'End') return count - 1;
  if (key === 'ArrowRight') return (index + 1) % count;
  if (key === 'ArrowLeft') return (index - 1 + count) % count;
  return index;
}
