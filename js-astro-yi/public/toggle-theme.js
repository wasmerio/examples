const primaryColorScheme = ""; // "light" | "dark"

// Get theme data from local storage
const currentTheme = localStorage.getItem("theme");

function getPreferTheme() {
  // return theme value in local storage if it is set
  if (currentTheme) return currentTheme;

  // return primary color scheme if it is set
  if (primaryColorScheme) return primaryColorScheme;

  // return user device's prefer color scheme
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

let themeValue = getPreferTheme();

function setPreference() {
  localStorage.setItem("theme", themeValue);
  reflectPreference();
}

function reflectPreference() {
  document.firstElementChild.setAttribute("data-theme", themeValue);
  document.querySelector("#theme-btn")?.setAttribute("aria-label", themeValue);
  document.querySelector("#theme-btn-mobile")?.setAttribute("aria-label", themeValue);
}

// set early so no page flashes / CSS is made aware
reflectPreference();

// The toggle button is re-created on every ClientRouter (View Transitions)
// navigation, so a listener bound directly to #theme-btn is lost after the
// first page. Bind once to `document` — which is never swapped — via event
// delegation, and refresh the button's aria-label on each page load.
// The guard keeps this idempotent if the inline script ever re-executes.
if (!window.__themeToggleBound) {
  window.__themeToggleBound = true;

  document.addEventListener("click", (event) => {
    if (!event.target.closest("#theme-btn, #theme-btn-mobile")) return;
    themeValue = themeValue === "light" ? "dark" : "light";
    setPreference();
  });

  // re-apply aria-label to the freshly-swapped button after each navigation
  document.addEventListener("astro:page-load", reflectPreference);

  // sync with system changes
  window.matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", ({matches: isDark}) => {
      themeValue = isDark ? "dark" : "light";
      setPreference();
    });
}
