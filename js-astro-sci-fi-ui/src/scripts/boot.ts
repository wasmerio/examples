import { applySettings, loadSettings, wireSettingsUi } from "../lib/settings";
import { bindDelegatedSound } from "../lib/sound";

function reducedMotionHint(): void {
  const hint = document.getElementById("sf-reduced-motion-hint");
  if (hint && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    hint.textContent = "Reduced motion: on";
  }
}

function init(): void {
  applySettings(loadSettings());
  bindDelegatedSound();
  wireSettingsUi();
  reducedMotionHint();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
