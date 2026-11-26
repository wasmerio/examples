/**
 * The only `_component` key derivation: `renderBlock.astro`, `live-editing.js` and
 * `scripts/cms/lint.mjs` must agree on it. Keep it import-free — it also runs in the
 * browser editor bundle and plain `node`.
 */

/**
 * @param {string} pascal
 * @returns {string}
 */
export function pascalToKebab(pascal) {
  return pascal
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase()
    .replace(/^-/, "");
}

/**
 * A filename matching its directory collapses into it (`hero-center/HeroCenter` ->
 * `.../hero-center`); one that differs is kept (`.../accordion/accordion-item`).
 * @param {string} relativePath POSIX path relative to `src/components/`
 * @returns {string}
 */
export function componentKeyFromPath(relativePath) {
  const parts = relativePath.replace(/\.(astro|jsx)$/, "").split("/");
  const filename = parts[parts.length - 1];
  const kebabFilename = pascalToKebab(filename);
  const parent = parts.length > 1 ? parts[parts.length - 2] : null;

  if (parent !== null && kebabFilename === pascalToKebab(parent)) {
    parts.pop();
  }
  parts[parts.length - 1] = kebabFilename;

  return parts.join("/");
}
