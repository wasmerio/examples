import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// WCAG 2 contrast from the colours the site actually ships, in both colour schemes.
const css = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');
const base = css('../src/styles/base.css');

function neutral(name: string): { light: string; dark: string } {
  const m = base.match(new RegExp(`--${name}:\\s*light-dark\\((#[0-9a-fA-F]{6}),\\s*(#[0-9a-fA-F]{6})\\)`));
  assert.ok(m, `--${name} must be a light-dark() pair in base.css`);
  return { light: m[1]!, dark: m[2]! };
}
const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
};
const ratio = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
};

test('every text colour reaches 4.5:1 on the page ground in light and dark', () => {
  const bg = neutral('bg');
  const pairs = { text: neutral('text'), muted: neutral('muted') };
  for (const scheme of ['light', 'dark'] as const) {
    for (const [name, colour] of Object.entries(pairs)) {
      const r = ratio(colour[scheme], bg[scheme]);
      assert.ok(r >= 4.5, `${scheme}: --${name} ${colour[scheme]} on --bg ${bg[scheme]} is ${r.toFixed(2)}:1`);
    }
  }
});

test('secondary text uses a colour, never opacity', () => {
  assert.doesNotMatch(base, /opacity\s*:/);
});
