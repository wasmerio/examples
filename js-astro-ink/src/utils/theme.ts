/** Built-in color palettes (warm "ink" and fresh "mint").
 *  Hex values are the exact conversion of the `--paper` tokens in
 *  `src/assets/styles/tokens.css` (kept in sync manually). */
export const THEME_COLORS = {
  ink: { light: '#faf8f5', dark: '#181511' },
  fresh: { light: '#f5f7fa', dark: '#11161d' }
} as const

export type Palette = keyof typeof THEME_COLORS

/** Browser chrome color (theme-color meta) for a palette + mode. */
export function themeColorHex(palette: Palette, dark: boolean): string {
  return THEME_COLORS[palette][dark ? 'dark' : 'light']
}
