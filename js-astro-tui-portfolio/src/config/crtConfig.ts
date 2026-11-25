export type CRTIntensityLevel = "low" | "medium" | "high" | "ultra";

export interface CRTConfig {
  enabled: boolean;
  intensity: CRTIntensityLevel;
  scanlineOpacity: number; // 0.0 to 1.0
  vignetteOpacity: number;  // 0.0 to 1.0
}

export const CRT_PRESETS: Record<CRTIntensityLevel, { scanlineOpacity: number; vignetteOpacity: number; label: string }> = {
  low: { scanlineOpacity: 0.10, vignetteOpacity: 0.35, label: "LOW (Subtle Scanlines)" },
  medium: { scanlineOpacity: 0.22, vignetteOpacity: 0.65, label: "MEDIUM (Balanced CRT)" },
  high: { scanlineOpacity: 0.40, vignetteOpacity: 0.85, label: "HIGH (Classic Arcade CRT)" },
  ultra: { scanlineOpacity: 0.65, vignetteOpacity: 0.98, label: "ULTRA (Heavy Phosphor Glare)" },
};

export const DEFAULT_CRT_CONFIG: CRTConfig = {
  enabled: true,
  intensity: "medium",
  scanlineOpacity: 0.22,
  vignetteOpacity: 0.65,
};

/**
 * Apply CRT filter settings, intensity presets, and opacity values dynamically
 */
export function applyCRTConfig(config: Partial<CRTConfig>) {
  const root = document.documentElement;
  const isMobile = window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (config.enabled !== undefined && !isMobile) {
    localStorage.setItem("tui_crt", String(config.enabled));
  }

  const enabled = isMobile ? false : (config.enabled !== undefined ? config.enabled : localStorage.getItem("tui_crt") !== "false");

  let scanlineOpacity = config.scanlineOpacity;
  let vignetteOpacity = config.vignetteOpacity;

  if (config.intensity && CRT_PRESETS[config.intensity]) {
    const preset = CRT_PRESETS[config.intensity];
    scanlineOpacity = preset.scanlineOpacity;
    vignetteOpacity = preset.vignetteOpacity;
    localStorage.setItem("tui_crt_intensity", config.intensity);
  }

  if (scanlineOpacity === undefined) {
    const savedIntensity = (localStorage.getItem("tui_crt_intensity") as CRTIntensityLevel) || "medium";
    scanlineOpacity = CRT_PRESETS[savedIntensity]?.scanlineOpacity ?? DEFAULT_CRT_CONFIG.scanlineOpacity;
    vignetteOpacity = CRT_PRESETS[savedIntensity]?.vignetteOpacity ?? DEFAULT_CRT_CONFIG.vignetteOpacity;
  }

  if (enabled && !isMobile) {
    root.style.setProperty("--scanline-opacity", String(scanlineOpacity));
    root.style.setProperty("--vignette-opacity", String(vignetteOpacity ?? 0.65));
    document.getElementById("crt-overlay-layer")?.classList.remove("hidden");
  } else {
    root.style.setProperty("--scanline-opacity", "0");
    root.style.setProperty("--vignette-opacity", "0");
    document.getElementById("crt-overlay-layer")?.classList.add("hidden");
  }

  const indicator = document.getElementById("crt-indicator");
  if (indicator) {
    indicator.className = enabled
      ? "w-2 h-2 rounded-full bg-emerald-400"
      : "w-2 h-2 rounded-full bg-red-500";
  }
}
