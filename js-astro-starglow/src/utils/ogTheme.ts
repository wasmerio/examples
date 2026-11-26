// OG image colors. satori cannot read CSS variables, so the images take the
// configured dark palette (appearance.palette.dark) straight from the config.
import config from "@/config";

const { palette, palettes } = config.appearance;
const dark = palettes.dark[palette.dark]!;

export const ogColors = {
  background: dark.bg,
  accent: dark.accent,
  foreground: dark.fg,
  mutedForeground: dark.mutedFg,
  border: dark.border,
} as const;
