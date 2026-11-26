/** Expand `2 4-5` style hl_lines tokens to 1-based line numbers. */
export function expandHlLinesTokens(value: string): number[] {
  const expanded: number[] = [];
  for (const token of value.split(/[\s,]+/)) {
    if (!token) continue;
    const range = /^(\d+)-(\d+)$/.exec(token);
    if (range) {
      const start = Number(range[1]);
      const end = Number(range[2]);
      const step = start <= end ? 1 : -1;
      for (let n = start; step > 0 ? n <= end : n >= end; n += step) {
        expanded.push(n);
      }
    } else if (/^\d+$/.test(token)) {
      expanded.push(Number(token));
    }
  }
  return [...new Set(expanded)];
}

export function parseHlLinesMeta(meta?: string): number[] {
  if (!meta) return [];
  const hlMatch = /hl_lines="([^"]*)"/.exec(meta);
  return hlMatch ? expandHlLinesTokens(hlMatch[1]!) : [];
}
