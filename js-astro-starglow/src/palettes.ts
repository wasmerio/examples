/**
 * The only place palette colours live: CSS properties, Shiki and OG images
 * all read them. Every text token must meet WCAG AA (4.5:1) on bg, mantle,
 * crust and muted, and accentFg on accent; `pnpm verify` checks every palette.
 */

export interface Palette {
  /** Name shown in the live preview panel. */
  label: string;
  /** Page background. */
  bg: string;
  /** Slightly offset surface: the band in dark mode, code in light mode. */
  mantle: string;
  /** The most offset surface: code in dark mode, the band in light mode. */
  crust: string;
  /** Inline code, badges and other small raised surfaces. */
  muted: string;
  /** 1px rules and outlines. */
  border: string;
  /** Body text. */
  fg: string;
  /** Secondary text: dates, labels, metadata. */
  mutedFg: string;
  /** Links, the wordmark and highlights. */
  accent: string;
  /** Text on an accent background. */
  accentFg: string;
  /** Code comments. */
  comment: string;
  /** Hues for syntax highlighting, callouts, status and badges. */
  red: string;
  orange: string;
  yellow: string;
  green: string;
  cyan: string;
  blue: string;
  purple: string;
  /** Tint of the header band glow (appearance.ambient). */
  glow: string;
}

export const darkPalettes = {
  starglow: {
    label: "Starglow",
    bg: "#120f1f",
    mantle: "#0d0b17",
    crust: "#09070f",
    muted: "#1d1932",
    border: "#342a5c",
    fg: "#e8e3f6",
    mutedFg: "#a79fc4",
    accent: "#f78ed6",
    accentFg: "#120f1f",
    comment: "#8f87ad",
    red: "#ff7f9a",
    orange: "#ffb07a",
    yellow: "#f3d88a",
    green: "#15c2a5",
    cyan: "#5fcde4",
    blue: "#8fa2ff",
    purple: "#c79be0",
    glow: "#342a97",
  },
  void: {
    label: "Void",
    bg: "#0b0d10",
    mantle: "#08090b",
    crust: "#050607",
    muted: "#161a20",
    border: "#262c35",
    fg: "#d8dee6",
    mutedFg: "#95a0ad",
    accent: "#5ad1e8",
    accentFg: "#0b0d10",
    comment: "#7f8a97",
    red: "#ff7b7b",
    orange: "#f2a65a",
    yellow: "#e8d06a",
    green: "#7fd88f",
    cyan: "#5ad1e8",
    blue: "#7aa7ff",
    purple: "#b69cff",
    glow: "#5ad1e8",
  },
  aurora: {
    label: "Aurora",
    bg: "#0d1716",
    mantle: "#0a1211",
    crust: "#070d0c",
    muted: "#16231f",
    border: "#24362f",
    fg: "#d5ebe3",
    mutedFg: "#8fb0a4",
    accent: "#6ee7b7",
    accentFg: "#0d1716",
    comment: "#759588",
    red: "#f2857f",
    orange: "#f0b071",
    yellow: "#e6d47e",
    green: "#6ee7b7",
    cyan: "#67d4d8",
    blue: "#7fb2f0",
    purple: "#b5a3f0",
    glow: "#6ee7b7",
  },
  ember: {
    label: "Ember",
    bg: "#17120e",
    mantle: "#120e0b",
    crust: "#0d0a08",
    muted: "#231b15",
    border: "#3a2d23",
    fg: "#efe2d3",
    mutedFg: "#b49e88",
    accent: "#f5b754",
    accentFg: "#17120e",
    comment: "#94816d",
    red: "#f28b74",
    orange: "#f5a35f",
    yellow: "#f5d07a",
    green: "#a8cf7e",
    cyan: "#7fc8c0",
    blue: "#8fb0e8",
    purple: "#d09ad8",
    glow: "#f5a35f",
  },
} satisfies Record<string, Palette>;

export const lightPalettes = {
  starglow: {
    label: "Starglow",
    bg: "#fbf8ff",
    mantle: "#f3eefb",
    crust: "#ebe4f7",
    muted: "#efe9f8",
    border: "#d5cbe8",
    fg: "#261f3b",
    mutedFg: "#5d5478",
    accent: "#b0237f",
    accentFg: "#fbf8ff",
    comment: "#6a6285",
    red: "#b3263f",
    orange: "#a34c12",
    yellow: "#7a5a00",
    green: "#117472",
    cyan: "#0e6f88",
    blue: "#342a97",
    purple: "#76428a",
    glow: "#fbe3f4",
  },
  paper: {
    label: "Paper",
    bg: "#ffffff",
    mantle: "#f6f6f4",
    crust: "#ededea",
    muted: "#f1f1ee",
    border: "#d4d4cf",
    fg: "#1f2328",
    mutedFg: "#5b6069",
    accent: "#2348b5",
    accentFg: "#ffffff",
    comment: "#666b73",
    red: "#b3261e",
    orange: "#a6500c",
    yellow: "#7a5c00",
    green: "#1d6b33",
    cyan: "#0b6a78",
    blue: "#2348b5",
    purple: "#6b3fb4",
    glow: "#ffffff",
  },
  petal: {
    label: "Petal",
    bg: "#fdf7f4",
    mantle: "#f7eeea",
    crust: "#f0e4df",
    muted: "#f5ebe6",
    border: "#e2cfc8",
    fg: "#3b2a2e",
    mutedFg: "#75585f",
    accent: "#b0305e",
    accentFg: "#fdf7f4",
    comment: "#7a6168",
    red: "#b3261e",
    orange: "#a4501a",
    yellow: "#7b5b06",
    green: "#3d6b2f",
    cyan: "#1d6970",
    blue: "#3b55b0",
    purple: "#8a3f96",
    glow: "#ffffff",
  },
  frost: {
    label: "Frost",
    bg: "#f5f9fc",
    mantle: "#ecf2f7",
    crust: "#e2eaf1",
    muted: "#e8eff5",
    border: "#c9d6e2",
    fg: "#1c2a38",
    mutedFg: "#4f6275",
    accent: "#1f63c4",
    accentFg: "#f5f9fc",
    comment: "#5a6a7b",
    red: "#b42a35",
    orange: "#a0520f",
    yellow: "#755c00",
    green: "#21703f",
    cyan: "#0a6a80",
    blue: "#1f63c4",
    purple: "#6845b8",
    glow: "#ffffff",
  },
  sand: {
    label: "Sand",
    bg: "#f8f3ea",
    mantle: "#f1e9dc",
    crust: "#e9dfcf",
    muted: "#efe6d8",
    border: "#d9ccb6",
    fg: "#33291f",
    mutedFg: "#6e5d49",
    accent: "#a4461b",
    accentFg: "#f8f3ea",
    comment: "#71604e",
    red: "#a8322a",
    orange: "#a4461b",
    yellow: "#755800",
    green: "#4d6a1f",
    cyan: "#2a6766",
    blue: "#3d5a9e",
    purple: "#80408a",
    glow: "#ffffff",
  },
} satisfies Record<string, Palette>;

export type DarkPaletteName = keyof typeof darkPalettes;
export type LightPaletteName = keyof typeof lightPalettes;

/** CSS custom property set by each palette token. */
const VARIABLES: Record<Exclude<keyof Palette, "label">, string> = {
  bg: "--background",
  mantle: "--mantle",
  crust: "--crust",
  muted: "--muted",
  border: "--border",
  fg: "--foreground",
  mutedFg: "--muted-foreground",
  accent: "--accent",
  accentFg: "--accent-foreground",
  comment: "--code-comment",
  red: "--red",
  orange: "--orange",
  yellow: "--yellow",
  green: "--green",
  cyan: "--cyan",
  blue: "--blue",
  purple: "--purple",
  glow: "--glow",
};

function declarations(palette: Palette): string {
  return Object.entries(VARIABLES)
    .map(
      ([key, variable]) =>
        `${variable}:${palette[key as keyof typeof VARIABLES]}`
    )
    .join(";");
}

/**
 * One rule per palette, keyed by the `data-dark` / `data-light` attribute on
 * <html> and the active `data-theme`. Only the configured palettes are
 * emitted, unless `all` is set (the live preview panel needs every one).
 */
export function paletteCss(
  dark: Record<string, Palette>,
  light: Record<string, Palette>
): string {
  const rules = [
    ...Object.entries(light).map(
      ([name, palette]) =>
        `html[data-light="${name}"]:not([data-theme="dark"]){${declarations(palette)}}`
    ),
    ...Object.entries(dark).map(
      ([name, palette]) =>
        `html[data-dark="${name}"][data-theme="dark"]{${declarations(palette)}}`
    ),
  ];
  return rules.join("\n");
}
