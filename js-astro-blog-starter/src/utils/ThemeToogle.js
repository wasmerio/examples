export const theme = (() => {
  if (typeof localStorage !== "undefined" && localStorage.getItem("theme")) {
    return localStorage.getItem("theme");
  }
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
})();

if (theme === "light") {
  document.documentElement.classList.remove("dark");
} else {
  document.documentElement.classList.add("dark");
}

window.localStorage.setItem("theme", theme);

const handleToggleClick = () => {
  const element = document.documentElement;
  const isDark = element.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");

  // Custom event
  const event = new CustomEvent("themeChange", { detail: { isDark } });
  window.dispatchEvent(event);
};

document
  .getElementById("themeToggle")
  .addEventListener("click", handleToggleClick);
