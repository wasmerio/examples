# AI quickstart

FORMA is an Astro template with explicit page files, JSON content, reusable UI components and design tokens.

## First steps

```bash
npm ci
npm run dev
```

Read `AGENTS.md`, `docs/ai/architecture.md`, `docs/ai/content-map.md` and `docs/ai/component-catalog.md` before making changes.

## Workflow

1. Find the page, section or content file that owns the requested change.
2. Read its component and data contract.
3. Change JSON before markup for copy, navigation, metadata or section content.
4. Reuse existing UI components before creating a new one.
5. Run `npm run ai:check` and `npm run build`.
6. Review the result in a browser at desktop and mobile widths.
