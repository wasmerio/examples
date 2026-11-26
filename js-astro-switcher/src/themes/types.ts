/**
 * Design Token Types
 * 
 * Semantic design tokens for a production-ready theme system.
 * All tokens are semantic (e.g., "primary", "surface") rather than
 * raw values (e.g., "blue-500", "#3b82f6").
 */

export interface ColorTokens {
  // Semantic color roles
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  
  // Surface colors
  background: string;
  surface: string;
  surfaceElevated: string;
  
  // Text colors
  text: {
    primary: string;
    secondary: string;
    muted: string;
    inverse: string;
  };
  
  // Border colors
  border: string;
  borderMuted: string;
  borderStrong: string;
  
  // State colors
  success: string;
  successForeground: string;
  warning: string;
  warningForeground: string;
  error: string;
  errorForeground: string;
  info: string;
  infoForeground: string;
  
  // Interactive states
  hover: string;
  active: string;
  focus: string;
}

export interface TypographyTokens {
  fontFamily: {
    sans: string;
    serif: string;
    mono: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
  };
  fontWeight: {
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
    loose: number;
  };
  letterSpacing: {
    tight: string;
    normal: string;
    wide: string;
  };
}

export interface RadiusTokens {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  full: string;
}

export interface ShadowTokens {
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  inner: string;
  none: string;
}

export interface MotionTokens {
  duration: {
    fast: string;
    normal: string;
    slow: string;
  };
  easing: {
    default: string;
    in: string;
    out: string;
    inOut: string;
  };
}

export interface DesignTokens {
  color: ColorTokens;
  typography: TypographyTokens;
  radius: RadiusTokens;
  shadow: ShadowTokens;
  motion: MotionTokens;
}

export interface ThemeMeta {
  id: string;
  name: string;
  description: string;
  author?: string;
  version?: string;
  premium?: boolean;
  tags?: string[];
}

export interface Theme {
  meta: ThemeMeta;
  tokens: DesignTokens;
}
