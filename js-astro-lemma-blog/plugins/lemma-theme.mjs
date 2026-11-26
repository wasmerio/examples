// The theme settings of lemma.config.mjs as modules for the layout:
// - virtual:lemma/tokens.css: the CSS custom properties (colors, font stacks,
//   layout) on :root, and the dark colors on :root[data-theme='dark'].
// - virtual:lemma/fonts: imports the font CSS listed in the config, in order.
// - virtual:lemma/cjk-fonts.css: @imports the CJK font CSS. Base.astro takes it
//   with ?url, so Vite emits it as a stylesheet of its own (hashed from the font
//   CSS alone) instead of bundling it into the page's stylesheet. In dev the
//   ?url import is a plain JS module instead: Astro's dev server would inline
//   any CSS-looking module, ?url included, as a <style>.
// src/layouts/Base.astro imports the first two before the global stylesheet.

import { fileURLToPath } from 'node:url';

const TOKENS = 'virtual:lemma/tokens.css';
const FONTS = 'virtual:lemma/fonts';
const CJK = 'virtual:lemma/cjk-fonts.css';

// camelCase key to custom property: shadowRaised -> --shadow-raised.
const prop = (key) => `--${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`;
const block = (selector, scheme, values) =>
  `${selector} {\n  color-scheme: ${scheme};\n${Object.entries(values)
    .map(([key, value]) => `  ${prop(key)}: ${value};`)
    .join('\n')}\n}\n`;

/** @param {{ colors: { light: Record<string, string>, dark: Record<string, string> }, fonts: { stacks: Record<string, string>, imports: string[], cjkImports: string[] }, layout: Record<string, string | number> }} theme */
export function tokensCss(theme) {
  const fonts = Object.fromEntries(Object.entries(theme.fonts.stacks).map(([k, v]) => [`font${k[0].toUpperCase()}${k.slice(1)}`, v]));
  return (
    block(':root', 'light', { ...fonts, ...theme.layout, ...theme.colors.light }) +
    '\n' +
    block(":root[data-theme='dark']", 'dark', theme.colors.dark)
  );
}

/** Astro integration. @param {Parameters<typeof tokensCss>[0]} theme */
export default function lemmaTheme(theme) {
  return {
    name: 'lemma-theme',
    hooks: {
      'astro:config:setup': ({ config, command, updateConfig }) => {
        // The CSS modules get paths in the project root (the files do not
        // exist): @import resolves the packages from there, and the dev server
        // serves them by URL (/lemma-tokens.css). A bare virtual: id has no
        // URL there, and its HMR <script> would get a 404.
        const files = { [TOKENS]: 'lemma-tokens.css', [CJK]: 'lemma-cjk-fonts.css' };
        const path = (name) => fileURLToPath(new URL(files[name], config.root));
        const dev = command === 'dev';
        const devUrl = '\0lemma-cjk-fonts-url';
        // Keep the query (?url, then Vite's own ?transform-only).
        const query = (id) => id.slice(id.split('?')[0].length);
        updateConfig({
          vite: {
            plugins: [
              {
                name: 'lemma-theme',
                resolveId(id) {
                  if (id === FONTS) return id;
                  const [bare] = id.split('?');
                  if (dev && bare === CJK && query(id) === '?url') return devUrl;
                  for (const name of [TOKENS, CJK]) {
                    if (bare === name || bare === path(name) || (dev && bare === `/${files[name]}`)) return path(name) + query(id);
                  }
                },
                load(id) {
                  const [bare] = id.split('?');
                  if (bare === path(TOKENS)) return tokensCss(theme);
                  if (id === FONTS) return theme.fonts.imports.map((f) => `import ${JSON.stringify(f)};`).join('\n');
                  if (id === devUrl) return `export default "/${files[CJK]}";`;
                  if (bare === path(CJK)) return theme.fonts.cjkImports.map((f) => `@import ${JSON.stringify(f)};`).join('\n');
                },
              },
            ],
          },
        });
      },
    },
  };
}
