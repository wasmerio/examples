/**
 * Get the primary color for a theme
 * 
 * @deprecated Use getThemeById from '../themes' instead
 * This utility is kept for backward compatibility.
 */
import { getThemeById } from '../themes';

export function getThemePrimaryColor(themeId: string): string {
  const theme = getThemeById(themeId);
  return theme?.tokens.color.primary || '#000000';
}
