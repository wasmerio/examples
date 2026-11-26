# Customising starglow

Most changes need no theme code at all: the config file covers the switches, and three slot files cover your own markup. This guide covers what to edit when you want more.

## Slot files

`src/custom/` holds three components that the theme renders but never changes after a release. Put your own markup there, and theme updates will not conflict with it.

| File                       | Rendered                                          | Typical use                                |
| :------------------------- | :------------------------------------------------ | :----------------------------------------- |
| `src/custom/Head.astro`    | In `<head>` on every page, after the theme's tags | Analytics, verification tags, stylesheets  |
| `src/custom/BodyEnd.astro` | Right before `</body>` on every page              | Scripts and widgets                        |
| `src/custom/PostEnd.astro` | On post pages, before the previous and next links | Comments, a newsletter form, an author bio |

`Head.astro` receives the page `title` and `description`, and `PostEnd.astro` receives the `post` entry, so you can skip some posts:

```astro
---
import type { CollectionEntry } from "astro:content";
type Props = { post: CollectionEntry<"posts"> };
const { post } = Astro.props;
---

{!post.data.tags.includes("no-comments") && <section>Comments go here</section>}
```

## Colours

Colours come in palettes, and dark and light palettes are chosen separately in `starglow.config.ts`:

```ts
appearance: {
  palette: { dark: "aurora", light: "paper" },
},
```

Built in are four dark palettes, `starglow` (the default), `void`, `aurora` and `ember`, and five light ones, `starglow`, `paper`, `petal`, `frost` and `sand`. The demo's preview panel, bottom right, switches between them live.

To use your own colours, add a palette under `appearance.palettes` and select it. A palette is 18 colours; everything else (code highlighting, callouts, status colours, badges, social images) is derived from them:

```ts
appearance: {
  palette: { dark: "midnight", light: "paper" },
  palettes: {
    dark: {
      midnight: {
        label: "Midnight",
        bg: "#0f1117", mantle: "#0b0d12", crust: "#08090d",
        muted: "#1a1d26", border: "#2a2f3c",
        fg: "#dde3ee", mutedFg: "#9aa3b5",
        accent: "#7cc4ff", accentFg: "#0f1117", comment: "#8089a0",
        red: "#ff8080", orange: "#ffb070", yellow: "#f0d070",
        green: "#80d890", cyan: "#70d0e0", blue: "#80a8ff",
        purple: "#c0a0ff", glow: "#7cc4ff",
      },
    },
  },
},
```

The fields are documented in `src/palettes.ts`, next to the built-in palettes. `pnpm verify` checks that every shipped palette meets WCAG AA: each text colour on each surface, and the accent foreground on the accent.

## Type and spacing

The theme uses a short type scale and two weights, 400 and 600. The sizes are defined once in `site-theme.css`, and `pnpm verify` rejects any other size or weight in the built CSS. That check is deliberate: it keeps a customised site from slowly collecting one-off sizes. Add a size to the scale and to the check together if you need one.

## Fonts

Three self-hosted fonts are loaded through the Astro fonts API in `astro.config.ts`:

- **Inter** for reading text.
- **JetBrains Mono** for code and data such as dates and paths.
- **Pixelify Sans** for the header wordmark only.

The font files and their SIL Open Font License texts are in `src/assets/fonts/`. To swap a font, replace the files and the matching entry in the `fonts` list. The CSS reads them through `--font-inter`, `--font-jetbrains-mono` and `--font-wordmark`.

## Checking your changes

Run the full check set before you publish:

```bash
./dev.sh ci
```

It runs the formatter check, the linter, `astro check`, the build, an offline link check, `pnpm verify` on the built site and the placeholder check. `pnpm verify` covers things like canonical links, heading order, the search index, structured data and the type scale.
