// SPDX-License-Identifier: MIT

export function initToggles() {
  const themeBtn = document.getElementById("themeBtn");

  function applyTheme(theme) {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }

  function getTheme() {
    return localStorage.getItem("theme") || "light";
  }

  applyTheme(getTheme());

  themeBtn?.addEventListener("click", () => {
    const isDark = document.documentElement.classList.contains("dark");
    applyTheme(isDark ? "light" : "dark");
  });
}

if (typeof window !== "undefined") {
  window.initToggles = initToggles;
}
