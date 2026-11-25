# Use shadcn/ui Tokens and Components

AstroWind ships the CSS variables shadcn/ui components rely on, derived from the theme in `src/components/CustomStyles.astro`. File: `src/assets/styles/shadcn.css` (imported by `src/assets/styles/tailwind.css`).

## What already works

Utilities such as `bg-background`, `text-foreground`, `bg-card`, `text-card-foreground`, `bg-popover`, `border-border`, `border-input`, `ring-ring`, `text-muted-foreground`, `bg-destructive`, `text-primary-foreground`, `bg-chart-1`, `bg-sidebar`… They follow light/dark mode through the existing `.dark` class, and re-theming `--aw-*` re-themes them.

## Known differences from a stock shadcn theme

| Token          | shadcn meaning         | AstroWind meaning                  | What to do                                          |
| -------------- | ---------------------- | ---------------------------------- | --------------------------------------------------- |
| `bg-secondary` | subtle grey surface    | secondary brand colour (blue)      | Use `bg-muted-foreground/10` or `bg-card`           |
| `bg-accent`    | subtle hover surface   | accent brand colour (purple)       | Use `hover:bg-foreground/5`                         |
| `bg-muted`     | subtle surface         | not defined (`text-muted` is text) | Use `bg-foreground/5` or define your own            |
| `rounded-*`    | scaled from `--radius` | Tailwind defaults                  | Leave as is, or map `--radius-*` in `@theme inline` |

If you want the exact shadcn semantics for `secondary`/`accent`/`muted`, rename those tokens in `tailwind.css` and update the widgets that use `text-muted`, `bg-secondary` and `text-accent` first.

## Adding shadcn/ui components (React)

shadcn/ui components are React; AstroWind ships no framework by default.

1. `npx astro add react`
2. `npx shadcn@latest init` — choose Tailwind v4, CSS variables, and point `tailwind.css` to `src/assets/styles/tailwind.css` in `components.json`. **Do not** let it overwrite that file; the variables are already provided by `shadcn.css`.
3. `npx shadcn@latest add button card` (etc.). Components land in `src/components/ui/` by default; consider `src/components/shadcn/` to keep them apart from AstroWind's own `ui/` primitives.
4. Use them in `.astro` files with a client directive when interactive: `<Button client:load>…</Button>`.

Astro-native ports of the shadcn design (e.g. Starwind, Basecoat) work with the same variables and need no React.

## Changing a token

Edit `src/assets/styles/shadcn.css`. Keep values as `var(--aw-*)` or `color-mix()` of them so themes stay in sync; only `--destructive` and the `-foreground` whites are fixed.

## Notes

- Build and check with `npm run build && npm run check`; a token typo shows up as a missing utility at build time.
- The layer adds ~2 KB of CSS and no runtime cost.
