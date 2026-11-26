// `cssVariable` values must match the tokens CSS reads (`--font-body`, `--font-headings`,
// `--font-mono`). Variable fonts take a weight range string such as `"100 900"`.
import { fontProviders } from "astro/config";

export const siteFonts = [
  {
    name: "Instrument Sans",
    cssVariable: "--font-body",
    provider: fontProviders.fontsource(),
    weights: ["400 700"],
    styles: ["normal"],
    subsets: ["latin"],
  },
  {
    name: "Instrument Sans",
    cssVariable: "--font-headings",
    provider: fontProviders.fontsource(),
    weights: ["400 700"],
    styles: ["normal"],
    subsets: ["latin"],
  },
  {
    name: "JetBrains Mono",
    cssVariable: "--font-mono",
    provider: fontProviders.fontsource(),
    weights: ["400 600"],
    styles: ["normal"],
    subsets: ["latin"],
    fallbacks: [
      "ui-monospace",
      "SFMono-Regular",
      "Menlo",
      "Consolas",
      "Liberation Mono",
      "DejaVu Sans Mono",
      "monospace",
    ],
    optimizedFallbacks: false,
  },
];
