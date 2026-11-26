# Astro + Cloudflare performance checklist

Read when diagnosing performance in this project.

## Astro 7 SSR

- `output: "server"` — every page is server-rendered on Workers. TTFB includes cold start + render time.
- Prefer static content in `.astro` files; hydrate Svelte only when interactivity is required.
- `client:load` — critical interactivity only (header controls, above-fold widgets).
- `client:idle` — below-fold or non-urgent interactivity.
- `client:visible` — far below fold; best for heavy widgets.

## Images

- Use `astro:assets` `<Image>` for local images: auto format, srcset, dimensions.
- Always set `width` and `height` (or `aspect-ratio` in CSS) to prevent CLS.
- Hero/LCP image: prioritize size (compress, correct dimensions), consider `fetchpriority="high"` on the LCP `<img>`.
- Remote images: ensure CDN caching; avoid oversized originals.

## Fonts

- Fonts configured in `astro.config.mjs` via `fontProviders.google()` → `--astro-font-inter`.
- `Fonts.astro` injects font CSS in `<Head>` slot — do not duplicate font links elsewhere.
- `font-display: swap` is handled by Astro font pipeline; avoid extra font files in `public/`.

## CSS / JS weight

- Tailwind v4 purges via `@import "tailwindcss"` in `global.css` — no separate `tailwind.config.js`.
- daisyUI classes are tree-shaken by Tailwind content detection.
- Check build output for unexpectedly large chunks after adding dependencies.

## Cloudflare Workers

- `compatibility_date` in `wrangler.jsonc` — keep current for runtime perf fixes.
- `nodejs_compat` is enabled — required for some libs; avoid pulling Node-only deps unnecessarily.
- Static assets served via `ASSETS` binding from `./dist` — ensure long cache headers for hashed assets (Astro build handles filenames).
- Cold starts: keep server handler lean; defer heavy imports inside functions when possible.
- Smart Placement (`placement.mode: smart`) — consider if origin latency is high (commented in wrangler.jsonc).

## Verification commands

```sh
pnpm build          # bundle sizes, build warnings
pnpm astro check    # type errors that can block optimal output
pnpm preview        # local SSR smoke test after changes
```

## Core Web Vitals thresholds (good / needs improvement / poor)

| Metric | Good    | Needs improvement | Poor    |
| ------ | ------- | ----------------- | ------- |
| LCP    | < 2.5s  | < 4s              | > 4s    |
| INP    | < 200ms | < 500ms           | > 500ms |
| CLS    | < 0.1   | < 0.25            | > 0.25  |
| TTFB   | < 800ms | < 1.8s            | > 1.8s  |

## Anti-patterns in this stack

- `client:load` on every Svelte component
- Raw `<img src="/large.png">` without dimensions
- Importing entire icon libraries for one icon
- Blocking scripts in `<head>` without `defer`/`async`
- Fetching all locales' data when only one locale renders
- Duplicating font CSS or loading fonts from multiple providers
