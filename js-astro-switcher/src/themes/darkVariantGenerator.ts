/**
 * Dark Variant Generator
 * 
 * Generates dark mode variants for color themes by adjusting
 * brightness, contrast, and inverting certain color relationships.
 */

import type { DesignTokens } from './types';

/**
 * Convert hex to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Convert RGB to hex
 */
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
}

/**
 * Adjust brightness of a color
 */
function adjustBrightness(hex: string, factor: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const r = Math.max(0, Math.min(255, Math.round(rgb.r * factor)));
  const g = Math.max(0, Math.min(255, Math.round(rgb.g * factor)));
  const b = Math.max(0, Math.min(255, Math.round(rgb.b * factor)));

  return rgbToHex(r, g, b);
}

/**
 * Mix two colors together
 */
function mixColors(color1: string, color2: string, ratio: number): string {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  if (!rgb1 || !rgb2) return color1;

  const r = Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio);
  const g = Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio);
  const b = Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio);

  return rgbToHex(r, g, b);
}

/**
 * Invert a color (for dark backgrounds)
 */
function invertColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const r = 255 - rgb.r;
  const g = 255 - rgb.g;
  const b = 255 - rgb.b;

  return rgbToHex(r, g, b);
}

/**
 * Generate dark variant of a theme
 */
export function generateDarkVariant(lightTokens: DesignTokens): DesignTokens {
  return {
    ...lightTokens,
    color: {
      ...lightTokens.color,
      // Invert background and foreground relationship
      background: adjustBrightness(lightTokens.color.background, 0.15), // Very dark
      surface: adjustBrightness(lightTokens.color.background, 0.25), // Dark
      surfaceElevated: adjustBrightness(lightTokens.color.background, 0.35), // Medium dark
      
      // Invert text colors
      text: {
        primary: adjustBrightness(lightTokens.color.text.inverse, 0.9), // Light text
        secondary: adjustBrightness(lightTokens.color.text.inverse, 0.7), // Medium light
        muted: adjustBrightness(lightTokens.color.text.inverse, 0.85), // Improved contrast: changed from 0.5 to 0.7 to 0.85 for better WCAG AA compliance on dark backgrounds
        inverse: lightTokens.color.text.primary, // Dark text for light backgrounds
      },
      
      // Keep primary colors but adjust for dark backgrounds
      primary: lightTokens.color.primary,
      primaryForeground: lightTokens.color.primaryForeground,
      
      // Secondary: Create a visible, theme-aware secondary color for dark mode
      // Mix the primary color with the dark surface to maintain theme identity
      // while ensuring good contrast and legibility
      secondary: mixColors(
        adjustBrightness(lightTokens.color.background, 0.4), // Base dark surface
        lightTokens.color.primary, // Theme primary color
        0.15 // 15% primary color tint for theme identity
      ),
      // Secondary foreground: Always use light text for dark secondary backgrounds
      secondaryForeground: adjustBrightness(lightTokens.color.text.inverse, 0.95), // Very light text (white-ish)
      
      // Accent: Similar approach - visible with theme identity
      accent: mixColors(
        adjustBrightness(lightTokens.color.background, 0.35),
        lightTokens.color.primary,
        0.1 // 10% primary color tint
      ),
      accentForeground: adjustBrightness(lightTokens.color.text.inverse, 0.95), // Very light text
      
      // Adjust borders
      border: adjustBrightness(lightTokens.color.border, 0.4),
      borderMuted: adjustBrightness(lightTokens.color.borderMuted, 0.3),
      borderStrong: adjustBrightness(lightTokens.color.borderStrong, 0.5),
      
      // Keep state colors but adjust foregrounds if needed
      success: lightTokens.color.success,
      successForeground: lightTokens.color.successForeground,
      warning: lightTokens.color.warning,
      warningForeground: lightTokens.color.warningForeground,
      error: lightTokens.color.error,
      errorForeground: lightTokens.color.errorForeground,
      info: lightTokens.color.info,
      infoForeground: lightTokens.color.infoForeground,
      
      // Adjust interactive states
      hover: 'rgba(255, 255, 255, 0.1)',
      active: 'rgba(255, 255, 255, 0.15)',
      focus: lightTokens.color.focus,
    },
    // Shadows are darker in dark mode
    shadow: {
      1: lightTokens.shadow[1].replace('0.05', '0.3'),
      2: lightTokens.shadow[2].replace('0.1', '0.4').replace('0.15', '0.4'),
      3: lightTokens.shadow[3].replace('0.1', '0.4').replace('0.15', '0.4'),
      4: lightTokens.shadow[4].replace('0.1', '0.4').replace('0.2', '0.5'),
      5: lightTokens.shadow[5].replace('0.1', '0.4').replace('0.2', '0.5'),
      inner: lightTokens.shadow.inner.replace('0.05', '0.2'),
      none: lightTokens.shadow.none,
    },
  };
}
