import tabler from "@iconify-json/tabler/icons.json";

/**
 * Tabler のアイコンを SVG 文字列にする。
 * astro-icon はビルド時の <Icon /> 専用なので、ブラウザ側のスクリプトで作る要素に使うアイコンはこちらで渡す。
 */
export function tablerSvg(name: string) {
  const icon = (tabler.icons as Record<string, { body: string }>)[name];
  if (!icon) throw new Error(`Tabler icon not found: ${name}`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1.25em" height="1.25em" aria-hidden="true">${icon.body}</svg>`;
}

export function tablerSvgs(names: string[]) {
  return Object.fromEntries(names.map((n) => [n, tablerSvg(n)]));
}
