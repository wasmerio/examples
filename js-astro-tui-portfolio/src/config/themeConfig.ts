export interface ThemeColorPalette {
  bgMain: string;
  bgCard: string;
  bgCardHover: string;
  fgMain: string;
  fgDim: string;
  fgBright: string;
  accent: string;
  accentSecondary: string;
  borderColor: string;
  borderActive: string;
  glowColor: string;
  selectionBg: string;
  selectionFg: string;
  statusBarBg: string;
}

export type CRTIntensityLevel = "low" | "medium" | "high" | "ultra";

export interface CRTConfig {
  enabled: boolean;
  intensity: CRTIntensityLevel;
  scanlineOpacity: number; // 0.0 (off) to 1.0 (heavy)
  vignetteOpacity: number;  // 0.0 (off) to 1.0 (heavy)
}

export interface ThemeConfig {
  id: string;
  name: string;
  emoji: string;
  description: string;
  colors: ThemeColorPalette;
}

export const CRT_PRESETS: Record<CRTIntensityLevel, { scanlineOpacity: number; vignetteOpacity: number; label: string }> = {
  low: { scanlineOpacity: 0.10, vignetteOpacity: 0.35, label: "LOW (Subtle Scanlines)" },
  medium: { scanlineOpacity: 0.22, vignetteOpacity: 0.65, label: "MEDIUM (Balanced CRT)" },
  high: { scanlineOpacity: 0.40, vignetteOpacity: 0.85, label: "HIGH (Classic Arcade CRT)" },
  ultra: { scanlineOpacity: 0.65, vignetteOpacity: 0.98, label: "ULTRA (Heavy Phosphor Glare)" },
};

/**
 * 📺 GLOBAL CRT FILTER SETTING (Applies across ALL themes)
 * Users can easily adjust the default global CRT filter intensity & strength here!
 */
export const GLOBAL_CRT_CONFIG: CRTConfig = {
  enabled: true,
  intensity: "medium", // Options: "low" | "medium" | "high" | "ultra"
  scanlineOpacity: 0.20, // Default balanced CRT scanlines (0.0 to 1.0)
  vignetteOpacity: 0.65, // Default retro glass corner vignette shadow (0.0 to 1.0)
};

/**
 * Built-in Retro CRT Themes
 */
export const BUILTIN_THEMES: ThemeConfig[] = [
  {
    id: "green",
    name: "Phosphor Green",
    emoji: "🟢",
    description: "1980s green CRT monitor phosphor glow",
    colors: {
      bgMain: "#0a120b",
      bgCard: "#0d1a0e",
      bgCardHover: "#122414",
      fgMain: "#00ff66",
      fgDim: "#00aa44",
      fgBright: "#66ff99",
      accent: "#00ffcc",
      accentSecondary: "#00dd88",
      borderColor: "#00441b",
      borderActive: "#00ff66",
      glowColor: "rgba(0, 255, 102, 0.25)",
      selectionBg: "#00441b",
      selectionFg: "#00ff66",
      statusBarBg: "#040905",
    },
  },
  {
    id: "amber",
    name: "Amber CRT",
    emoji: "🟠",
    description: "VT100 & IBM mainframe amber phosphor glow",
    colors: {
      bgMain: "#140d04",
      bgCard: "#1d1306",
      bgCardHover: "#291a08",
      fgMain: "#ffb000",
      fgDim: "#b37b00",
      fgBright: "#ffd066",
      accent: "#ffcc00",
      accentSecondary: "#e69d00",
      borderColor: "#4a3200",
      borderActive: "#ffb000",
      glowColor: "rgba(255, 176, 0, 0.25)",
      selectionBg: "#4a3200",
      selectionFg: "#ffb000",
      statusBarBg: "#0a0602",
    },
  },
  {
    id: "cyan",
    name: "Cyber Cyan",
    emoji: "🔵",
    description: "High-contrast electric cyan & hot pink neon",
    colors: {
      bgMain: "#051014",
      bgCard: "#091920",
      bgCardHover: "#0e242e",
      fgMain: "#00f0ff",
      fgDim: "#009cb3",
      fgBright: "#70f5ff",
      accent: "#ff007f",
      accentSecondary: "#00d5e6",
      borderColor: "#003d47",
      borderActive: "#00f0ff",
      glowColor: "rgba(0, 240, 255, 0.25)",
      selectionBg: "#003d47",
      selectionFg: "#00f0ff",
      statusBarBg: "#02070a",
    },
  },
  {
    id: "dracula",
    name: "Dracula Synth",
    emoji: "🟣",
    description: "Dark synthwave purple & pastel green",
    colors: {
      bgMain: "#110e1b",
      bgCard: "#191428",
      bgCardHover: "#221c38",
      fgMain: "#bd93f9",
      fgDim: "#7e5ebb",
      fgBright: "#d6bbfb",
      accent: "#ff79c6",
      accentSecondary: "#50fa7b",
      borderColor: "#3b2c59",
      borderActive: "#bd93f9",
      glowColor: "rgba(189, 147, 249, 0.25)",
      selectionBg: "#3b2c59",
      selectionFg: "#bd93f9",
      statusBarBg: "#08060e",
    },
  },
  {
    id: "mono",
    name: "Monochrome",
    emoji: "⚪",
    description: "Minimalist high-contrast monochrome paper",
    colors: {
      bgMain: "#0f0f0f",
      bgCard: "#191919",
      bgCardHover: "#252525",
      fgMain: "#eeeeee",
      fgDim: "#888888",
      fgBright: "#ffffff",
      accent: "#00e5ff",
      accentSecondary: "#aaaaaa",
      borderColor: "#333333",
      borderActive: "#eeeeee",
      glowColor: "rgba(255, 255, 255, 0.15)",
      selectionBg: "#333333",
      selectionFg: "#ffffff",
      statusBarBg: "#080808",
    },
  },
  {
    id: "cappuccino",
    name: "Cappuccino",
    emoji: "☕",
    description: "Warm espresso brown & creamy caramel CRT glow",
    colors: {
      bgMain: "#1b1411",
      bgCard: "#251c18",
      bgCardHover: "#322620",
      fgMain: "#f5e6d3",
      fgDim: "#a88e79",
      fgBright: "#ffffff",
      accent: "#e69a58",
      accentSecondary: "#d4813b",
      borderColor: "#4a352c",
      borderActive: "#e69a58",
      glowColor: "rgba(230, 154, 88, 0.25)",
      selectionBg: "#4a352c",
      selectionFg: "#f5e6d3",
      statusBarBg: "#0e0a08",
    },
  },
];

/**
 * 🌟 ADD YOUR CUSTOM THEMES HERE!
 * Users can easily define custom color themes by adding objects to this array.
 */
export const CUSTOM_THEMES: ThemeConfig[] = [];

/**
 * Combined list of all available themes (Built-in + Custom)
 */
export const ALL_THEMES: ThemeConfig[] = [...BUILTIN_THEMES, ...CUSTOM_THEMES];

/**
 * Helper utility to apply theme CSS variables to the document root element
 */
export function applyTheme(themeId: string) {
  const theme = ALL_THEMES.find((t) => t.id === themeId) || BUILTIN_THEMES[0];
  const root = document.documentElement;

  root.setAttribute("data-theme", theme.id);

  // Dynamically set CSS variables for custom themes
  const c = theme.colors;
  root.style.setProperty("--bg-main", c.bgMain);
  root.style.setProperty("--bg-card", c.bgCard);
  root.style.setProperty("--bg-card-hover", c.bgCardHover);
  root.style.setProperty("--fg-main", c.fgMain);
  root.style.setProperty("--fg-dim", c.fgDim);
  root.style.setProperty("--fg-bright", c.fgBright);
  root.style.setProperty("--accent", c.accent);
  root.style.setProperty("--accent-secondary", c.accentSecondary);
  root.style.setProperty("--border-color", c.borderColor);
  root.style.setProperty("--border-active", c.borderActive);
  root.style.setProperty("--glow-color", c.glowColor);
  root.style.setProperty("--selection-bg", c.selectionBg);
  root.style.setProperty("--selection-fg", c.selectionFg);
  root.style.setProperty("--status-bar-bg", c.statusBarBg);
}

/**
 * Apply CRT filter settings, intensity presets, and opacity values dynamically
 */
export function applyCRTConfig(config: Partial<CRTConfig> = {}) {
  const root = document.documentElement;
  const isMobile = window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  let enabled: boolean;
  if (config.enabled !== undefined) {
    enabled = config.enabled;
    if (!isMobile) {
      localStorage.setItem("tui_crt", String(enabled));
    }
  } else {
    const saved = localStorage.getItem("tui_crt");
    enabled = saved !== null ? saved === "true" : GLOBAL_CRT_CONFIG.enabled;
  }

  if (isMobile) enabled = false;

  let scanlineOpacity = config.scanlineOpacity;
  let vignetteOpacity = config.vignetteOpacity;

  if (config.intensity && CRT_PRESETS[config.intensity]) {
    const preset = CRT_PRESETS[config.intensity];
    scanlineOpacity = preset.scanlineOpacity;
    vignetteOpacity = preset.vignetteOpacity;
    localStorage.setItem("tui_crt_intensity", config.intensity);
  }

  if (scanlineOpacity === undefined) {
    scanlineOpacity = GLOBAL_CRT_CONFIG.scanlineOpacity;
    vignetteOpacity = GLOBAL_CRT_CONFIG.vignetteOpacity;
  }

  const overlay = document.getElementById("crt-overlay-layer");
  const indicator = document.getElementById("crt-indicator");

  if (enabled && scanlineOpacity > 0) {
    root.style.setProperty("--scanline-opacity", String(scanlineOpacity));
    root.style.setProperty("--vignette-opacity", String(vignetteOpacity));
    if (overlay) overlay.classList.remove("hidden");
    if (indicator) indicator.className = "w-2 h-2 rounded-full bg-emerald-400";
  } else {
    root.style.setProperty("--scanline-opacity", "0");
    root.style.setProperty("--vignette-opacity", "0");
    if (overlay) overlay.classList.add("hidden");
    if (indicator) indicator.className = "w-2 h-2 rounded-full bg-red-500";
  }
}
