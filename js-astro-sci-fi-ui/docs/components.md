# Component props (kit)

**Interactive catalog:** minimal live previews and copy-ready snippets live at **`/components`** in the app (data: `src/data/component-docs.ts`). This file keeps the detailed **props** tables.

Astro components live under `src/components/`. Below are the main **props** (TypeScript interfaces) adopters care about.

## Core

### `Frame.astro`

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `variant` | `"primary"` \| `"secondary"` | `"primary"` | Accent color for frame stroke. |
| `glow` | boolean | `false` | Glow filter on frame path. |
| `animated` | boolean | `false` | Subtle border shimmer animation. |
| `edges` | `"angled"` \| `"square"` | `"angled"` | Angled SVG corners vs rectangular border. |
| `class` | string | — | Extra classes on the wrapper. |

**Angled frame + rectangular children:** the slot is a full rectangle, so opaque square panels can cover the chamfered SVG in the corners. Wrap inner content with **`sf-frame-content-inset`** (see `src/styles/utilities.css`) or add your own padding so the stroke stays visible — or use `edges="square"` when the child must be edge-to-edge.

### `Panel.astro`

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `variant` | `"primary"` \| `"secondary"` | `"primary"` | Passed through to `Frame`. |
| `glow` | boolean | `false` | Passed to `Frame`. |
| `animated` | boolean | `false` | Passed to `Frame`. |
| `layer` | `"base"` \| `"raised"` | `"base"` | Shadow / lift on inner panel. |
| `glass` | boolean | `false` | Frosted “glass” panel treatment. |
| `class` | string | — | On outer `Frame`. |

### `Text.astro`

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `variant` | `"heading"` \| `"label"` \| `"data"` | `"data"` | Typography preset. |
| `as` | `"h1"` \| `"h2"` \| `"h3"` \| `"p"` \| `"span"` | auto from variant | HTML element. |
| `glow` | boolean | `false` | Soft primary/secondary text glow. |
| `class` | string | — | Merged into element classes. |

### `Button.astro`

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `variant` | `"primary"` \| `"secondary"` \| `"ghost"` | `"primary"` | Visual style. |
| `type` | `"button"` \| `"submit"` \| `"reset"` | `"button"` | Native button type. |
| `sound` | boolean | `true` | Adds `data-sf-sound-hover` / `data-sf-sound-click` when shell sound binding is active. |
| `animatedBorder` | boolean | `false` | Animated border treatment. |
| `id` | string | — | DOM id. |
| `class` | string | — | Extra classes. |

## Shell

### `AppShell.astro`

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `narrow` | boolean | `false` | When `true`, constrains main content width for text-heavy pages. |

`AppNav.astro` has no props; it derives the active link from `Astro.url.pathname`.

## HUD (representative)

### `HudMount.astro`

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `fixed` | boolean | `false` | `fixed` vs `absolute` fullscreen overlay mount. |
| `class` | string | — | Wrapper classes. |

### `HudBar.astro`

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `position` | `"top"` \| `"bottom"` | `"top"` | Strip orientation. |
| `fixed` | boolean | `false` | Pin to viewport. |
| `mode` | `"overlay"` \| `"inline"` | `"overlay"` | Absolute strip vs flow layout. |
| `variant` | `"primary"` \| `"secondary"` | `"primary"` | Accent. |
| `class` | string | — | Wrapper classes. |

### `HudReadout.astro`

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `align` | `"left"` \| `"right"` | `"left"` | Text alignment / `ml-auto` for right. |
| `class` | string | — | Wrapper classes. |

Slots: `label` (named), default slot for value.

### `HudTicker.astro`

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `durationSec` | number | `22` | Marquee loop duration (seconds). |
| `class` | string | — | Wrapper classes. |

Decorative: `aria-hidden="true"` on the root.

### `HudCorners.astro`, `HudReticle.astro`, `HudFrame.astro`

See each file’s `interface Props` for size/color/class options — they are primarily presentational overlays.

## Effects

- **`Glow.astro`**, **`Scanlines.astro`**: layout wrappers; check files for `class` passthrough.
- **`AnimatedBorder.jsx`**: Framer Motion conic-gradient border (`p-[2px]` ring, large rotating `-inset-[55%]` layer). Pass `className` for spacing. Inside an angled `Frame`, pair with **`sf-frame-content-inset`** so the plate does not cover the frame chamfers.

## Terminal & radar

- **`Terminal.astro`**, **`TerminalLine.astro`**, **`TerminalPrompt.astro`**: composition components; optional `class` on `Terminal.astro`.
- **`Radar.astro`**: optional props for labels / sizing — see source.

## React islands

- **`DashboardCharts.tsx`**: `snapshot` (JSON shape from `dashboard-snapshot.json`); optional `initialCityId` (preset id from `src/lib/map-cities.ts`, same list as the map). Hourly weather is loaded **from Open-Meteo in the browser** (per preset coordinates) so static sites get correct per-city data; the snapshot is only a fallback when the network request fails. (`/api/meteo.json` remains available for build-time or server use.)
- **`TacticalMap.tsx`**: `initialCityId`, `class`, etc. — see component.
- **`IntelObjectDetector.tsx`**: no external props; self-contained UI when ML feature is enabled.
