/**
 * Theme Utilities
 * 
 * Core theme system functions for loading, applying, and managing themes at runtime.
 * 
 * Architecture Decision: These utilities are pure functions that operate on theme data.
 * They are framework-agnostic and can be used in any context (Astro, React, vanilla JS).
 * This separation allows the theme system to work independently of UI framework choices.
 */

import type { Theme, DesignTokens } from './types';

/**
 * Convert design tokens to CSS custom properties
 * 
 * Architecture Decision: We use a 'token' prefix (--token-color-*) instead of generic
 * names (--color-*) to:
 * 1. Avoid conflicts with other CSS variable systems
 * 2. Make it clear these are semantic design tokens, not raw values
 * 3. Enable easy migration/namespacing if needed
 * 
 * @param tokens - Design tokens object from theme definition
 * @param prefix - CSS variable prefix (default: 'token')
 * @returns CSS custom properties as a string
 */
export function tokensToCSS(tokens: DesignTokens, prefix: string = 'token'): string {
  const props: string[] = [];
  
  // Color tokens
  props.push(`  --${prefix}-color-primary: ${tokens.color.primary};`);
  props.push(`  --${prefix}-color-primary-foreground: ${tokens.color.primaryForeground};`);
  props.push(`  --${prefix}-color-secondary: ${tokens.color.secondary};`);
  props.push(`  --${prefix}-color-secondary-foreground: ${tokens.color.secondaryForeground};`);
  props.push(`  --${prefix}-color-accent: ${tokens.color.accent};`);
  props.push(`  --${prefix}-color-accent-foreground: ${tokens.color.accentForeground};`);
  props.push(`  --${prefix}-color-background: ${tokens.color.background};`);
  props.push(`  --${prefix}-color-surface: ${tokens.color.surface};`);
  props.push(`  --${prefix}-color-surface-elevated: ${tokens.color.surfaceElevated};`);
  props.push(`  --${prefix}-color-text-primary: ${tokens.color.text.primary};`);
  props.push(`  --${prefix}-color-text-secondary: ${tokens.color.text.secondary};`);
  props.push(`  --${prefix}-color-text-muted: ${tokens.color.text.muted};`);
  props.push(`  --${prefix}-color-text-inverse: ${tokens.color.text.inverse};`);
  props.push(`  --${prefix}-color-border: ${tokens.color.border};`);
  props.push(`  --${prefix}-color-border-muted: ${tokens.color.borderMuted};`);
  props.push(`  --${prefix}-color-border-strong: ${tokens.color.borderStrong};`);
  props.push(`  --${prefix}-color-success: ${tokens.color.success};`);
  props.push(`  --${prefix}-color-success-foreground: ${tokens.color.successForeground};`);
  props.push(`  --${prefix}-color-warning: ${tokens.color.warning};`);
  props.push(`  --${prefix}-color-warning-foreground: ${tokens.color.warningForeground};`);
  props.push(`  --${prefix}-color-error: ${tokens.color.error};`);
  props.push(`  --${prefix}-color-error-foreground: ${tokens.color.errorForeground};`);
  props.push(`  --${prefix}-color-info: ${tokens.color.info};`);
  props.push(`  --${prefix}-color-info-foreground: ${tokens.color.infoForeground};`);
  props.push(`  --${prefix}-color-hover: ${tokens.color.hover};`);
  props.push(`  --${prefix}-color-active: ${tokens.color.active};`);
  props.push(`  --${prefix}-color-focus: ${tokens.color.focus};`);
  
  // Typography tokens
  props.push(`  --${prefix}-font-family-sans: ${tokens.typography.fontFamily.sans};`);
  props.push(`  --${prefix}-font-family-serif: ${tokens.typography.fontFamily.serif};`);
  props.push(`  --${prefix}-font-family-mono: ${tokens.typography.fontFamily.mono};`);
  props.push(`  --${prefix}-font-size-xs: ${tokens.typography.fontSize.xs};`);
  props.push(`  --${prefix}-font-size-sm: ${tokens.typography.fontSize.sm};`);
  props.push(`  --${prefix}-font-size-base: ${tokens.typography.fontSize.base};`);
  props.push(`  --${prefix}-font-size-lg: ${tokens.typography.fontSize.lg};`);
  props.push(`  --${prefix}-font-size-xl: ${tokens.typography.fontSize.xl};`);
  props.push(`  --${prefix}-font-size-2xl: ${tokens.typography.fontSize['2xl']};`);
  props.push(`  --${prefix}-font-size-3xl: ${tokens.typography.fontSize['3xl']};`);
  props.push(`  --${prefix}-font-size-4xl: ${tokens.typography.fontSize['4xl']};`);
  props.push(`  --${prefix}-font-size-5xl: ${tokens.typography.fontSize['5xl']};`);
  props.push(`  --${prefix}-font-weight-normal: ${tokens.typography.fontWeight.normal};`);
  props.push(`  --${prefix}-font-weight-medium: ${tokens.typography.fontWeight.medium};`);
  props.push(`  --${prefix}-font-weight-semibold: ${tokens.typography.fontWeight.semibold};`);
  props.push(`  --${prefix}-font-weight-bold: ${tokens.typography.fontWeight.bold};`);
  props.push(`  --${prefix}-line-height-tight: ${tokens.typography.lineHeight.tight};`);
  props.push(`  --${prefix}-line-height-normal: ${tokens.typography.lineHeight.normal};`);
  props.push(`  --${prefix}-line-height-relaxed: ${tokens.typography.lineHeight.relaxed};`);
  props.push(`  --${prefix}-line-height-loose: ${tokens.typography.lineHeight.loose};`);
  props.push(`  --${prefix}-letter-spacing-tight: ${tokens.typography.letterSpacing.tight};`);
  props.push(`  --${prefix}-letter-spacing-normal: ${tokens.typography.letterSpacing.normal};`);
  props.push(`  --${prefix}-letter-spacing-wide: ${tokens.typography.letterSpacing.wide};`);
  
  // Radius tokens
  props.push(`  --${prefix}-radius-none: ${tokens.radius.none};`);
  props.push(`  --${prefix}-radius-sm: ${tokens.radius.sm};`);
  props.push(`  --${prefix}-radius-md: ${tokens.radius.md};`);
  props.push(`  --${prefix}-radius-lg: ${tokens.radius.lg};`);
  props.push(`  --${prefix}-radius-xl: ${tokens.radius.xl};`);
  props.push(`  --${prefix}-radius-2xl: ${tokens.radius['2xl']};`);
  props.push(`  --${prefix}-radius-full: ${tokens.radius.full};`);
  
  // Shadow tokens
  props.push(`  --${prefix}-shadow-1: ${tokens.shadow[1]};`);
  props.push(`  --${prefix}-shadow-2: ${tokens.shadow[2]};`);
  props.push(`  --${prefix}-shadow-3: ${tokens.shadow[3]};`);
  props.push(`  --${prefix}-shadow-4: ${tokens.shadow[4]};`);
  props.push(`  --${prefix}-shadow-5: ${tokens.shadow[5]};`);
  props.push(`  --${prefix}-shadow-inner: ${tokens.shadow.inner};`);
  props.push(`  --${prefix}-shadow-none: ${tokens.shadow.none};`);
  
  // Motion tokens
  props.push(`  --${prefix}-motion-duration-fast: ${tokens.motion.duration.fast};`);
  props.push(`  --${prefix}-motion-duration-normal: ${tokens.motion.duration.normal};`);
  props.push(`  --${prefix}-motion-duration-slow: ${tokens.motion.duration.slow};`);
  props.push(`  --${prefix}-motion-easing-default: ${tokens.motion.easing.default};`);
  props.push(`  --${prefix}-motion-easing-in: ${tokens.motion.easing.in};`);
  props.push(`  --${prefix}-motion-easing-out: ${tokens.motion.easing.out};`);
  props.push(`  --${prefix}-motion-easing-in-out: ${tokens.motion.easing.inOut};`);
  
  return props.join('\n');
}

/**
 * Generate CSS for a theme with mode variant
 * 
 * Architecture Decision: We use attribute selectors [data-theme="id"][data-mode="light"]
 * instead of class-based selectors because:
 * 1. Attributes are easier to manipulate at runtime
 * 2. No risk of class name conflicts
 * 3. Clear separation between theme (color scheme) and mode (light/dark)
 * 4. Works seamlessly with Astro's view transitions
 * 
 * @param theme - Theme object with meta and tokens
 * @param mode - Light or dark mode variant
 * @returns Complete CSS block for the theme-mode combination
 */
export function generateThemeCSS(theme: Theme, mode: 'light' | 'dark' = 'light'): string {
  const selector = `[data-theme="${theme.meta.id}"][data-mode="${mode}"]`;
  return `/* ${theme.meta.name} Theme - ${mode} mode */\n${selector} {\n${tokensToCSS(theme.tokens)}\n}`;
}

/**
 * Apply theme and mode to document at runtime
 * 
 * Architecture Decision: We use both data attributes AND localStorage because:
 * 1. Data attributes provide immediate CSS selector matching
 * 2. localStorage persists preference across sessions
 * 3. Custom events allow React components to react without prop drilling
 * 4. This pattern works for both SSR (Astro) and client-side (React) components
 * 
 * @param themeId - Theme identifier (e.g., 'blue', 'aurora')
 * @param mode - Light or dark mode
 */
export function applyTheme(themeId: string, mode: 'light' | 'dark' = 'light'): void {
  if (typeof document === 'undefined') return;
  
  // Set data attributes for CSS selector matching
  document.documentElement.setAttribute('data-theme', themeId);
  document.documentElement.setAttribute('data-mode', mode);
  
  // Persist preferences for next session
  localStorage.setItem('theme', themeId);
  localStorage.setItem('mode', mode);
  
  // Dispatch event for React components to react (decoupled communication)
  window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: themeId, mode } }));
}

/**
 * Get current theme from storage or default
 */
export function getCurrentTheme(availableThemes: string[]): string {
  if (typeof window === 'undefined') return availableThemes[0] || 'blue';
  
  const stored = localStorage.getItem('theme');
  if (stored && availableThemes.includes(stored)) {
    return stored;
  }
  
  return availableThemes[0] || 'blue';
}

/**
 * Get current mode from storage or system preference
 */
export function getCurrentMode(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  
  const stored = localStorage.getItem('mode') as 'light' | 'dark' | null;
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  
  // Check system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'light';
}

/**
 * Set mode (light/dark)
 */
export function setMode(mode: 'light' | 'dark'): void {
  if (typeof document === 'undefined') return;
  
  document.documentElement.setAttribute('data-mode', mode);
  localStorage.setItem('mode', mode);
  
  // Dispatch event for components to react
  window.dispatchEvent(new CustomEvent('modechange', { detail: { mode } }));
}
