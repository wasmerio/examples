type Theme = "light" | "dark";
let themeTransitionFrame: number | undefined;

function getInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* Allow theme switching when browser storage is blocked. */
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}
function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const dark = theme === "dark";
  if (root.classList.contains("dark") === dark) return;

  if (themeTransitionFrame !== undefined) {
    cancelAnimationFrame(themeTransitionFrame);
  }

  // Commit every theme color in one frame, regardless of component transitions.
  root.setAttribute("data-theme-changing", "");
  void root.offsetWidth;
  root.classList.toggle("dark", dark);
  void root.offsetWidth;

  // Allow reactive theme updates to render before restoring hover transitions.
  themeTransitionFrame = requestAnimationFrame(() => {
    themeTransitionFrame = requestAnimationFrame(() => {
      root.removeAttribute("data-theme-changing");
      themeTransitionFrame = undefined;
    });
  });
}
function initTheme() {
  const theme = getInitialTheme();
  applyTheme(theme);
  return theme;
}
function toggleTheme(): Theme {
  const theme = getCurrentTheme() === "dark" ? "light" : "dark";
  try {
    localStorage.setItem("theme", theme);
  } catch {
    /* Apply the theme on this page even if saving fails. */
  }
  applyTheme(theme);
  return theme;
}
function getCurrentTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}
export { initTheme, toggleTheme, getCurrentTheme, applyTheme };
