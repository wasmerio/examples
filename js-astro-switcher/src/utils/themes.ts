/**
 * Theme Management Utilities
 * 
 * High-level theme management API for components and pages.
 * 
 * Architecture Decision: This is a convenience layer that wraps the core
 * theme utilities (in src/themes/utils.ts). It provides:
 * 1. Simplified API for common operations
 * 2. Filtering of light/dark (now modes, not themes)
 * 3. Type-safe theme IDs
 * 
 * Separation of Concerns:
 * - src/themes/utils.ts: Low-level theme operations (CSS generation, DOM manipulation)
 * - src/utils/themes.ts: High-level API for components (getTheme, setTheme)
 * - src/themes/index.ts: Theme registry and metadata
 * 
 * This separation allows the theme system to be used independently of UI components.
 */

import { getThemeIds, getThemeById, getThemeNames as getThemeNamesFromRegistry, type Theme } from '../themes';
import { applyTheme, getCurrentTheme, getCurrentMode, setMode as setModeUtil } from '../themes/utils';

export type ThemeId = string;
export type Mode = 'light' | 'dark';

/**
 * Get all available theme IDs (excluding light/dark as they're modes now)
 */
export function getAvailableThemes(): ThemeId[] {
  const allThemes = getThemeIds();
  // Filter out light and dark - they're modes, not color themes
  return allThemes.filter(id => id !== 'light' && id !== 'dark');
}

/**
 * Get current theme from storage or default
 */
export function getTheme(): ThemeId {
  return getCurrentTheme(getAvailableThemes());
}

/**
 * Get current mode (light/dark)
 */
export function getMode(): Mode {
  return getCurrentMode();
}

/**
 * Set and apply a theme (color theme only)
 */
export function setTheme(themeId: ThemeId): void {
  const theme = getThemeById(themeId);
  if (!theme) {
    console.warn(`Theme "${themeId}" not found`);
    return;
  }
  
  const currentMode = getMode();
  applyTheme(themeId, currentMode);
}

/**
 * Set mode (light/dark) for current theme
 */
export function setMode(mode: Mode): void {
  setModeUtil(mode);
  // Re-apply current theme with new mode
  const currentTheme = getTheme();
  applyTheme(currentTheme, mode);
}

/**
 * Initialize theme system
 */
export function initTheme(): void {
  if (typeof window === 'undefined') return;
  
  const theme = getTheme();
  const mode = getMode();
  applyTheme(theme, mode);
  
  // Listen for system theme changes (only if user hasn't set a preference)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('mode')) {
      setMode(e.matches ? 'dark' : 'light');
    }
  });
}

/**
 * Get theme metadata
 */
export function getThemeMeta(themeId: ThemeId) {
  const theme = getThemeById(themeId);
  return theme?.meta;
}

/**
 * Get theme names as a record (excluding light/dark)
 */
export function getThemeNames(): Record<ThemeId, string> {
  const allNames = getThemeNamesFromRegistry();
  const availableThemes = getAvailableThemes();
  const filtered: Record<string, string> = {};
  
  availableThemes.forEach(id => {
    if (allNames[id]) {
      filtered[id] = allNames[id];
    }
  });
  
  return filtered as Record<ThemeId, string>;
}
