// Checks WCAG AA (4.5:1) for every text token on every background token, light and dark.
// Exits 1 on failure. The palette comes from src/lib/palette.js.
import { readFileSync } from 'node:fs';
import { palette, presetNames } from '../src/lib/palette.js';

const read = (file) => readFileSync(new URL(`../src/styles/${file}`, import.meta.url), 'utf8');
const sources = {
  tokens: read('tokens.css'),
  theme: read('theme.css'),
  presets: '',
};

// Edit these two lists when the theme adds a text or background token.
const texts = ['--foreground', '--muted', '--primary'];
const backgrounds = ['--background', '--surface'];
const extraPairs = [['--on-primary', '--primary']];

const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const pairs = [...texts.flatMap((t) => backgrounds.map((b) => [t, b])), ...extraPairs];
let failed = false;
for (const preset of presetNames(sources)) {
  for (const [mode, dark] of [
    ['light', false],
    ['dark', true],
  ]) {
    const tokens = palette(sources, preset, dark);
    for (const [fg, bg] of pairs) {
      if (!tokens[fg] || !tokens[bg])
        throw new Error(`Missing light-dark() token: ${tokens[fg] ? bg : fg}`);
      const r = ratio(tokens[fg], tokens[bg]);
      if (r < 4.5) failed = true;
      console.log(
        `${preset.padEnd(12)} ${mode.padEnd(5)}  ${fg.padEnd(16)} on ${bg.padEnd(14)} ${r.toFixed(2)}${r < 4.5 ? ' ✗' : ''}`,
      );
    }
  }
}
process.exit(failed ? 1 : 0);
