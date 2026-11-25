<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Astro Scifi-UI](https://github.com/jonnysmillie/astro-sci-fi-ui) Astro theme by jonnysmillie, copied from commit `1a529d5f8cb558b1ad6ab08f163ba541bab35b8a` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-sci-fi-ui.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - None. The theme builds as published.
- **Environment variables:** None.
- **Credit:** theme by [jonnysmillie](https://github.com/jonnysmillie), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Sci‑Fi UI (Astro)

**Sci‑Fi UI** is an **Astro-first** interface kit for cockpit-style layouts: composable **frames and panels**, **HUD** primitives (corners, reticle, status bars, tickers), a **terminal** stack, and a passive **radar** — all biased toward **static HTML and CSS**, with **Tailwind v4** and shared **design tokens** (themes, glow, scanlines, optional sound). A thin **shell** (`AppShell`, `AppNav`) ties pages together with vignette, grain, and global **settings** persisted in the browser. **React** shows up only where it pays off: **charts** (uPlot), a **MapLibre** tactical map, **Framer Motion** for a few borders, and an optional **TensorFlow.js** panel on the intel route — each gated by env flags so you can ship a lighter fork without ripping out the whole demo.

**License:** [MIT](LICENSE) · **Contributing:** [CONTRIBUTING.md](CONTRIBUTING.md) · **Changelog:** [CHANGELOG.md](CHANGELOG.md)

## Docs

- [docs/architecture.md](docs/architecture.md) — layout and layers  
- [docs/components.md](docs/components.md) — component props  
- [docs/tokens-and-settings.md](docs/tokens-and-settings.md) — CSS variables and `sf:settings`  
- [docs/third-party.md](docs/third-party.md) — tiles, embeds, fonts — legal / privacy notes  

## Optional env flags

See [`.env.example`](.env.example). Set **`PUBLIC_FEATURE_INTEL_ML=false`** to drop COCO-SSD on `/intel`, or **`PUBLIC_FEATURE_MAP=false`** for a map placeholder without MapLibre.

## Stack

Astro 6, Tailwind v4 (`@tailwindcss/vite`), React where needed (uPlot, MapLibre, Framer Motion, TensorFlow.js on `/intel`).

## Routes

| Path | What it is |
|------|------------|
| `/` | Landing page |
| `/components` | Component documentation (nav + preview + snippets per primitive) |
| `/kit` | Component showcase (panels, HUD, radar, terminal) |
| `/settings` | Global shell preferences (theme, overlays, motion, sound) |
| `/dashboard` | uPlot charts + Open-Meteo sample |
| `/map` | MapLibre tactical map (env can disable) |
| `/intel` | YouTube embed + optional local COCO-SSD (env can disable ML block) |

## Layout (src)

`components/` — `core`, `effects`, `hud`, `terminal`, `radar`, `shell` (AppShell, AppNav), `charts`, `map`, `intel` · `layouts/` (ScifiLayout) · `lib/` · `styles/` · `plugins/` · `pages/` · `scripts/` · `data/`

Pages use [`AppShell`](src/components/shell/AppShell.astro) (background, vignette, scanlines) and [`AppNav`](src/components/shell/AppNav.astro). Pass `narrow` to `AppShell` for a centered max-width column.

## Usage

```astro
---
import ScifiLayout from "../layouts/ScifiLayout.astro";
import AppShell from "../components/shell/AppShell.astro";
import AppNav from "../components/shell/AppNav.astro";
import Panel from "../components/core/Panel.astro";
---

<ScifiLayout title="My HUD">
  <AppShell>
    <AppNav />
    <Panel variant="primary" glow>…</Panel>
  </AppShell>
</ScifiLayout>
```

**Sound:** wired from [`boot.ts`](src/scripts/boot.ts) via `AppShell`. Use `data-sf-sound-hover` / `data-sf-sound-click`, or `sound` on [`Button.astro`](src/components/core/Button.astro). Settings live under `sf:settings` in `localStorage` — see [`src/lib/settings.ts`](src/lib/settings.ts).

**Themes:** Default (no attribute) is **synthwave** cyan / magenta on violet-black. Optional `data-theme`: `nebula` (older cyan/violet look), `ember`, `matrix`, `void` — see [`tokens.css`](src/styles/tokens.css). **Appearance:** `data-sf-appearance` — `high-contrast`, `light`.

**Map tiles:** demo uses public raster endpoints; ship your own tiles or a paid plan and follow each provider’s terms (e.g. [OSM tile policy](https://operations.osmfoundation.org/policies/tiles/)).

**Intel:** webcam / file runs in-browser; YouTube iframes are not script-readable for CV.

## Commands

| Command | Action |
|---------|--------|
| `npm install` | Dependencies |
| `npm run dev` | Dev server (`:4321`) |
| `npm run build` | Production build |
| `npm run preview` | Preview build |

**Node ≥ 22.23.4** (Astro 6, and the October 21, 2026 Node.js security releases).
