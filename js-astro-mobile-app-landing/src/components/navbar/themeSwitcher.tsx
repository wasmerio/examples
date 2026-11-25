import { useContext, useEffect, useState } from "react";
import { ConfigContext } from "../../utils/configContext";

function ThemeSwitcher() {
  const config = useContext(ConfigContext);
  const [mode, setMode] = useState<string>();

  useEffect(() => {
    function getPreferredColorScheme() {
      if (!window.matchMedia) {
        return;
      }
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    }
    const theme = localStorage.getItem("theme") ?? getPreferredColorScheme();
    if (!theme) return;
    setMode(theme);
  }, []);

  return (
    <label className="flex cursor-pointer gap-2 items-center mr-4 md:mr-0">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
      </svg>
      <input
        type="checkbox"
        autoComplete="off"
        checked={mode === "dark"}
        className="toggle toggle-sm"
        onChange={(event) => {
          let mode: string | undefined;
          if (event.currentTarget.checked) {
            mode = "dark";
          } else {
            mode = config?.theme;
          }
          if (!mode) return;
          document.documentElement.setAttribute("data-theme", mode);
          localStorage.setItem("theme", mode);
          setMode(mode);
        }}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </label>
  );
}

export default ThemeSwitcher;
