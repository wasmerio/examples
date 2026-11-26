/**
 * Theme Presets System
 *
 * Live color scheme switching for showcasing design system flexibility.
 * Colors are applied via CSS custom properties on :root.
 *
 * Usage:
 *   import { applyTheme, themePresets } from './theme-presets';
 *   applyTheme('coastal-sage');
 */

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  colors: {
    // Primary brand colors
    primary: string;
    primaryDark: string;
    primaryDarker: string;
    primaryLight: string;
    primaryLighter: string;
    // Accent colors
    accentSky: string;
    accentSkyLight: string;
    accentOrange: string;
    accentOrangeLight: string;
  };
  button?: {
    radius?: string;
    shadow?: string;
  };
}

export const themePresets: ThemePreset[] = [
  {
    id: "healthcare-teal",
    name: "Healthcare Teal",
    description: "Default medical/healthcare theme",
    colors: {
      primary: "#0d9488",
      primaryDark: "#0f766e",
      primaryDarker: "#115e59",
      primaryLight: "#14b8a6",
      primaryLighter: "#5eead4",
      accentSky: "#0ea5e9",
      accentSkyLight: "#0ea5e9cc",
      accentOrange: "#fb923c",
      accentOrangeLight: "#fb923ccc",
    },
  },
  {
    id: "navy-gold",
    name: "Navy Gold",
    description: "Professional and luxurious",
    colors: {
      primary: "#1e3a5f",
      primaryDark: "#152a45",
      primaryDarker: "#0f1f33",
      primaryLight: "#2d5a8a",
      primaryLighter: "#5b8fc4",
      accentSky: "#d4a853",
      accentSkyLight: "#d4a853cc",
      accentOrange: "#c9944a",
      accentOrangeLight: "#c9944acc",
    },
  },
  {
    id: "warm-earth",
    name: "Warm Earth",
    description: "Natural and grounded",
    colors: {
      primary: "#92400e",
      primaryDark: "#78350f",
      primaryDarker: "#5c2d0e",
      primaryLight: "#b45309",
      primaryLighter: "#d97706",
      accentSky: "#059669",
      accentSkyLight: "#059669cc",
      accentOrange: "#dc2626",
      accentOrangeLight: "#dc2626cc",
    },
  },
  {
    id: "modern-sky",
    name: "Modern Sky",
    description: "Clean and contemporary",
    colors: {
      primary: "#0369a1",
      primaryDark: "#075985",
      primaryDarker: "#0c4a6e",
      primaryLight: "#0284c7",
      primaryLighter: "#38bdf8",
      accentSky: "#8b5cf6",
      accentSkyLight: "#8b5cf6cc",
      accentOrange: "#f97316",
      accentOrangeLight: "#f97316cc",
    },
  },
  {
    id: "elegant-wine",
    name: "Elegant Wine",
    description: "Sophisticated and refined",
    colors: {
      primary: "#7c2d4d",
      primaryDark: "#6b2343",
      primaryDarker: "#5a1a38",
      primaryLight: "#9d3d63",
      primaryLighter: "#c76b8f",
      accentSky: "#0891b2",
      accentSkyLight: "#0891b2cc",
      accentOrange: "#ca8a04",
      accentOrangeLight: "#ca8a04cc",
    },
  },
  {
    id: "coastal-sage",
    name: "Coastal Sage",
    description: "Calm and refreshing",
    colors: {
      primary: "#4d7c6f",
      primaryDark: "#3d6359",
      primaryDarker: "#2d4a43",
      primaryLight: "#5e9585",
      primaryLighter: "#8fbfb0",
      accentSky: "#6366f1",
      accentSkyLight: "#6366f1cc",
      accentOrange: "#ea580c",
      accentOrangeLight: "#ea580ccc",
    },
  },
];

const STORAGE_KEY = "theme-id";
const DEFAULT_THEME = "healthcare-teal";

/**
 * Apply a theme by setting CSS custom properties on :root
 */
export function applyTheme(themeId: string): void {
  const theme = themePresets.find((t) => t.id === themeId);
  if (!theme) {
    console.warn(`Theme "${themeId}" not found, using default`);
    applyTheme(DEFAULT_THEME);
    return;
  }

  const root = document.documentElement;
  const { colors, button } = theme;

  // Apply color variables
  root.style.setProperty("--color-theme-primary", colors.primary);
  root.style.setProperty("--color-theme-primary-dark", colors.primaryDark);
  root.style.setProperty("--color-theme-primary-darker", colors.primaryDarker);
  root.style.setProperty("--color-theme-primary-light", colors.primaryLight);
  root.style.setProperty("--color-theme-primary-lighter", colors.primaryLighter);
  root.style.setProperty("--color-theme-accent-sky", colors.accentSky);
  root.style.setProperty("--color-theme-accent-sky-light", colors.accentSkyLight);
  root.style.setProperty("--color-theme-accent-orange", colors.accentOrange);
  root.style.setProperty("--color-theme-accent-orange-light", colors.accentOrangeLight);

  // Apply button styling if specified
  if (button?.radius) {
    root.style.setProperty("--button-radius", button.radius);
  }
  if (button?.shadow) {
    root.style.setProperty("--button-shadow", button.shadow);
  }

  // Dispatch event for component synchronization
  window.dispatchEvent(new CustomEvent("theme-changed", { detail: { themeId } }));
}

/**
 * Get the currently active theme ID from localStorage
 */
export function getCurrentThemeId(): string {
  if (typeof localStorage === "undefined") return DEFAULT_THEME;
  return localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
}

/**
 * Save theme preference to localStorage and apply it
 */
export function saveThemePreference(themeId: string): void {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(STORAGE_KEY, themeId);
  }
  applyTheme(themeId);
}

/**
 * Initialize theme from stored preference
 */
export function initTheme(): void {
  const themeId = getCurrentThemeId();
  applyTheme(themeId);
}
