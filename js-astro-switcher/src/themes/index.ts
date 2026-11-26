/**
 * Theme Registry
 * 
 * Central registry for all available themes. This is the single source of truth
 * for theme availability in the application.
 * 
 * Architecture Decision: We use a centralized registry instead of dynamic imports
 * because:
 * 1. Type safety - all themes are known at compile time
 * 2. Tree-shaking - unused themes can be eliminated
 * 3. Explicit dependencies - easy to see what themes are included
 * 4. No runtime errors from missing theme files
 * 
 * To add a new theme:
 * 1. Create theme directory with tokens.ts, meta.json, theme.css
 * 2. Import tokens and meta here
 * 3. Add to themes array below
 * 4. Import CSS in themes.css
 */

import type { Theme, ThemeMeta } from './types';
import { tokens as lightTokens } from './light/tokens';
import { tokens as darkTokens } from './dark/tokens';
import { tokens as blueTokens } from './blue/tokens';
import { tokens as greenTokens } from './green/tokens';
import { tokens as purpleTokens } from './purple/tokens';
import { tokens as orangeTokens } from './orange/tokens';
import { tokens as auroraTokens } from './aurora/tokens';
import { tokens as obsidianTokens } from './obsidian/tokens';

import lightMeta from './light/meta.json';
import darkMeta from './dark/meta.json';
import blueMeta from './blue/meta.json';
import greenMeta from './green/meta.json';
import purpleMeta from './purple/meta.json';
import orangeMeta from './orange/meta.json';
import auroraMeta from './aurora/meta.json';
import obsidianMeta from './obsidian/meta.json';

/**
 * All available themes
 * 
 * Architecture Note: 'light' and 'dark' are kept in the registry for backward
 * compatibility, but they are now treated as modes, not color themes. Color themes
 * (blue, green, purple, etc.) each have their own light and dark variants.
 * 
 * This array is the authoritative list of all themes in the system.
 */
export const themes: Theme[] = [
  {
    meta: lightMeta as ThemeMeta,
    tokens: lightTokens,
  },
  {
    meta: darkMeta as ThemeMeta,
    tokens: darkTokens,
  },
  {
    meta: blueMeta as ThemeMeta,
    tokens: blueTokens,
  },
  {
    meta: greenMeta as ThemeMeta,
    tokens: greenTokens,
  },
  {
    meta: purpleMeta as ThemeMeta,
    tokens: purpleTokens,
  },
  {
    meta: orangeMeta as ThemeMeta,
    tokens: orangeTokens,
  },
  {
    meta: auroraMeta as ThemeMeta,
    tokens: auroraTokens,
  },
  {
    meta: obsidianMeta as ThemeMeta,
    tokens: obsidianTokens,
  },
];

/**
 * Get color themes only (excludes light/dark)
 */
export function getColorThemes(): Theme[] {
  return themes.filter(theme => theme.meta.id !== 'light' && theme.meta.id !== 'dark');
}

/**
 * Get theme by ID
 */
export function getThemeById(id: string): Theme | undefined {
  return themes.find((theme) => theme.meta.id === id);
}

/**
 * Get all theme IDs
 */
export function getThemeIds(): string[] {
  return themes.map((theme) => theme.meta.id);
}

/**
 * Get all non-premium themes
 */
export function getFreeThemes(): Theme[] {
  return themes.filter((theme) => !theme.meta.premium);
}

/**
 * Get all premium themes
 */
export function getPremiumThemes(): Theme[] {
  return themes.filter((theme) => theme.meta.premium);
}

/**
 * Get theme names as a record
 */
export function getThemeNames(): Record<string, string> {
  return themes.reduce((acc, theme) => {
    acc[theme.meta.id] = theme.meta.name;
    return acc;
  }, {} as Record<string, string>);
}

/**
 * Check if a theme is premium
 */
export function isPremiumTheme(themeId: string): boolean {
  const theme = getThemeById(themeId);
  return theme?.meta.premium ?? false;
}
