/**
 * Build-time CSS icon masks for things rendered from Markdown (notes, tips,
 * headings…), so no icon font has to be shipped. Each icon becomes
 * `--icon-<name>: url("data:image/svg+xml,…")` on :root; use it with
 * `mask: var(--icon-x) no-repeat center; mask-size: contain; background: currentColor`
 * (plus the -webkit- pair).
 */
import { getIconData, iconToSVG, iconToHTML, replaceIDs } from '@iconify/utils';
import solid from '@iconify-json/fa6-solid/icons.json' with { type: 'json' };
import regular from '@iconify-json/fa6-regular/icons.json' with { type: 'json' };
import brands from '@iconify-json/fa6-brands/icons.json' with { type: 'json' };

type IconifyJSON = Parameters<typeof getIconData>[0];
const SETS: Record<string, IconifyJSON> = {
  'fa6-solid': solid as IconifyJSON,
  'fa6-regular': regular as IconifyJSON,
  'fa6-brands': brands as IconifyJSON,
};

const ICONS: Record<string, string> = {
  // Butterfly note defaults (flat style, icons: true)
  'note-default': 'circle-arrow-right',
  'note-primary': 'circle-plus',
  'note-info': 'circle-info',
  'note-success': 'circle-check',
  'note-warning': 'circle-exclamation',
  'note-danger': 'circle-minus',
  // tag-plugins-plus tip badges
  ban: 'ban',
  'arrow-up': 'arrow-up',
  sync: 'arrows-rotate',
  info: 'circle-info',
  'info-i': 'info',
  check: 'circle-check',
  important: 'circle-exclamation',
  warning: 'triangle-exclamation',
  caution: 'circle-xmark',
  home: 'house',
  key: 'key',
  bolt: 'bolt',
  bell: 'bell',
  cogs: 'gears',
  exclamation: 'exclamation',
  checkmark: 'check',
  xmark: 'xmark',
  link: 'link',
  scissors: 'scissors',
  'chevron-down': 'chevron-down',
  'angle-down': 'angle-down',
  'angles-down': 'angles-down',
  copy: 'copy',
  // toast + clock/weather widget
  sun: 'sun',
  moon: 'moon',
  'wx-cloud-sun': 'cloud-sun',
  'wx-cloud-moon': 'cloud-moon',
  'wx-cloud': 'cloud',
  'wx-rain': 'cloud-rain',
  'wx-showers': 'cloud-showers-heavy',
  'wx-thunder': 'cloud-bolt',
  'wx-snow': 'snowflake',
  'wx-fog': 'smog',
  'wx-wind': 'wind',
  droplet: 'droplet',
  'location-dot': 'location-dot',
};

/** `name` (fa6-solid) or `set:name` → CSS `url("data:image/svg+xml,…")` mask. */
export function iconUri(spec: string) {
  const [set, name] = spec.includes(':') ? spec.split(':') : ['fa6-solid', spec];
  const data = SETS[set] && getIconData(SETS[set], name);
  if (!data) throw new Error(`icon ${set}:${name} not found`);
  const { attributes, body } = iconToSVG(data, { height: 'auto' });
  // iconToHTML already writes xmlns; passing it again duplicated the attribute, which makes
  // the SVG malformed XML, so browsers dropped the mask image and the icon vanished.
  // currentColor has no meaning inside a standalone image; spell the fill out.
  const solidBody = replaceIDs(body).replaceAll('currentColor', 'black');
  const svg = iconToHTML(solidBody, { ...attributes, fill: 'black' });
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/** Font Awesome 5 class names from the Hexo era ('fas fa-bullhorn') → iconify id. */
export function faToIconify(fa: string) {
  const m = fa.trim().match(/^(fas|far|fab|fa-solid|fa-regular|fa-brands)\s+fa-([\w-]+)$/);
  if (!m) return fa.includes(':') ? fa : `fa6-solid:${fa.replace(/^fa-/, '')}`;
  const set = { fas: 'fa6-solid', 'fa-solid': 'fa6-solid', far: 'fa6-regular', 'fa-regular': 'fa6-regular' }[m[1]] ?? 'fa6-brands';
  return `${set}:${m[2]}`;
}

export const iconCss = `:root{${Object.entries(ICONS)
  .map(([k, v]) => `--icon-${k}:${iconUri(v)}`)
  .join(';')}}`;
