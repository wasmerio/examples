# AGENTS.md — Astro Extension Kit Lite (single page, English only)

Guidance for AI coding agents (Cursor, Codex, Claude Code, etc.) working in this repo.

## Stack
- Astro 7 (static output), Tailwind CSS 4 via `@tailwindcss/vite`, TypeScript strict. Node 22 (`.nvmrc`).
- **Zero framework JS.** Do not add React/Vue/Svelte islands. The only script is the inline theme snippet in `src/layouts/Base.astro`.

## Commands
- `npm run dev` · `npm run build` · `npx astro check` (must be 0 errors before you finish).

## Where things live
- `src/site.config.ts` — product name, version, store URLs, permissions list.
- `src/i18n/ui.ts` — all UI strings for `en`, `ja`, `zh-TW`. Add a key to **every** locale.
- `src/pages/[...lang]/` — every page is generated per locale via `langPaths`. English has no prefix.
- `src/styles/global.css` — design tokens (CSS vars) for light & dark. Never hard-code hex colors in components; use `bg-paper`, `text-ink`, `text-ink-2`, `border-line`, `bg-signal`, etc.

## Rules
- Keep text contrast ≥ 4.5:1 in both modes; Lighthouse must stay ≥ 95 in all four categories.
- No gradients, glassmorphism, emoji icons or drop shadows (except the browser mock). See `/design` doc for the visual language.
