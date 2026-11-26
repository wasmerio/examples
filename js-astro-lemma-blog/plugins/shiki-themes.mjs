// Shiki code themes (Vitesse by default) with every token color made readable
// on the site's code background (the surface color of lemma.config.mjs):
// colors below 4.5:1 contrast are darkened (light) or lightened (dark) until
// they reach it. Hue stays the same.
import { bundledThemes } from 'shiki';

const MIN = 4.5;

const parse = (hex) => {
  const h = hex.replace('#', '');
  const full = h.length <= 4 ? [...h].map((c) => c + c).join('') : h;
  const [r, g, b, a = 255] = full.match(/../g).map((x) => parseInt(x, 16));
  return { rgb: [r, g, b], alpha: a / 255 };
};
const toHex = (rgb) => '#' + rgb.map((c) => Math.round(c).toString(16).padStart(2, '0')).join('');

function luminance(rgb) {
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// The color as seen on `bg` (alpha composited), moved toward black or white
// in small steps until it reaches the minimum contrast.
function readable(hex, bg) {
  const { rgb, alpha } = parse(hex);
  const seen = rgb.map((c, i) => c * alpha + bg[i] * (1 - alpha));
  if (contrast(seen, bg) >= MIN) return hex;
  const target = luminance(bg) > 0.5 ? [0, 0, 0] : [255, 255, 255];
  let color = seen;
  // Tested as rounded, since the hex output is: rounding can lose the last bit of contrast.
  for (let t = 0.01; contrast(color.map(Math.round), bg) < MIN; t += 0.01) color = seen.map((c, i) => c + (target[i] - c) * t);
  return toHex(color);
}

async function adjust(name, background) {
  const theme = structuredClone((await bundledThemes[name]()).default);
  const bg = parse(background).rgb;
  for (const rule of theme.tokenColors ?? []) {
    if (rule.settings?.foreground) rule.settings.foreground = readable(rule.settings.foreground, bg);
  }
  if (theme.colors?.['editor.foreground']) theme.colors['editor.foreground'] = readable(theme.colors['editor.foreground'], bg);
  return theme;
}

/**
 * @param {{ light: string, dark: string }} names bundled Shiki theme names.
 * @param {{ light: string, dark: string }} backgrounds the code block backgrounds.
 */
export default async function codeThemes(names, backgrounds) {
  return {
    light: await adjust(names.light, backgrounds.light),
    dark: await adjust(names.dark, backgrounds.dark),
  };
}
