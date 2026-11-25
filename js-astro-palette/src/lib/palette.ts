/**
 * The palette a visitor sees before they pick one.
 *
 * There is no saved choice on a first visit, so the palette follows the
 * browser's `prefers-color-scheme` and one of these two is applied. Once
 * someone chooses from the switcher their choice is stored under
 * `site-palette` in localStorage and takes precedence until they clear it.
 *
 * Both values must name a `[data-palette="..."]` block in
 * public/css/style.css. A name with no matching block is not an error --
 * the page just falls back to the bare `:root` variables -- so change these
 * together with the CSS.
 *
 * Read in two places in src/components/Layout.astro: the inline head script
 * that sets the palette before first paint, and the theme switcher, which
 * needs to know what "no choice saved" resolves to.
 */
export const DEFAULT_PALETTE = {
  dark: 'vesper',
  light: 'rose-pine-dawn',
} as const;
