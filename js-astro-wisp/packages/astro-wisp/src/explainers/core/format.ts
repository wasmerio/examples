const MINUS = '−';

/** 整数原样输出；小数最多保留 digits 位并去掉末尾 0；负数用真正的减号 U+2212。 */
export function formatNumber(n: number, digits = 2): string {
  if (Number.isNaN(n)) return 'NaN';
  if (!Number.isFinite(n)) return n < 0 ? `${MINUS}∞` : '∞';
  let s = Number.isInteger(n) ? String(n) : n.toFixed(digits);
  if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, '');
  if (s === '-0') s = '0';
  return s.startsWith('-') ? MINUS + s.slice(1) : s;
}

/** 矩阵转字符串，null 显示为 "·"；列用空格分隔、行用换行。 */
export function formatMatrix(m: (number | null)[][], digits = 2): string {
  return m
    .map((row) => row.map((v) => (v === null ? '·' : formatNumber(v, digits))).join(' '))
    .join('\n');
}
