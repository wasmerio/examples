// Shared by `icons.ts` and `scripts/icons/sync.mjs` — a divergence silently breaks the
// picker. Keep it import-free so plain `node` can load it.

const ICONS_DIR = "src/icons/";

/**
 * Accepts a Vite glob key, a backslashed OS path, or one relative to `src/icons/`.
 * @param {string} path
 * @returns {string}
 */
export function iconKeyFromPath(path) {
  const posix = path.split(/[\\/]/).join("/");
  const index = posix.lastIndexOf(ICONS_DIR);

  return (index === -1 ? posix : posix.slice(index + ICONS_DIR.length))
    .replace(/^\/+/, "")
    .replace(/\.svg$/, "");
}
