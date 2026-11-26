// @ts-check
// The colour tokens, lifted out of the stylesheets. Two callers need them and they must
// never disagree: `scripts/check-contrast.mjs` proves every pair reaches AA, and
// `src/lib/og.ts` paints the share card. One reads the files off disk, the other gets
// them from the bundler, so the sources arrive as strings rather than paths.
//
// A token counts only when it is written on one line as a light-dark() pair of 6-digit
// hex. That is the house style for tokens.css, theme.css and every preset.

/** @param {string} css */
const strip = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');

/**
 * One stylesheet's tokens.
 * @param {string} css
 * @returns {Record<string, [string, string]>} token name -> [light, dark]
 */
export const pairs = (css) =>
  Object.fromEntries(
    [
      ...strip(css).matchAll(
        /(--[a-z][\w-]*):\s*light-dark\(\s*(#[0-9a-f]{6})\s*,\s*(#[0-9a-f]{6})\s*\)/gi,
      ),
    ].map((m) => [m[1], [m[2].toLowerCase(), m[3].toLowerCase()]]),
  );

/**
 * Stylesheets in the order the cascade sees them -- the defaults, then the preset, then
 * the overrides -- collapsed into one set. Anything falsy is skipped, so a build with no
 * preset passes `undefined` in its place.
 * @param {(string | undefined)[]} sources
 * @returns {Record<string, [string, string]>}
 */
export const stack = (sources) =>
  Object.assign({}, ...sources.filter(Boolean).map((css) => pairs(/** @type {string} */ (css))));

/**
 * The preset theme.css imports, if the line is not commented out. The name, not the file:
 * both callers resolve it their own way.
 * @param {string} themeCss
 * @returns {string | undefined}
 */
export const activePreset = (themeCss) =>
  strip(themeCss).match(/^\s*@import\s+'\.\/(tokens-[\w-]+\.css)'/m)?.[1];

/**
 * One mode of a token set. The share card has no dark variant -- satori draws one image --
 * so it takes the light half.
 * @param {Record<string, [string, string]>} tokens
 * @param {boolean} [dark]
 * @returns {Record<string, string>}
 */
export const oneMode = (tokens, dark = false) =>
  Object.fromEntries(Object.entries(tokens).map(([name, v]) => [name, v[dark ? 1 : 0]]));
