import palette from '../data/palette.json';

export const VARIANTS = ['dark', 'light'] as const;
export type Variant = (typeof VARIANTS)[number];

type Colors = (typeof palette.variants)['dark'];
type GroupId = 'surface' | 'text' | 'accent';

export interface Swatch {
  role: string;
  name: string;
  hex: string;
}

export interface SwatchGroup {
  id: GroupId;
  title: string;
  items: Swatch[];
}

export interface AnsiColor {
  index: number;
  name: string;
  hex: string;
}

const GROUPS: { id: GroupId; title: string }[] = [
  { id: 'surface', title: 'Surfaces' },
  { id: 'text', title: 'Text' },
  { id: 'accent', title: 'Accents' },
];

const ANSI_ORDER = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'] as const;

export const meta = { name: palette.name, version: palette.version, homepage: palette.homepage };

function colors(variant: Variant): Colors {
  return palette.variants[variant];
}

export function swatchGroups(variant: Variant): SwatchGroup[] {
  const c = colors(variant);
  return GROUPS.map(({ id, title }) => ({
    id,
    title,
    items: Object.entries(c[id]).map(([name, hex]) => ({ role: `${id}.${name}`, name, hex })),
  }));
}

export function ansiColors(variant: Variant): AnsiColor[] {
  const { normal, bright } = colors(variant).ansi;
  return [
    ...ANSI_ORDER.map((name, index) => ({ index, name, hex: normal[name] })),
    ...ANSI_ORDER.map((name, index) => ({ index: index + 8, name: `bright ${name}`, hex: bright[name] })),
  ];
}

const kebab = (s: string) => s.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);

// Every palette role as a --tn-* custom property, e.g. accent.onPrimary -> --tn-accent-on-primary.
export function cssVariables(variant: Variant): Record<string, string> {
  const out: Record<string, string> = {};
  const walk = (node: Record<string, unknown>, path: string[]) => {
    for (const [key, value] of Object.entries(node)) {
      if (typeof value === 'string') out[`--tn-${[...path, key].map(kebab).join('-')}`] = value;
      else walk(value as Record<string, unknown>, [...path, key]);
    }
  };
  walk(colors(variant), []);
  return out;
}
