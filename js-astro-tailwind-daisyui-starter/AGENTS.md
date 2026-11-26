# AGENTS

This repository is a production-ready Astro starter.

## Product direction

- Keep DaisyUI as a fixed default UI layer.
- Lookup fresh DaisyUI and tailwindcss reference online.
- Don't produce own CSS. If you need too warn about this.
- Keep Alpine limited to small progressive enhancement needs.
- Prefer strong defaults over configurability.
- Do not turn the starter into a theme, generator, or option matrix.
- Document in the code more than usual. Code hints help devs to adopt faster.

## Styling order

1. DaisyUI components and classes
2. Tailwind utilities for layout and spacing
3. Minimal custom CSS only when needed

Use Tailwind Typography for rich article content.

## Editing guidelines

- Keep examples realistic, polished, and easy to delete.
- Preserve simple component structure; do not add abstraction without reuse.
- Keep docs calm, practical, and low-hype.

## Verification

Run these after meaningful changes:

```bash
pnpm check
pnpm build
```
