// Checks WCAG AA (4.5:1) for every text token on every background token, light and dark.
// Exits 1 on failure. Reads light-dark() pairs from tokens.css, then theme.css overrides on top.
import { readFileSync } from 'node:fs';

// Edit these two lists when the theme adds a text or background token.
const texts = ['--foreground', '--muted', '--primary'];
const backgrounds = ['--background', '--surface'];
const extraPairs = [
  ['--on-primary', '--primary'],
  ['--on-plate', '--plate'],
  ['--on-plate-muted', '--plate'],
  ['--primary-on-plate', '--plate'],
];

const read = (file) =>
  readFileSync(new URL(`../src/styles/${file}`, import.meta.url), 'utf8').replace(
    /\/\*[\s\S]*?\*\//g,
    '',
  );

const parse = (files) => {
  const tokens = {};
  for (const css of files.map(read)) {
    for (const [, name, light, dark] of css.matchAll(
      /(--[a-z][\w-]*):\s*light-dark\(\s*(#[0-9a-f]{6})\s*,\s*(#[0-9a-f]{6})\s*\)/gi,
    )) {
      tokens[name] = [light, dark];
    }
  }
  return tokens;
};

const base = ['tokens.css', 'theme.css'];

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

const check = (files) => {
  const tokens = parse(files);
  let failed = false;
  for (const [mode, i] of [
    ['light', 0],
    ['dark', 1],
  ]) {
    for (const [fg, bg] of pairs) {
      if (!tokens[fg] || !tokens[bg])
        throw new Error(`Missing light-dark() token: ${tokens[fg] ? bg : fg}`);
      const r = ratio(tokens[fg][i], tokens[bg][i]);
      if (r < 4.5) failed = true;
      const line = `${mode.padEnd(5)}  ${fg.padEnd(16)} on ${bg.padEnd(14)} ${r.toFixed(2)}`;
      console.log(`${line}${r < 4.5 ? ' ✗' : ''}`);
    }
  }
  return failed;
};

process.exit(check(base) ? 1 : 0);
