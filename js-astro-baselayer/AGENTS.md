# AGENTS.md — Astro Dev Template (Vertex Holdings Dashboard)

## Project Identity
Astro 6 static site + Tailwind CSS v4 + Basecoat UI.
The agent acts as a senior frontend developer with strong design-system thinking.
Target: dark-mode investment/analytics dashboard built on a tight 6px/8px grid.

## Key Files
| Path | Purpose |
|------|---------|
| `DESIGN.md` | **Source of truth** for all design tokens — colors, spacing, typography, shadows, radii. Read before implementing ANY UI. |
| `src/styles/global.css` | Tailwind v4 theme (`@theme`) mapped 1:1 from DESIGN.md; Basecoat CSS import |
| `src/components/` | Reusable Astro components |
| `src/layouts/` | Page layouts (shared `<html>` shell) |
| `src/pages/` | Astro file-based routes |
| `src/content/` | Astro Content Collections (blog, data) |
| `astro.config.mjs` | Fonts config (Google: Inter + Newsreader via Astro Fonts API) |
| `public/` | Static assets (no transformation) |

## Tech Stack
- **Framework:** Astro 6 (static output)
- **Styling:** Tailwind CSS v4 (CSS-first `@theme` config)
- **UI Kit:** Basecoat CSS (shadcn/ui for HTML — `btn`, `card`, `input`, `badge`, `tabs`, etc.)
- **Fonts:** Inter (body), Newsreader (display) — loaded via `astro:assets` `<Font />`
- **Icons:** Solar (linear), Lucide (Basecoat's default)
- **Package manager:** npm

## Dev Environment
```bash
npm run dev      # astro dev (port 4321)
npm run build    # astro build + type check
npm run preview  # preview production build
```

## Code Style
- Components: **Astro** (`.astro`) with server-side frontmatter (`---`).
- Styling: **Tailwind utility classes** + **Basecoat component classes** (`btn`, `card`).
- Custom CSS: keep inside `global.css`; never write custom CSS in component `<style>` blocks.
- Naming: `PascalCase` for components, `kebab-case` for files.
- Images: always use `astro:assets` `<Image />` instead of `<img>`.
- Units: **Always use relative units** (`rem`, `em`, `%`, `vw`/`vh`) for sizing, spacing, typography, and layout. **Never use `px`** in CSS, Tailwind config, or `@theme` definitions — convert to `rem` (base 16px: e.g. 12px → 0.75rem, 14px → 0.875rem, 16px → 1rem, 24px → 1.5rem, 32px → 2rem, 48px → 3rem). This ensures proper scaling with user font-size preferences and accessibility.

## Tailwind / Design Tokens
All design tokens live in `DESIGN.md` and are wired into Tailwind via `src/styles/global.css` under `@theme`:

| DESIGN.md token | Tailwind class |
|-----------------|---------------|
| `display-lg` (48px / lh 1 / ls -0.025em) | `text-4xl` or `text-display-lg` |
| `body-md` (14px / lh 1.625) | `text-sm` or `text-body-md` |
| Primary `#437652` | `text-primary`, `bg-primary` |
| Secondary `#8DA696` | `text-secondary`, `bg-secondary` |
| Neutral `#142418` | `text-neutral`, `bg-neutral` |
| Surface shadow | `shadow-surface` |
| Inset depth | `shadow-inset-depth` |
| Hero shadow | `shadow-hero` |
| Radius: 12px / 16px / 32px | `rounded-sm` (12px), `rounded-md` (16px), `rounded-lg` (32px) |
| Spacing base 6px | `p-1` = 6px, `p-2` = 12px, `gap-md` = 8px, `gap-lg` = 16px, etc. |

> **Rule:** If a design token from DESIGN.md is missing in Tailwind, extend `@theme` in `global.css`. Never use arbitrary values like `w-[123px]`.

## Basecoat UI
Basecoat CSS is a **framework-agnostic HTML/CSS component library** ("shadcn/ui without React"). It provides semantic component classes layered on top of Tailwind.

### Installation
```bash
npm install basecoat-css
```

### Usage
In `src/styles/global.css`:
```css
@import "tailwindcss";
@import "basecoat-css";   /* Basecoat component styles */
```

In `.astro` components:
```html
<button class="btn btn-primary">Action</button>
<div class="card p-md">
  <h3 class="card-title">Title</h3>
  <p class="text-sm text-text-primary">Description</p>
</div>
```

### Theming Basecoat
Basecoat is compatible with **shadcn/ui themes**. To match DESIGN.md colors:
1. Go to https://ui.shadcn.com/themes and pick a green/teal theme close to `#437652`.
2. Copy the CSS variables block into a file (e.g. `src/styles/theme.css`).
3. Import it after `basecoat-css`:
   ```css
   @import "tailwindcss";
   @import "basecoat-css";
   @import "./theme.css";
   ```
4. Override variables to match DESIGN.md colors (Primary → `#437652`, etc.).

> **Override styles** using Tailwind utilities directly on elements (`class="btn font-light rounded-md"`) or extend in `global.css`. Tailwind utilities have higher specificity than Basecoat's `@layer components`.

### Interactive components
Some Basecoat components (Tabs, Dropdown, Modal) need a **tiny bit of vanilla JS**.
Import in layout or page:
```astro
<script src="node_modules/basecoat-css/dist/js/basecoat.min.js" defer></script>
<!-- + specific component script if needed -->
<script src="node_modules/basecoat-css/dist/js/dropdown-menu.min.js" defer></script>
```
Alternatively copy scripts to `public/js/` and load from there.

## Architecture
- **Layouts** wrap pages in `src/layouts/`.
- **Content Collections** define schema in `src/content.config.ts`; content lives in `src/content/`.
- All data fetching is static at build time.
- **Avoid** `client:*` directives unless strict interactivity is required (Basecoat JS handles most UI state).
- Astro's `<Font />` component injects Inter and Newsreader; reference them in Tailwind via `font-sans` and `font-serif`.

## Testing / QA
- Always run `npm run build` before declaring a task complete.
- Check `DESIGN.md` before implementing ANY UI element.
- Verify that your Tailwind classes map to DESIGN.md tokens (no arbitrary values).
- Ensure Basecoat theme variables align with DESIGN.md palette.

## Anti-patterns
- **NEVER** use `px` units — always use `rem` (or `em`/`%` where appropriate). Convert any `px` value to `rem` (÷16). Example: `12px` → `0.75rem`, `6px` → `0.375rem`.

- **NEVER** use arbitrary Tailwind values (`w-[123px]`, `text-[22px]`) — extend `@theme` or use existing tokens.
- **NEVER** write `<style>` blocks in Astro components — everything goes through Tailwind/Basecoat.
- **NEVER** skip `npm run build` before finishing.
- **NEVER** commit secrets; `.env` is gitignored, use `.env.example` for docs.
- **NEVER** use inline styles or `style=` attributes.
- Do NOT use React/Vue/Svelte components unless explicitly asked — this is a **static Astro + HTML** stack.

## Extended Context
- `DESIGN.md` — full design system spec (read before UI work)
- `AGENTS.md.spec.md` — comprehensive AGENTS.md specification used as reference for this file
