/**
 * Design System Type Definitions
 * Ensures type safety and consistency across the application
 *
 * Note: Astro components use slots instead of children props.
 * These types are for reference/documentation purposes.
 */

export type ButtonVariant = "primary" | "primary-dark" | "white" | "white-outline";
export type ButtonSize = "base" | "lg";

export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type TextSize = "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
export type TextWeight = "normal" | "medium" | "semibold" | "bold";

// Design Token Types
export interface DesignTokens {
  colors: {
    primary: string;
    primaryDark: string;
    primaryDarker: string;
    primaryLight: string;
    primaryLighter: string;
  };
  spacing: {
    buttonPx: string;
    buttonPy: string;
    buttonPxLg: string;
    buttonPyLg: string;
  };
  typography: {
    h1Mobile: string;
    h1Desktop: string;
    h2Mobile: string;
    h2Desktop: string;
    h3Mobile: string;
    h3Desktop: string;
    bodyMobile: string;
    bodyDesktop: string;
  };
}
