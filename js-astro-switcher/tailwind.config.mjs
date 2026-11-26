import typography from "@tailwindcss/typography";

/**
 * Tailwind Configuration
 * 
 * Architecture Decisions:
 * 1. Dark mode uses data attributes ([data-mode="dark"]) not media queries
 *    This allows runtime mode switching independent of system preference
 * 2. All colors map to semantic tokens - no raw color values
 *    This ensures Tailwind utilities work with the theme system
 * 3. Typography, radius, shadow, motion all use tokens
 *    Complete integration with the token system
 * 
 * This configuration makes Tailwind utilities theme-aware automatically.
 * You can use bg-primary, text-text-primary, etc. and they'll work across all themes.
 */

/** @type {import('tailwindcss').Config} */
export default {
  // Use data attributes for dark mode, not media queries
  // Architecture: Allows runtime mode switching, independent of system preference
  darkMode: ['selector', '[data-mode="dark"]'],
  
  theme: {
    extend: {
      // Colors: Map to semantic token CSS variables only
      // Architecture: No hardcoded colors - all utilities use tokens
      colors: {
        // Primary colors
        primary: 'var(--token-color-primary)',
        'primary-foreground': 'var(--token-color-primary-foreground)',
        
        // Secondary colors
        secondary: 'var(--token-color-secondary)',
        'secondary-foreground': 'var(--token-color-secondary-foreground)',
        
        // Accent colors
        accent: 'var(--token-color-accent)',
        'accent-foreground': 'var(--token-color-accent-foreground)',
        
        // Surface colors
        background: 'var(--token-color-background)',
        surface: 'var(--token-color-surface)',
        'surface-elevated': 'var(--token-color-surface-elevated)',
        
        // Text colors
        text: {
          primary: 'var(--token-color-text-primary)',
          secondary: 'var(--token-color-text-secondary)',
          muted: 'var(--token-color-text-muted)',
          inverse: 'var(--token-color-text-inverse)',
        },
        
        // Border colors
        border: 'var(--token-color-border)',
        'border-muted': 'var(--token-color-border-muted)',
        'border-strong': 'var(--token-color-border-strong)',
        
        // State colors
        success: 'var(--token-color-success)',
        'success-foreground': 'var(--token-color-success-foreground)',
        warning: 'var(--token-color-warning)',
        'warning-foreground': 'var(--token-color-warning-foreground)',
        error: 'var(--token-color-error)',
        'error-foreground': 'var(--token-color-error-foreground)',
        info: 'var(--token-color-info)',
        'info-foreground': 'var(--token-color-info-foreground)',
        
        // Interactive states
        hover: 'var(--token-color-hover)',
        active: 'var(--token-color-active)',
        focus: 'var(--token-color-focus)',
      },
      
      // Typography: Map to semantic token CSS variables
      fontFamily: {
        sans: 'var(--token-font-family-sans)',
        serif: 'var(--token-font-family-serif)',
        mono: 'var(--token-font-family-mono)',
      },
      
      fontSize: {
        xs: 'var(--token-font-size-xs)',
        sm: 'var(--token-font-size-sm)',
        base: 'var(--token-font-size-base)',
        lg: 'var(--token-font-size-lg)',
        xl: 'var(--token-font-size-xl)',
        '2xl': 'var(--token-font-size-2xl)',
        '3xl': 'var(--token-font-size-3xl)',
        '4xl': 'var(--token-font-size-4xl)',
        '5xl': 'var(--token-font-size-5xl)',
      },
      
      fontWeight: {
        normal: 'var(--token-font-weight-normal)',
        medium: 'var(--token-font-weight-medium)',
        semibold: 'var(--token-font-weight-semibold)',
        bold: 'var(--token-font-weight-bold)',
      },
      
      lineHeight: {
        tight: 'var(--token-line-height-tight)',
        normal: 'var(--token-line-height-normal)',
        relaxed: 'var(--token-line-height-relaxed)',
        loose: 'var(--token-line-height-loose)',
      },
      
      letterSpacing: {
        tight: 'var(--token-letter-spacing-tight)',
        normal: 'var(--token-letter-spacing-normal)',
        wide: 'var(--token-letter-spacing-wide)',
      },
      
      // Border radius: Map to semantic token CSS variables
      borderRadius: {
        none: 'var(--token-radius-none)',
        sm: 'var(--token-radius-sm)',
        md: 'var(--token-radius-md)',
        lg: 'var(--token-radius-lg)',
        xl: 'var(--token-radius-xl)',
        '2xl': 'var(--token-radius-2xl)',
        full: 'var(--token-radius-full)',
      },
      
      // Box shadow: Map to semantic token CSS variables
      boxShadow: {
        1: 'var(--token-shadow-1)',
        2: 'var(--token-shadow-2)',
        3: 'var(--token-shadow-3)',
        4: 'var(--token-shadow-4)',
        5: 'var(--token-shadow-5)',
        inner: 'var(--token-shadow-inner)',
        none: 'var(--token-shadow-none)',
      },
      
      // Transition duration: Map to semantic token CSS variables
      transitionDuration: {
        fast: 'var(--token-motion-duration-fast)',
        normal: 'var(--token-motion-duration-normal)',
        slow: 'var(--token-motion-duration-slow)',
      },
      
      // Transition timing function: Map to semantic token CSS variables
      transitionTimingFunction: {
        default: 'var(--token-motion-easing-default)',
        in: 'var(--token-motion-easing-in)',
        out: 'var(--token-motion-easing-out)',
        'in-out': 'var(--token-motion-easing-in-out)',
      },
    },
  },
  
  plugins: [typography],
};
