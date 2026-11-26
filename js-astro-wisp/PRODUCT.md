# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Theme users:** authors who run a Chinese-first technical blog on Astro and install `astro-wisp` from npm. They write MDX, draw diagrams in Excalidraw / draw.io, and expect the theme to handle layout, code, math, diagrams and explainers without per-site CSS work.
- **Readers of a Wisp site:** working engineers. The reference site, infra-note, is read by LLM inference engineers who follow numbered series (DeepSeek, vLLM graph mode) in order, on a desktop, reading prose next to code, formulas and diagrams. The theme stays a general technical-blog theme rather than a niche infra console.

## Product Purpose

A quiet, well-made reading theme for long-form technical writing in Chinese and English. Success: a reader can follow a 20+ post series without losing place, read every code line and diagram label at its intended size, and never notice the theme getting in the way. Failure, in the owner's words: details that are poor or rough.

## Positioning

A theme built around the series-of-explainers format: numbered posts, a series rail, first-class diagrams with downloadable sources, interactive explainers, and Chinese typesetting rules (no negative tracking, emphasis dots instead of italic, `text-autospace`) that generic Astro blog themes ignore.

## Operating Context

- Distributed as the npm package `astro-wisp` (Astro 7 integration, Tailwind 4, MDX, React islands). Sites override palette, CSS and components through virtual modules; the reference consumer is `infra-note`, deployed to GitHub Pages under a base path.
- Content includes Shiki code blocks with line numbers and folding, KaTeX, Mermaid, `.excalidraw` / `.drawio` diagrams compiled to `.wisp.svg`, tables and React explainers.

## Capabilities and Constraints

- Colors come only from palette-generated tokens (`--wisp-*`, `--wd-*`, `Tone` in explainers); no raw hex, Tailwind color scales or `dark:` color variants. `pnpm tokens` regenerates derived files.
- Layering: page chrome in `@layer components`; prose content in `@layer utilities`.
- Theme components reference each other through `virtual:wisp/components/<Name>` so sites can override them.
- The categorical/semantic hue palette (Q blue, K amber, V green, weight violet…) is shared by posts, diagrams and explainers; it may be refined but the role mapping is load-bearing.
- Owner's stance on existing decisions (accent color, typesetting rules, component API): keep what is good, change what can be better.

## Brand Commitments

- Name: Wisp. Stated character in existing docs: quiet, readable, restrained.

## Product Principles

1. Reading comes first: prose, code, formulas and diagram labels are legible at their real size, on every viewport.
2. Series are the unit: position in a series is always visible and one step away.
3. Craft in the details: alignment, rhythm, states and dark mode are finished, not approximated.
4. Token-only color, so any site can re-skin without breaking contrast.

## Accessibility & Inclusion

- Text and muted text ≥ 4.5:1 on their backgrounds; visible focus everywhere; skip link; keyboard-operable explainers; `prefers-reduced-motion` honored.
