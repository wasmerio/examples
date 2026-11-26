/**
 * Theme Generator Utility
 * 
 * This utility helps generate new Tailwind themes dynamically.
 * Themes are defined using CSS custom properties that can be
 * applied via data-theme attributes.
 */

export interface ThemeColors {
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
}

/**
 * Generate CSS for a new theme
 */
export function generateThemeCSS(themeName: string, colors: ThemeColors): string {
  return `
/* ${themeName} Theme */
[data-theme="${themeName}"] {
  --color-background: ${colors.background};
  --color-foreground: ${colors.foreground};
  --color-muted: ${colors.muted};
  --color-muted-foreground: ${colors.mutedForeground};
  --color-border: ${colors.border};
  --color-primary: ${colors.primary};
  --color-primary-foreground: ${colors.primaryForeground};
  --color-secondary: ${colors.secondary};
  --color-secondary-foreground: ${colors.secondaryForeground};
  --color-accent: ${colors.accent};
  --color-accent-foreground: ${colors.accentForeground};
}
`;
}

/**
 * Generate a theme from a base color
 */
export function generateThemeFromColor(
  themeName: string,
  baseColor: string,
  isDark: boolean = false
): ThemeColors {
  // This is a simplified generator - you can enhance it with proper color calculations
  if (isDark) {
    return {
      background: '#111827',
      foreground: '#f9fafb',
      muted: '#1f2937',
      mutedForeground: '#9ca3af',
      border: '#374151',
      primary: baseColor,
      primaryForeground: '#ffffff',
      secondary: '#374151',
      secondaryForeground: '#f9fafb',
      accent: '#1f2937',
      accentForeground: '#f9fafb',
    };
  } else {
    return {
      background: '#ffffff',
      foreground: '#111827',
      muted: '#f9fafb',
      mutedForeground: '#6b7280',
      border: '#e5e7eb',
      primary: baseColor,
      primaryForeground: '#ffffff',
      secondary: '#f3f4f6',
      secondaryForeground: '#111827',
      accent: '#f9fafb',
      accentForeground: '#111827',
    };
  }
}

/**
 * Example: Generate a red theme
 */
export function generateRedTheme(): string {
  const colors: ThemeColors = {
    background: '#fef2f2',
    foreground: '#7f1d1d',
    muted: '#fee2e2',
    mutedForeground: '#dc2626',
    border: '#fecaca',
    primary: '#ef4444',
    primaryForeground: '#ffffff',
    secondary: '#fee2e2',
    secondaryForeground: '#7f1d1d',
    accent: '#fecaca',
    accentForeground: '#7f1d1d',
  };
  
  return generateThemeCSS('red', colors);
}
