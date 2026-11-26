// @ts-check
// Reads the colour tokens out of the stylesheets, in both modes, for scripts/check-contrast.mjs.
//
// The caller passes the stylesheet sources rather than reading them here, so the parser can
// also be handed CSS that never reaches disk.
//
// Regex parsing: a token counts only when it is written on one line as a light-dark()
// pair of 6-digit hex. That is the house style for tokens.css, theme.css and presets.css.

/** @typedef {{ tokens: string, theme: string, presets: string }} Sources */

/** @param {string} css */
const strip = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');

/** @param {string} css @returns {Record<string, [string, string]>} */
const pairs = (css) =>
  Object.fromEntries(
    [
      ...strip(css).matchAll(
        /(--[a-z][\w-]*):\s*light-dark\(\s*(#[0-9a-f]{6})\s*,\s*(#[0-9a-f]{6})\s*\)/gi,
      ),
    ].map((m) => [m[1], [m[2].toLowerCase(), m[3].toLowerCase()]]),
  );

/** The preset names, default first. @param {Sources} src @returns {string[]} */
export const presetNames = (src) => [
  'petrol',
  ...new Set([...src.presets.matchAll(/data-preset='([\w-]+)'/g)].map((m) => m[1])),
];

/**
 * The colour tokens: tokens.css with theme.css on top.
 * @param {Sources} src @param {string} [preset] @param {boolean} [dark]
 * @returns {Record<string, string>}
 */
export function palette(src, preset = 'petrol', dark = false) {
  const block = strip(src.presets).match(
    new RegExp(`:root\\[data-preset='${preset}'\\]\\s*\\{([^}]*)\\}`),
  );
  const all = { ...pairs(src.tokens), ...pairs(src.theme), ...(block ? pairs(block[1]) : {}) };
  return Object.fromEntries(Object.entries(all).map(([k, v]) => [k, v[dark ? 1 : 0]]));
}
