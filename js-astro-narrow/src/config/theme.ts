import type { Locale } from './i18n';

/*
 * The default theme id. Visitors pick any other color from the Dock — a row
 * of preset swatches plus hue / chroma / lightness sliders — which applies
 * `data-theme="custom"` and inline `--seed-recipe-*` channel values.
 */
export const defaultTheme = 'ink';

/*
 * A seed is `oklch(l c h)` — the single color every token is mixed from.
 * Presets carry per-family lightness and chroma: the same hue looks wrong at
 * one shared L/C (yellow needs to be bright, blue needs to stay deep), so
 * each preset is its own recipe.
 */
export interface SeedRecipe {
  l: number;
  c: number;
  h: number;
}

export const seedColor = (seed: SeedRecipe) => `oklch(${seed.l} ${seed.c} ${seed.h})`;

/* Preset swatches shown in the Dock. `ink` is the monochrome default and the
   only preset whose seed is tuned near-black. */
export const seedPresets: ReadonlyArray<SeedRecipe & { id: string; name: Record<Locale, string> }> =
  [
    { id: 'ink', name: { en: 'Ink', 'zh-cn': '墨' }, l: 0.3, c: 0.01, h: 285 },
    { id: 'red', name: { en: 'Red', 'zh-cn': '红' }, l: 0.58, c: 0.22, h: 26 },
    { id: 'rose', name: { en: 'Rose', 'zh-cn': '玫红' }, l: 0.69, c: 0.19, h: 352 },
    { id: 'amber', name: { en: 'Amber', 'zh-cn': '琥珀' }, l: 0.67, c: 0.16, h: 58 },
    { id: 'grass', name: { en: 'Grass', 'zh-cn': '草绿' }, l: 0.65, c: 0.15, h: 147 },
    { id: 'teal', name: { en: 'Teal', 'zh-cn': '青' }, l: 0.65, c: 0.11, h: 182 },
    { id: 'blue', name: { en: 'Blue', 'zh-cn': '蓝' }, l: 0.56, c: 0.21, h: 258 },
    { id: 'violet', name: { en: 'Violet', 'zh-cn': '紫' }, l: 0.54, c: 0.18, h: 288 }
  ] as const;

/* The monochrome recipe used when no custom seed is stored. */
export const inkSeed: SeedRecipe = seedPresets[0];

/*
 * Custom picker limits — mirrored as `--picker-*` in tokens.css so the
 * slider-track gradients match. Lightness is clamped to 30–70%: outside that
 * range a seed can no longer carry both readable accent fills and links.
 */
export const seedLimits = {
  hue: { min: 0, max: 359 },
  chroma: { min: 0, max: 0.34 },
  lightness: { min: 0.3, max: 0.7 }
} as const;

/*
 * Color schemes: each re-tunes a few mix percentages of the one recipe
 * (`--scheme-*` knobs in tokens.css). `plain` is the shipped recipe. To add
 * your own, append an entry here and a matching `[data-scheme='<id>']` block
 * in tokens.css — the Dock picks it up automatically.
 */
export const defaultScheme = 'plain';

export const schemes: ReadonlyArray<{ id: string; name: Record<Locale, string> }> = [
  { id: 'plain', name: { en: 'Plain', 'zh-cn': '默认' } },
  { id: 'tinted', name: { en: 'Tinted', 'zh-cn': '着色' } },
  { id: 'vivid', name: { en: 'Vivid', 'zh-cn': '鲜明' } },
  { id: 'soft', name: { en: 'Soft', 'zh-cn': '柔和' } }
];
