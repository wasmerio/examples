export const PALETTE_CONFIG = {
  modeStorageKey: 'site-mode',
  legacyPaletteStorageKey: 'site-palette',
  themeStorageKey: 'site-theme',
  seasons: {
    autumn: { start: 922, end: 1221 },
    winter: { start: 1222, end: 319 },
    spring: { start: 320, end: 620 },
    summer: { start: 621, end: 921 },
  },
} as const;

type PaletteMode = 'light' | 'dark';
export type PaletteFamily = 'neon' | 'autumn' | 'winter' | 'spring' | 'summer';
export type ThemeChoice = 'auto' | PaletteFamily;
export const THEME_CHOICES: ThemeChoice[] = ['auto', 'neon', 'autumn', 'winter', 'spring', 'summer'];

type SeasonRange = { start: number; end: number };

function migrateLegacyPalette(): void {
  const legacyPalette: string | null = localStorage.getItem(PALETTE_CONFIG.legacyPaletteStorageKey);
  if (legacyPalette === null) return;
  localStorage.removeItem(PALETTE_CONFIG.legacyPaletteStorageKey);
  const legacyMode: string = legacyPalette.split('-').pop() ?? '';
  const hasStoredMode: boolean = localStorage.getItem(PALETTE_CONFIG.modeStorageKey) !== null;
  if ((legacyMode === 'light' || legacyMode === 'dark') && !hasStoredMode) {
    localStorage.setItem(PALETTE_CONFIG.modeStorageKey, legacyMode);
  }
}

function getMode(): PaletteMode {
  const storedMode: string | null = localStorage.getItem(PALETTE_CONFIG.modeStorageKey);
  if (storedMode === 'light' || storedMode === 'dark') return storedMode;
  if (storedMode !== null) localStorage.removeItem(PALETTE_CONFIG.modeStorageKey);
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function isInSeason(monthDay: number, season: SeasonRange): boolean {
  const wrapsYear: boolean = season.start > season.end;
  return wrapsYear
    ? monthDay >= season.start || monthDay <= season.end
    : monthDay >= season.start && monthDay <= season.end;
}

export function getStoredTheme(): ThemeChoice {
  const storedTheme: string | null = localStorage.getItem(PALETTE_CONFIG.themeStorageKey);
  const matchingChoice: ThemeChoice | undefined = THEME_CHOICES.find((choice: ThemeChoice) => choice === storedTheme);
  if (matchingChoice) return matchingChoice;
  if (storedTheme !== null) localStorage.removeItem(PALETTE_CONFIG.themeStorageKey);
  return 'auto';
}

export function setStoredTheme(theme: ThemeChoice): void {
  if (theme === 'auto') {
    localStorage.removeItem(PALETTE_CONFIG.themeStorageKey);
    return;
  }
  localStorage.setItem(PALETTE_CONFIG.themeStorageKey, theme);
}

function getDatePaletteFamily(): PaletteFamily {
  const today: Date = new Date();
  const monthDay: number = (today.getMonth() + 1) * 100 + today.getDate();
  const seasonNames = Object.keys(PALETTE_CONFIG.seasons) as (keyof typeof PALETTE_CONFIG.seasons)[];
  const activeSeason = seasonNames.find((seasonName) => isInSeason(monthDay, PALETTE_CONFIG.seasons[seasonName]));
  return activeSeason ?? 'neon';
}

function getPaletteFamily(): PaletteFamily {
  const storedTheme: ThemeChoice = getStoredTheme();
  return storedTheme === 'auto' ? getDatePaletteFamily() : storedTheme;
}

export function applyPalette(): void {
  migrateLegacyPalette();
  document.documentElement.setAttribute('data-palette', `${getPaletteFamily()}-${getMode()}`);
}

export function initializePalette(): void {
  applyPalette();
  document.addEventListener('astro:after-swap', applyPalette);
}
