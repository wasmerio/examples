// @ts-check
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { relative, resolve, sep } from 'node:path';
import { defineConfig } from 'astro/config';
import themeConfig from './src/config.ts';
import { brandInfo, brands, isBrand } from './src/brands.ts';

/**
 * Where the site is published.
 *
 * - GitHub Pages project site: SITE=https://<user>.github.io  BASE_PATH=/cloud-resume
 * - Custom domain or user site:  SITE=https://cv.example.com   BASE_PATH=/  (or empty)
 *
 * The deploy workflow sets both automatically from `actions/configure-pages`,
 * so you only need to edit the defaults below for local builds or other hosts.
 */
const site = process.env.SITE || 'https://kallioli.github.io';
// An empty BASE_PATH (user site or custom domain, as reported by configure-pages) means the root.
const base = process.env.BASE_PATH === undefined ? '/cloud-resume' : process.env.BASE_PATH || '/';

/**
 * Brand and data file: `src/config.ts`, overridable per build with
 * BRAND=azure RESUME_DATA=src/data/examples/azure.yaml npm run build
 * DEMO_LINKS=true adds the "Other styles" links used by the public demo.
 */
const root = fileURLToPath(new URL('.', import.meta.url));
// Both settings are optional: older config.ts files have neither.
const theme = /** @type {{ brand?: string; data?: string }} */ (/** @type {unknown} */ (themeConfig));
const brand = process.env.BRAND || theme.brand || 'aws';
if (!isBrand(brand)) {
  throw new Error(`Unknown brand "${brand}". Expected one of: ${brands.join(', ')}.`);
}
const font = brandInfo[brand].font;
const dataFile = process.env.RESUME_DATA || theme.data || 'src/data/resume.yaml';
const dataPath = resolve(root, dataFile);
const dataRel = relative(root, dataPath).split(sep).join('/');
if (dataRel.startsWith('..') || !existsSync(dataPath)) {
  throw new Error(`Resume data file "${dataFile}" not found inside the project (see \`data\` in src/config.ts).`);
}
const demoLinks = process.env.DEMO_LINKS === 'true';

const VIRTUAL_ID = 'virtual:cloud-resume/build';
const RESOLVED_ID = `\0${VIRTUAL_ID}`;

/** Exposes the build choices to the site, and imports only the active brand's font. */
function buildSettings() {
  return {
    name: 'cloud-resume:build-settings',
    /** @param {string} id */
    resolveId(id) {
      return id === VIRTUAL_ID ? RESOLVED_ID : undefined;
    },
    /** @param {string} id */
    load(id) {
      if (id !== RESOLVED_ID) return undefined;
      return [
        `import ${JSON.stringify(font)};`,
        `export { default as dataRaw } from ${JSON.stringify(`${dataPath}?raw`)};`,
        `export const brand = ${JSON.stringify(brand)};`,
        `export const dataFile = ${JSON.stringify(dataRel)};`,
        `export const demoLinks = ${JSON.stringify(demoLinks)};`,
      ].join('\n');
    },
  };
}

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  build: {
    // Inline small stylesheets to avoid a render-blocking request.
    inlineStylesheets: 'auto',
  },
  devToolbar: { enabled: false },
  vite: {
    plugins: [buildSettings()],
  },
});
