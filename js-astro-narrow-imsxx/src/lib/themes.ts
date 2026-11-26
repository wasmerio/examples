/**
 * Built-in color schemes. Mirrors upstream data/themes.yaml.
 * Each key must have a matching [data-theme="key"] block in styles/themes.css.
 */
export type ColorScheme = {
  key: string
  name: string
  order: number
}

export const colorSchemes: ColorScheme[] = [
  { key: "default", name: "Default", order: 1 },
  { key: "claude", name: "Claude", order: 2 },
  { key: "bumblebee", name: "Bumblebee", order: 3 },
  { key: "emerald", name: "Emerald", order: 4 },
  { key: "nord", name: "Nord", order: 5 },
  { key: "sunset", name: "Sunset", order: 6 },
  { key: "abyss", name: "Abyss", order: 7 },
  { key: "dracula", name: "Dracula", order: 8 },
  { key: "amethyst", name: "Amethyst", order: 9 },
  { key: "slate", name: "Slate", order: 10 },
  { key: "x", name: "X", order: 11 },
  { key: "minimal", name: "Minimal", order: 12 },
]

export const colorSchemeKeys = colorSchemes.map((scheme) => scheme.key)
