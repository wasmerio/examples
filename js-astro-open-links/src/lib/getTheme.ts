import { themes } from "../../themes.ts";

export function getTheme(themeName: string) {
  return themes[themeName as keyof typeof themes] || themes.default;
}