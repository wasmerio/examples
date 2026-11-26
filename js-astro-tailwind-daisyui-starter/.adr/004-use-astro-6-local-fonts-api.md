# 4. Use Astro 6 local fonts API for the default font

Status: Accepted
Status Date: 2026-04-21
Driver: Alexander Holbreich
Contributors: —

Supersedes: ADR 001

## Context

The starter now targets Astro 6. Astro 6 provides a first-party fonts API that
fits this repository better than direct package imports in CSS:

- font sourcing is configured in `astro.config.mjs`
- the font is loaded in the layout with `<Font />`
- Astro exposes the configured family as a CSS variable
- Tailwind can map that variable to `--font-sans`, and DaisyUI inherits it

Using Astro's local font provider also keeps builds self-contained and avoids
runtime or build-time dependency on external font APIs.

## Decision

Use Astro 6's fonts API with a checked-in local Inter variable font.

The integration path is:

1. `astro.config.mjs` defines the font and exposes `--font-inter`
2. `src/layouts/Layout.astro` loads it with `<Font cssVariable="--font-inter" />`
3. `src/styles/fonts.css` maps that variable to Tailwind's `--font-sans`
4. DaisyUI components inherit the same font through Tailwind's base token

## Consequences

- The starter demonstrates a clear Astro 6 font workflow.
- Font loading stays privacy-safe and offline-friendly.
- Font setup is easier to trace across config, layout, and styling layers.
