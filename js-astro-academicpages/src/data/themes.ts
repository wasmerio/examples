/**
 * Built-in Light & Dark Theme Presets
 *
 * Each preset defines 5 core tokens (`base`, `bg`, `surface`, `text`, `textLight`).
 * Secondary tokens (borders, code blocks, link hover states) are automatically
 * derived via CSS `color-mix()` unless explicitly overridden
 */

export interface ThemePalette {
  /** Primary brand accent & active indicator color */
  base: string;
  /** Main page background color */
  bg: string;
  /** Secondary surface color for footers, callouts, table headers, and cards */
  surface: string;
  /** Primary body and heading text color */
  text: string;
  /** Muted secondary metadata text color */
  textLight: string;
  /** Optional explicit overrides (auto-derived from core tokens if omitted) */
  border?: string;
  darkBorder?: string;
  codeBg?: string;
  codeText?: string;
  link?: string;
  linkHover?: string;
}

export const lightThemes = {
  default: {
    base: '#2f7f93',
    bg: '#ffffff',
    surface: '#f2f3f3',
    text: '#494e52',
    textLight: '#7a8288',
    border: '#f2f3f3',
    darkBorder: '#bdc1c4',
    codeBg: '#fafafa',
    codeText: '#313436',
    link: '#2b7c91',
    linkHover: '#235f6e',
  },
  'github-light': {
    base: '#0969da',
    bg: '#ffffff',
    surface: '#f6f8fa',
    text: '#1f2328',
    textLight: '#59636e',
  },
  'one-light': {
    base: '#4078f2',
    bg: '#fafafa',
    surface: '#f0f0f1',
    text: '#383a42',
    textLight: '#696c77',
  },
  'catppuccin-latte': {
    base: '#1e66f5',
    bg: '#eff1f5',
    surface: '#e6e9ef',
    text: '#4c4f69',
    textLight: '#6c6f85',
  },
  alucard: {
    base: '#644ac9',
    bg: '#fffbeb',
    surface: '#f2eedc',
    text: '#1f1f1f',
    textLight: '#6c664b',
  },
  'tokyo-night-day': {
    base: '#2e7de9',
    bg: '#e1e2e7',
    surface: '#d0d5e3',
    text: '#3760bf',
    textLight: '#6172b0',
  },
  'solarized-light': {
    base: '#268bd2',
    bg: '#fdf6e3',
    surface: '#eee8d5',
    text: '#586e75',
    textLight: '#657b83',
  },
  'nord-light': {
    base: '#5e81ac',
    bg: '#eceff4',
    surface: '#e5e9f0',
    text: '#2e3440',
    textLight: '#4c566a',
  },
  'gruvbox-light': {
    base: '#076678',
    bg: '#fbf1c7',
    surface: '#ebdbb2',
    text: '#3c3836',
    textLight: '#665c54',
  },
  'monokai-light': {
    base: '#1c8ca8',
    bg: '#faf4f2',
    surface: '#f3ecea',
    text: '#29242a',
    textLight: '#706b6e',
  },
  'rose-pine-dawn': {
    base: '#286983',
    bg: '#faf4ed',
    surface: '#f2e9e1',
    text: '#575279',
    textLight: '#797593',
  },
  'light-owl': {
    base: '#4876d6',
    bg: '#fbfbfb',
    surface: '#f0f0f0',
    text: '#403f53',
    textLight: '#7a8181',
  },
  'ayu-light': {
    base: '#399ee6',
    bg: '#f8f9fa',
    surface: '#f3f4f5',
    text: '#5c6166',
    textLight: '#787b80',
  },
  'kanagawa-lotus': {
    base: '#4d699b',
    bg: '#f2ecbc',
    surface: '#e5ddb0',
    text: '#545464',
    textLight: '#716e61',
  },
  'everforest-light': {
    base: '#3a94c5',
    bg: '#fdf6e3',
    surface: '#f4f0d9',
    text: '#5c6a72',
    textLight: '#708089',
  },
  'flexoki-light': {
    base: '#205ea6',
    bg: '#fffcf0',
    surface: '#f2f0e5',
    text: '#100f0f',
    textLight: '#6f6e69',
  },
} satisfies Record<string, ThemePalette>;

export const darkThemes = {
  default: {
    base: '#0ea1c5',
    bg: '#282c34',
    surface: '#21252b',
    text: '#e5e7eb',
    textLight: '#9ca3af',
    border: '#3e4451',
    darkBorder: '#4b5263',
    codeBg: '#21252b',
    codeText: '#abb2bf',
    link: '#0ea1c5',
    linkHover: '#61afef',
  },
  'github-dark': {
    base: '#58a6ff',
    bg: '#0d1117',
    surface: '#161b22',
    text: '#e6edf3',
    textLight: '#8b949e',
  },
  'one-dark': {
    base: '#61afef',
    bg: '#282c34',
    surface: '#21252b',
    text: '#abb2bf',
    textLight: '#828997',
  },
  'catppuccin-mocha': {
    base: '#89b4fa',
    bg: '#1e1e2e',
    surface: '#181825',
    text: '#cdd6f4',
    textLight: '#a6adc8',
  },
  dracula: {
    base: '#bd93f9',
    bg: '#282a36',
    surface: '#21222c',
    text: '#f8f8f2',
    textLight: '#6272a4',
  },
  'tokyo-night': {
    base: '#7aa2f7',
    bg: '#1a1b26',
    surface: '#16161e',
    text: '#c0caf5',
    textLight: '#a9b1d6',
  },
  'solarized-dark': {
    base: '#2aa198',
    bg: '#002b36',
    surface: '#073642',
    text: '#93a1a1',
    textLight: '#839496',
  },
  nord: {
    base: '#88c0d0',
    bg: '#2e3440',
    surface: '#242933',
    text: '#eceff4',
    textLight: '#d8dee9',
  },
  'gruvbox-dark': {
    base: '#83a598',
    bg: '#282828',
    surface: '#1d2021',
    text: '#ebdbb2',
    textLight: '#a89984',
  },
  monokai: {
    base: '#66d9ef',
    bg: '#272822',
    surface: '#1e1f1c',
    text: '#f8f8f2',
    textLight: '#90908a',
  },
  'rose-pine': {
    base: '#9ccfd8',
    bg: '#191724',
    surface: '#1f1d2e',
    text: '#e0def4',
    textLight: '#908caa',
  },
  'night-owl': {
    base: '#82aaff',
    bg: '#011627',
    surface: '#0b2942',
    text: '#d6deeb',
    textLight: '#8badc1',
  },
  'ayu-dark': {
    base: '#59c2ff',
    bg: '#0b0e14',
    surface: '#131721',
    text: '#bfbdb6',
    textLight: '#636a72',
  },
  'kanagawa-wave': {
    base: '#7e9cd8',
    bg: '#1f1f28',
    surface: '#16161d',
    text: '#dcd7ba',
    textLight: '#c8c093',
  },
  'everforest-dark': {
    base: '#7fbbb3',
    bg: '#2d353b',
    surface: '#232a2e',
    text: '#d3c6aa',
    textLight: '#9da9a0',
  },
  'flexoki-dark': {
    base: '#4385be',
    bg: '#100f0f',
    surface: '#1c1b1a',
    text: '#cecdc3',
    textLight: '#878580',
  },
} satisfies Record<string, ThemePalette>;

export type LightThemeName = keyof typeof lightThemes;
export type DarkThemeName = keyof typeof darkThemes;

export interface ThemeConfig {
  /** Built-in light theme preset name or partial custom palette overrides */
  light?: LightThemeName | Partial<ThemePalette>;
  /** Built-in dark theme preset name or partial custom palette overrides */
  dark?: DarkThemeName | Partial<ThemePalette>;
  /** Enable interactive theme preset picker in the masthead (for template demos) */
  picker?: boolean;
}

function paletteToCssVars(p: ThemePalette): string {
  const border = p.border ?? `color-mix(in srgb, ${p.text} 12%, ${p.bg})`;
  const darkBorder =
    p.darkBorder ?? `color-mix(in srgb, ${p.text} 26%, ${p.bg})`;
  const codeBg = p.codeBg ?? `color-mix(in srgb, ${p.surface} 40%, ${p.bg})`;
  const codeText = p.codeText ?? p.text;
  const link = p.link ?? p.base;
  const linkHover =
    p.linkHover ?? `color-mix(in srgb, ${p.base} 80%, ${p.text})`;

  return [
    `--global-base-color:${p.base}`,
    `--global-bg-color:${p.bg}`,
    `--global-footer-bg-color:${p.surface}`,
    `--global-border-color:${border}`,
    `--global-dark-border-color:${darkBorder}`,
    `--global-code-background-color:${codeBg}`,
    `--global-code-text-color:${codeText}`,
    `--global-link-color:${link}`,
    `--global-link-color-hover:${linkHover}`,
    `--global-text-color:${p.text}`,
    `--global-text-color-light:${p.textLight}`,
  ].join(';');
}

function resolvePalette<T extends string>(
  presets: Record<T, ThemePalette>,
  fallback: ThemePalette,
  choice?: T | Partial<ThemePalette>
): ThemePalette {
  if (!choice) return fallback;
  if (typeof choice === 'string') return presets[choice] ?? fallback;

  return {
    base: fallback.base,
    bg: fallback.bg,
    surface: fallback.surface,
    text: fallback.text,
    textLight: fallback.textLight,
    ...choice,
  };
}

export function resolveThemes(config?: ThemeConfig): {
  light: ThemePalette;
  dark: ThemePalette;
  css: string;
} {
  const light = resolvePalette(lightThemes, lightThemes.default, config?.light);
  const dark = resolvePalette(darkThemes, darkThemes.default, config?.dark);
  let css = `:root{${paletteToCssVars(light)}}html[data-theme='dark']{${paletteToCssVars(dark)}}`;

  if (config?.picker) {
    const lightRules = Object.entries(lightThemes)
      .map(
        ([k, p]) =>
          `html:not([data-theme='dark'])[data-light-preset='${k}']{${paletteToCssVars(p)}}`
      )
      .join('');
    const darkRules = Object.entries(darkThemes)
      .map(
        ([k, p]) =>
          `html[data-theme='dark'][data-dark-preset='${k}']{${paletteToCssVars(p)}}`
      )
      .join('');
    css += lightRules + darkRules;
  }

  return { light, dark, css };
}
