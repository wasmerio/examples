/** CSS animation / transition tokens for sci-fi UI (no runtime dependency). */
export const SF_DURATION = {
  fast: "150ms",
  normal: "280ms",
  slow: "480ms",
} as const;

export const SF_EASING = {
  out: "cubic-bezier(0.16, 1, 0.3, 1)",
  inOut: "cubic-bezier(0.65, 0, 0.35, 1)",
} as const;

/** Class names matching `src/styles/utilities.css` keyframes. */
export const SF_ANIMATION_CLASS = {
  glowPulse: "sf-frame--animated",
  scanDrift: "sf-scanlines--animated",
} as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
