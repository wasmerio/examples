import Cog8Tooth from "@heroicons/react/24/solid/Cog8ToothIcon";

const themes = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
  "dim",
  "nord",
  "sunset",
] as [string, ...string[]];

function ThemeSelector() {
  return (
    <div className="drawer z-10">
      <input id="theme-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <label
          htmlFor="theme-drawer"
          className="fixed z-[1] right-0 top-1/2 btn btn-primary drawer-button flex"
        >
          <Cog8Tooth className="w-4" />
          <span>Themes</span>
        </label>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="theme-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        />
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 gap-2">
          {themes.map((theme) => (
            <li key={theme}>
              <button
                key={theme}
                className="btn btn-info"
                onClick={() => {
                  const doc = document.querySelector("html");
                  doc?.setAttribute("data-theme", theme);
                }}
              >
                {theme}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ThemeSelector;
