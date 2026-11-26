# Theme Token Maintenance Guide (English)

This document defines naming and maintenance rules for theme tokens, to avoid duplicated semantics and style drift.

## 1. File Locations

- Token source: `src/styles/variables.styl`
- daisyUI theme mapping: `src/styles/global.css`
- Shared UI styles: `src/styles/main.css`
- Markdown styles: `src/styles/markdown.css`

## 2. Token Layers

Use two token layers:

1. Brand layer (Argon palette)
- Naming: `--argon-*`
- Base colors only. Do not bind components directly to this layer.

2. Semantic layer (component-facing)
- Naming: `--surface-*`, `--border-*`, `--toc-*`, etc.
- Components should consume semantic tokens first.

## 3. Common Semantic Tokens

- `--primary` / `--color-primary-content`
- `--card-bg` / `--page-bg`
- `--surface-soft` / `--surface-soft-hover` / `--surface-soft-active`
- `--surface-muted-hover` / `--surface-muted-active`
- `--surface-emphasis-hover` / `--surface-emphasis-active`
- `--border-divider` / `--border-divider-muted`
- `--toc-chip-bg` / `--toc-surface-hover` / `--toc-surface-active`

## 4. Change Workflow

1. Add/update tokens in `src/styles/variables.styl`.
2. If daisyUI components need them, map them in `src/styles/global.css`.
3. Replace usages in components/styles.
4. Run checks:

```bash
pnpm check
pnpm build
```

## 5. Guardrails

- Do not reintroduce legacy component-coupled names like `--btn-*`.
- Do not define the same token in multiple places.
- Prefer token usage over hardcoded color values.
