<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Www Musi Lang Org](https://github.com/musi-lang/www.musi-lang.org) Astro theme by musi-lang, copied from commit `48522d22287a8854baa8503093cbdd701beb2d62` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-www-musi-lang-org.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with bun, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Removed files used only by other hosts: wrangler.toml.
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [musi-lang](https://github.com/musi-lang), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Musi Website

Public website for Musi. The website is a static-first Bun + Astro + Vite + Preact app that builds into `dist`.

This README is the operations guide for local website contributors, docs authors, and the people publishing the main Musi website.

## Local Contributor

Run commands from the repository root unless a command says otherwise.

Install dependencies:

```bash
bun install
```

Start the local website:

```bash
bun run dev
```

Build and preview the production output:

```bash
bun run dev:prod
```

Validate before sending website or docs changes:

```bash
bun run check
bun run test
```

What those commands cover:

- `bun run check`: sync grammar, regenerate docs content, typecheck, and run Biome checks.
- `bun run test`: sync grammar, regenerate docs content, and run Vitest tests for website code and content generation.

For Lighthouse accessibility audits, use a clean browser profile or incognito window with extensions disabled. Browser automation extensions can inject nodes such as `browser-mcp-container` or `data-mcp-root`; if DevTools shows those nodes, `html[lang]` warnings are audit-context noise, not shipped site markup.

## Docs Author

Human-facing language docs live under `content/musi-book`.
Website maintainer docs live under this README and source comments when needed.
Book routing lives under `src/content/book/registry`.

Docs content is repo-backed. Markdown carries authored prose, TypeScript files carry structure, and generated content is committed for the static site:

- Markdown files hold page copy.
- `src/content/book/manifest.ts` controls routing, grouping, aliases, and order.
- `src/content/snippet-registry.ts` and `src/content/examples/` provide code examples used by Markdown placeholders.
- `scripts/generate-content.ts` deterministically renders docs into `src/generated/rendered-docs.json` and `src/generated/rendered-snippets.json`.
- `scripts/sync-musi-grammar.ts` syncs the Musi TextMate grammar from the VS Code extension before generation.

Rules for language docs:

- Teach current Musi syntax only.
- Do not describe syntax as old, new, former, or transitional.
- Use snippet or example placeholders so examples are highlighted and checked by generation.
- Do not hand-edit `src/content/grammars/musi.tmLanguage.json`; the canonical grammar lives in `musi-lang/vscode-musi`.
- Keep consumer-facing docs educational; compiler-internal notes belong under maintainer docs or crate docs.

Musi grammar sync:

```bash
bun run sync:musi-grammar
bun run sync:musi-grammar:check
```

`bun run generate:content`, `bun run check`, and `bun run test` run this sync path before rendering docs. The local grammar file is a synced artifact from `https://raw.githubusercontent.com/musi-lang/vscode-musi/main/syntaxes/musi.tmLanguage.json`.

## Local Docs Studio

Docs Studio is a local-only Markdown editor for the repository docs.
It is not deployed and does not need a database, external auth app, email provider, or hosted admin service.

Start it from the repository root:

```bash
bun run docs:studio
```

Then open:

```text
http://127.0.0.1:4322
```

Editable roots:

- `docs/what/language`
- `docs/what/website`
- `src/content/book/language`

Docs Studio edits the same repository files that authors review in Git.
Review changes before committing.
The editor rejects paths outside the allowed docs roots.

## Website Structure

- `src/pages/`: Astro routes for static pages, docs aliases, robots, sitemap, and 404.
- `src/site-pages/`: route surfaces for home, learn, install, community, and playground.
- `src/layout/`: shared shell, header, and docs sidebar.
- `src/ui/`: site-owned primitives such as actions, surfaces, page headers, TOC, and theme controls.
- `src/docs.ts` and `src/generated-content.ts`: generated docs route inventory and rendered HTML.
- `scripts/generate-content.ts`: deterministic content generation entrypoint.

Astro owns document HTML, metadata, static routing, sitemap, robots, and 404 output. Preact is reserved for static-compatible components and small local islands when interaction needs state.

## Design And Accessibility

Design target: calm, clear, easy to scan.

Rules:

- calm, not blank
- clear, not verbose
- strong signifiers for links, buttons, navigation, and current location
- warm clay/copper brand family from the Musi icon
- supporting colors allowed when they improve contrast or hierarchy
- no glass, glow, fake metrics, oversized radius, or decorative dashboard tropes

Target WCAG 2.2 AA.

Contributor checklist:

- Keep semantic landmarks: skip link, header, nav, main, and aside where needed.
- Keep heading order valid per page.
- Make every interactive control keyboard reachable and visibly focused.
- Do not rely on color alone for meaning.
- Keep contrast compliant in light and dark themes.
- Make buttons look interactive and links look like links.
- Support reduced motion.
- Preserve readable zoomed layouts and horizontal overflow handling for code and tables.
- Label icon-only or stateful controls with accessible names.

## Publisher Maintainer

The public website deploys as a static Cloudflare Pages site from this repository.

Docs editing is local-only contributor tooling.
The public site must not depend on an admin service being live.

### Cloudflare Pages

Build this site from the repository root.

Use these settings:

- Root directory: repository root
- Build command: `bun install --frozen-lockfile && bun run build`
- Build output directory: `dist`

Recommended Pages environment variables:

- `BUN_VERSION=1.3.12`
Do not set `SKIP_DEPENDENCY_INSTALL`; Cloudflare must install dependencies before `astro build`.

Recommended Cloudflare dashboard settings:

- disable managed `robots.txt` augmentation that injects directives such as `Content-Signal`
- disable Web Analytics / Browser Insights if Lighthouse should stay free of Cloudflare beacon warnings

Deploy verification:

```bash
curl -s https://musi-lang.org/ | head
curl -s https://musi-lang.org/robots.txt
```

Confirm live HTML matches `dist` and `robots.txt` contains only repo-generated directives.
