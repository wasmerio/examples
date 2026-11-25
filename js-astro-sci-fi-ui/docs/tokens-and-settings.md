# Design tokens and settings

## `localStorage` key: `sf:settings`

Settings are stored as JSON under **`sf:settings`**. A legacy key `sf-theme` is migrated once on read (see `src/lib/settings.ts`).

| Field | Type | Default | Effect |
| ----- | ---- | ------- | ------ |
| `theme` | `"default"` \| `"nebula"` \| `"ember"` \| `"matrix"` \| `"void"` | `"default"` | Sets `data-theme` on `<html>` when not `default`. |
| `appearance` | `"default"` \| `"high-contrast"` \| `"light"` | `"default"` | Sets `data-sf-appearance` on `<html>` when not `default`. |
| `soundEnabled` | boolean | `false` | Enables delegated UI sounds. |
| `soundVolume` | number (0–1) | `0.25` | Web Audio gain for UI sounds. |
| `scanlines` | boolean | `true` | `data-sf-scanlines` on `<html>` (`on` / `off`). |
| `grain` | boolean | `true` | `data-sf-grain` — noise overlay visibility. |
| `vignette` | boolean | `true` | `data-sf-vignette` — edge darkening. |
| `animations` | boolean | `true` | `data-sf-animations` — disables many CSS motion paths when `off`. |

The root layout runs a small **inline script** before paint to apply the above from `localStorage`, reducing flash of wrong theme.

HTML attributes mirror persisted UI (also used by CSS):

| Attribute | Values | Meaning |
| --------- | ------ | ------- |
| `data-theme` | `nebula`, `ember`, `matrix`, `void` | Accent theme (omitted when `default` = synthwave palette). |
| `data-sf-appearance` | `high-contrast`, `light` | Shell appearance preset (omitted when `default`). |
| `data-sf-scanlines` | `on` / `off` | Scanlines overlay. |
| `data-sf-grain` | `on` / `off` | Film grain. |
| `data-sf-vignette` | `on` / `off` | Vignette. |
| `data-sf-animations` | `on` / `off` | Decorative motion (frames, radar, ticker, intel feed pulse, etc.). |

## CSS custom properties (core)

Defined in `src/styles/tokens.css` (and overridden by `[data-theme]` / `[data-sf-appearance]`).

| Token | Typical use |
| ----- | ----------- |
| `--sf-color-primary` | Accents, borders, glows |
| `--sf-color-secondary` | Secondary accents |
| `--sf-bg-deep` | Page background |
| `--sf-bg-elevated` | Raised surfaces |
| `--sf-bg-panel` / `--sf-bg-panel-solid` | Panels |
| `--sf-glow-primary` / `--sf-glow-secondary` | Shadows / text glow |
| `--sf-border-subtle` / `--sf-border-strong` | Borders |
| `--sf-text-primary` / `--sf-text-muted` / `--sf-text-dim` | Text hierarchy |
| `--sf-corner-size`, `--sf-frame-thickness` | Frame SVG geometry |
| `--font-sf-display`, `--font-sf-mono` | Typography |
| `--sf-scanline-opacity`, `--sf-hud-grain-opacity` | Overlay strength |

Tailwind theme aliases (`--color-sf-*`) are mapped in `src/styles/global.css` for utility classes like `text-sf-muted`.
