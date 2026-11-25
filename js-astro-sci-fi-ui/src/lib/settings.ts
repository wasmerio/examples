import { configureSound, playConfirmSound } from "./sound";

export type ThemeId = "default" | "nebula" | "ember" | "matrix" | "void";

export type AppearanceId = "default" | "high-contrast" | "light";

export type SfSettings = {
  theme: ThemeId;
  appearance: AppearanceId;
  soundEnabled: boolean;
  soundVolume: number;
  scanlines: boolean;
  grain: boolean;
  vignette: boolean;
  animations: boolean;
};

const STORAGE_KEY = "sf:settings";
/** Legacy key from pre-settings demo — migrated once. */
const LEGACY_THEME_KEY = "sf-theme";

export const defaultSettings: SfSettings = {
  theme: "default",
  appearance: "default",
  soundEnabled: false,
  soundVolume: 0.25,
  scanlines: true,
  grain: true,
  vignette: true,
  animations: true,
};

export const SETTINGS_CHANGED = "sf-settings-changed";

function parseTheme(v: string | undefined): ThemeId {
  if (v === "nebula" || v === "ember" || v === "matrix" || v === "void" || v === "default") return v;
  return "default";
}

function parseAppearance(v: string | undefined): AppearanceId {
  if (v === "high-contrast" || v === "light" || v === "default") return v;
  return "default";
}

export function loadSettings(): SfSettings {
  if (typeof window === "undefined") return { ...defaultSettings };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SfSettings>;
      return {
        ...defaultSettings,
        ...parsed,
        theme: parseTheme(parsed.theme),
        appearance: parseAppearance(parsed.appearance),
      };
    }
  } catch {
    /* ignore */
  }

  const legacy = localStorage.getItem(LEGACY_THEME_KEY);
  const migrated: SfSettings = {
    ...defaultSettings,
    theme: parseTheme(legacy ?? "default"),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    localStorage.removeItem(LEGACY_THEME_KEY);
  } catch {
    /* ignore */
  }
  return migrated;
}

export function saveSettings(partial: Partial<SfSettings>): SfSettings {
  const next = { ...loadSettings(), ...partial };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  applySettings(next);
  window.dispatchEvent(new CustomEvent(SETTINGS_CHANGED, { detail: next }));
  return next;
}

export function applySettings(s: SfSettings): void {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  if (s.theme === "default") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", s.theme);

  if (s.appearance === "default") root.removeAttribute("data-sf-appearance");
  else root.setAttribute("data-sf-appearance", s.appearance);

  root.setAttribute("data-sf-scanlines", s.scanlines ? "on" : "off");
  root.setAttribute("data-sf-grain", s.grain ? "on" : "off");
  root.setAttribute("data-sf-vignette", s.vignette ? "on" : "off");
  root.setAttribute("data-sf-animations", s.animations ? "on" : "off");

  configureSound({
    enabled: s.soundEnabled,
    volume: Math.min(1, Math.max(0, s.soundVolume)),
  });
}

function setThemeChoicePressed(theme: ThemeId): void {
  document.querySelectorAll("[data-theme-choice]").forEach((el) => {
    const id = (el as HTMLElement).dataset.themeChoice ?? "default";
    const active = id === theme;
    el.setAttribute("aria-pressed", active ? "true" : "false");
    el.classList.toggle("ring-2", active);
    el.classList.toggle("ring-[var(--sf-color-primary)]", active);
  });
}

function setAppearanceChoicePressed(appearance: AppearanceId): void {
  document.querySelectorAll("[data-appearance-choice]").forEach((el) => {
    const id = parseAppearance((el as HTMLElement).dataset.appearanceChoice);
    const active = id === appearance;
    el.setAttribute("aria-pressed", active ? "true" : "false");
    el.classList.toggle("ring-2", active);
    el.classList.toggle("ring-[var(--sf-color-primary)]", active);
  });
}

export function syncSettingsForm(): void {
  const s = loadSettings();

  const sound = document.getElementById("sf-settings-sound");
  if (sound instanceof HTMLInputElement) sound.checked = s.soundEnabled;

  const vol = document.getElementById("sf-settings-volume");
  if (vol instanceof HTMLInputElement) {
    vol.value = String(Math.round(s.soundVolume * 100));
    vol.disabled = !s.soundEnabled;
  }

  const scan = document.getElementById("sf-settings-scanlines");
  if (scan instanceof HTMLInputElement) scan.checked = s.scanlines;

  const grain = document.getElementById("sf-settings-grain");
  if (grain instanceof HTMLInputElement) grain.checked = s.grain;

  const vig = document.getElementById("sf-settings-vignette");
  if (vig instanceof HTMLInputElement) vig.checked = s.vignette;

  const anim = document.getElementById("sf-settings-animations");
  if (anim instanceof HTMLInputElement) anim.checked = s.animations;

  setThemeChoicePressed(s.theme);
  setAppearanceChoicePressed(s.appearance);
}

/** Attach listeners to demo settings controls (optional DOM). */
export function wireSettingsUi(): void {
  syncSettingsForm();

  document.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement | null)?.closest?.("[data-theme-choice]");
    if (!btn || !(btn instanceof HTMLElement)) return;
    e.preventDefault();
    const id = parseTheme(btn.dataset.themeChoice);
    saveSettings({ theme: id });
    syncSettingsForm();
  });

  document.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement | null)?.closest?.("[data-appearance-choice]");
    if (!btn || !(btn instanceof HTMLElement)) return;
    e.preventDefault();
    const id = parseAppearance(btn.dataset.appearanceChoice);
    saveSettings({ appearance: id });
    syncSettingsForm();
  });

  const sound = document.getElementById("sf-settings-sound");
  if (sound instanceof HTMLInputElement) {
    sound.addEventListener("change", () => {
      saveSettings({ soundEnabled: sound.checked });
      syncSettingsForm();
    });
  }

  const vol = document.getElementById("sf-settings-volume");
  if (vol instanceof HTMLInputElement) {
    vol.addEventListener("input", () => {
      const v = Number(vol.value) / 100;
      saveSettings({ soundVolume: v });
    });
  }

  for (const [id, key] of [
    ["sf-settings-scanlines", "scanlines"],
    ["sf-settings-grain", "grain"],
    ["sf-settings-vignette", "vignette"],
    ["sf-settings-animations", "animations"],
  ] as const) {
    const el = document.getElementById(id);
    if (el instanceof HTMLInputElement) {
      el.addEventListener("change", () => {
        saveSettings({ [key]: el.checked } as Partial<SfSettings>);
      });
    }
  }

  const test = document.getElementById("sf-settings-test-sound");
  if (test) {
    test.addEventListener("click", () => {
      void playConfirmSound();
    });
  }

  window.addEventListener(SETTINGS_CHANGED, () => syncSettingsForm());
}
