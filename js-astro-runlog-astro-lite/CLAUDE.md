# AGENTS.md

Instructions for AI coding agents working on this Astro theme.

## Stack
Astro 7 (static output), Tailwind CSS 4 (tokens via `@theme inline` in `src/styles/global.css`), MDX blog collection.

## Where things live
- Design tokens and color roles: `src/styles/global.css`. Never hardcode hex colors in components; use `text-ink`, `bg-canvas`, `border-rule`, `text-cta` etc.
- Site name, announcement, primary CTA: `src/data/site-settings.json`. Nav and footer: `src/data/site.ts`.
- Homepage copy: `src/data/home.json`.
- Content: `src/content/blog` (MDX with frontmatter; schema in `src/content.config.ts`).
- Shared components: `src/components/` (Header, Footer, Section, SectionHead, MediaWindow, CtaSection, Cover, StatusLog, CodeTabs, RunLog, ThemeSwitcher).

## Rules
- Color roles: `--cta` only for primary actions, the announcement bar and key data; `--link` only for links; `--ok` success; `--badge` informational badges. Everything else monochrome.
- Corners stay square (radius 0) except pills.
- Sections use `<Section>`; `mode="invert"` for the black band (it becomes light on the dark theme), `mode="warm"` for the warm band.
- Product visuals go inside `<MediaWindow>` so buyers can swap them.
- The mobile menu is a native `<dialog>` at 100dvh.
- Copy uses spaced hyphens " - ", never em dashes.

## Checks
`npm run build` must pass. Test at 375px wide: no horizontal page scroll.
