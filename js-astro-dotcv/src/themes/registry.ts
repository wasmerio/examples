import ClassicWeb from "./classic/index.astro";
import ClassicPdf from "./classic/pdf.astro";
import SidebarWeb from "./sidebar/index.astro";
import SidebarPdf from "./sidebar/pdf.astro";
import TimelineWeb from "./timeline/index.astro";
import TimelinePdf from "./timeline/pdf.astro";

export interface ThemeDefinition {
  web: any;
  pdf: any;
}

export const themes = {
  classic: {
    web: ClassicWeb,
    pdf: ClassicPdf,
  },
  sidebar: {
    web: SidebarWeb,
    pdf: SidebarPdf,
  },
  timeline: {
    web: TimelineWeb,
    pdf: TimelinePdf,
  },
} as const;

export type ThemeName = keyof typeof themes;

export interface ResolvedTheme {
  theme: ThemeDefinition;
  themeName: string;
  isFallback: boolean;
  fallbackReason?: string;
  availableThemes: string[];
}

export function resolveTheme(requestedName?: string): ResolvedTheme {
  const availableThemes = Object.keys(themes);
  const normalized = requestedName?.trim().toLowerCase();

  if (normalized && normalized in themes) {
    return {
      theme: themes[normalized as ThemeName],
      themeName: normalized,
      isFallback: false,
      availableThemes,
    };
  }

  return {
    theme: themes.classic,
    themeName: "classic",
    isFallback: true,
    fallbackReason: `Theme "${requestedName}" not found. Available themes: ${availableThemes.join(", ")}`,
    availableThemes,
  };
}

export function getTheme(themeName: string) {
  const resolved = resolveTheme(themeName);
  if (resolved.isFallback) {
    throw new Error(resolved.fallbackReason);
  }
  return resolved.theme;
}
