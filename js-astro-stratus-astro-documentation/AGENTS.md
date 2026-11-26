# AGENTS.md

Stratus, an Astro documentation template: a complete docs site — grouped sidebar, search, reference pages, diagrams, media, print layout — visually editable in CloudCannon. Read `docs/ARCHITECTURE.md` before structural changes.

This file is the instructions for every coding agent. `CLAUDE.md` imports it; edit this file, not that one.

## Rules

Every change follows the rules in `.agents/rules/` — read them before editing code or the changelog:

- [`.agents/rules/comments.md`](.agents/rules/comments.md) — when a code comment is allowed (rarely) and what shape it takes.
- [`.agents/rules/changelog.md`](.agents/rules/changelog.md) — there is no `CHANGELOG.md`; releases are files in `src/content/changelog/`.

All prose — site content, editor labels and comments, docs, skills — is American English (color, center, customize, behavior, catalog).

## Commands

- `npm run dev` — dev server. There is no search index on the dev server; `npm run search:dev` builds one you can use locally.
- `npm run build` — `astro build`, then `routing:build` (writes `dist/_cloudcannon/routing.json`, merging the redirects in `src/data/redirects.json`), then the Pagefind index.
- `npm run check` — the gate CI runs; run it before claiming work done. It chains `lint` (ESLint, Stylelint, `lint:css-vars`, `lint:css-literals`, YAML) + `format` + `typecheck` (`astro check`) + `previews:check` + `docs:catalog:check` + `agents:check` + `icons:check` + `lint:cms` + `lint:roots` + `lint:nesting` + `lint:schema` + `lint:links` + `check:placeholders`.
- `npm run check:fix` — auto-fix lint and formatting.
- `npm run lint:css-vars` — every `var(--x)` in `src/` must resolve to a declared custom property. Guessing a token name is the most common CSS mistake here (spacing starts at `xs`, weights are normal/semibold/bold with no `medium`, z-index is `--layer-N`) and it fails **silently**: an unresolved `var()` makes the declaration invalid at computed-value time, so the property just inherits. `var(--x, fallback)` and dynamically built names are skipped. `npm run lint:css-vars -- --list` prints every declared token. Editor equivalent: `cssVariables.lookupFiles` in `.vscode/settings.json`.
- `npm run lint:css-literals` — no raw value in component CSS where a token covers it (border widths, colors, the `ease` keyword, `9999px`, off-scale durations). Scans the `<style>` blocks of `src/components` and `src/layouts` plus `src/styles/base`; `src/styles/themes` is where literal colors belong and is excluded. **Naming a value is the escape hatch**: a declaration whose property is itself a custom property (`--step-marker-size: 1.75rem`) is never flagged, so a component-specific number goes on the component root. Masks and instant durations are exempt.
- `npm run lint:links` — every internal `href` in the built site resolves to a page or asset. Builds `dist/` first when it is missing or older than the last source edit (deleting a source file doesn't count — rebuild by hand after a delete). It also **warns** on orphan pages: a page with no `group` that nothing links to, reachable only through search.
- `npm run lint:cms` — validates the CloudCannon layer against the components: prop drift (inputs/structure-value keys vs the `.astro` destructure), default drift (a `value:` seed must equal the destructure default), orphaned/missing YAML, `_component` resolution, and unresolvable `options.structures: _structures.x` references (a name declared inside a `structure-value.yml` is invisible to the sibling `snippets.yml`, and the array then renders as free text with no error). Run after any prop rename.
- `npm run lint:roots` — no prop-driven `class`/`style`/`data-*` on a component's root element, for every component CloudCannon can make a region root. The editor's re-render keeps the root and swaps its contents, so such an attribute goes stale; put it on a direct child and hoist with `:has()`. `aria-*` and the script's `ALLOWED` list are exempt.
- `npm run lint:nesting` — the `.cloudcannon/structures/*Sections` picker contexts obey the two-tier policy in `.agents/skills/create-component/cloudcannon-yaml.md`: wide slots (section content, split, content-selector panel) take everything; narrow slots (card, grid/masonry item, accordion panel, step) take content blocks only. It also fails on an exclusion another allowed wrapper routes around.
- `npm run lint:schema` — validates `cloudcannon.config.yml`, every `*.cloudcannon.*.yml` and `.cloudcannon/structures/*.yml` against the official JSON Schemas from the pinned `@cloudcannon/configuration-types`. Catches invalid keys, out-of-enum `icon:` values (Material Symbols, snake_case — not the kebab-case Heroicons used for component icon _inputs_) and wrong input types. `--only <substring>` scopes it. Complements `lint:cms`; a clean run isn't proof the editor is happy (deprecated-but-valid keys pass).
- `npm run check:placeholders` — lists template values still in place (the `example.com` site URL, Stratus branding, the template repository URL). Warns only; with `-- --strict` it exits non-zero while the site URL is still a placeholder.
- `npm run docs:catalog` — regenerates the component tables in `.agents/skills/page-content-authoring/component-catalog.md` (and the counts in the README) from each component's YAML, then runs `agents:sync`. `docs:catalog:check` fails on drift.
- `npm run previews:build` — compiles the preview thumbnails in `public/component-previews/` from each co-located `*.preview.mjs` recipe and wires `image:` into the structure YAML (and the `snippets.yml` preview, unless it has its own `gallery:`). `previews:check` guards drift and coverage. `previews:screenshot` captures reference PNGs into `.preview-screenshots/` (an authoring aid only); `previews:montage` rasterizes every SVG into `.preview-montage.png` for reviewing legibility. Recipes use the kit in `scripts/previews/kit.mjs`, whose header is the spec; a recipe declares its `width` and the build **fails** if the drawn geometry doesn't match.
- `npm run icons:sync` — regenerates `.cloudcannon/data/icons.yml` (the `icons` dataset in `data_config`) from the SVGs in `src/icons/`; subdirectories become part of the id (`social/github`). Run after adding or removing an icon; `icons:check` fails on drift. Option labels come from the filename, so rename the file to rename the label.
- `npm run new:component <tier/path/kebab-name>` — scaffold a component (`.astro` + both CloudCannon YAML files) with the right layer, key and preview wiring; prints the remaining steps.
- `npm run reset:starter` — interactive: sets the site name and production URL and clears the demo content and template branding.
- Tests: `npm run test:unit` (Vitest), `npm run test:render` (every structure default builds), `npm run test:smoke` (headless Chrome against `dist/` — needs `COMPONENT_PREVIEWS=true npm run build` first, because it drives components through the `/preview-renders/<key>/` routes that flag adds), `npm run test:flow-margins` (walks the built CSSOM for `@layer page-sections` top margins the `_flow.css` utils layer already overrides; same build first; not in CI).
- After editing `package.json`: `npm run deps:sync`, never bare `npm install` — a macOS install strips the Linux-only optional dependencies from the lockfile and breaks CI. `npm run deps:check` verifies the lockfile.

## Skills

`.agents/skills/*/SKILL.md` are the canonical playbooks — follow the one that matches the task:

- **adding-fonts** — add or change fonts via `site-fonts.mjs`.
- **create-component** — scaffold a new page section or building block with its CloudCannon YAML.
- **debug-cloudcannon** — symptom-first diagnosis of visual-editing problems (picker, editable regions, renderBlock).
- **docs-content-authoring** — write a documentation page: frontmatter, sidebar placement, and the components MDX exposes.
- **editable-regions** — wire `data-prop` / `data-children-prop` visual-editing bindings.
- **migrate-existing-site** — end-to-end migration of an existing website into this template.
- **page-content-authoring** — assemble a page-builder page from existing components; owns the component catalog.
- **screenshot-to-component** — build a new page section from a screenshot.
- **site-data-navigation** — the header, sidebar group order, footer, SEO and other `src/data/` files.
- **theming** — design tokens: colors, spacing, radius, type scale, z-index.

Everything agent-facing is canonical under `.agents/`. `.claude/skills/` and `.cursor/rules/` are generated copies — never hand-edit them; run `npm run agents:sync` (`agents:check` fails CI on drift). The optional [CloudCannon/agent-skills](https://github.com/CloudCannon/agent-skills) plugin adds generic CloudCannon skills; the ones above take precedence for this repo.

## Conventions that bite

- **Every component is a directory** under `src/components/` with `PascalCase.astro` + sibling CloudCannon YAML (`<kebab>.cloudcannon.inputs.yml` + `<kebab>.cloudcannon.structure-value.yml`). Components are discovered by glob; the `_component` string in content is the kebab-case directory path (e.g. `building-blocks/core-elements/button`). The MDX tag is the `.astro` filename, so two components must never share a filename — the later one silently wins.
- **Renaming a prop** means updating the `.astro` destructure, `inputs.yml`, `structure-value.yml` defaults, any `snippets.yml`, and existing content in `src/content/`. `npm run lint:cms` catches YAML-side drift; still grep content for the old name, and run `npm run docs:catalog`.
- **Styling**: components use `<style is:global>` wrapped in `@layer components` (building blocks) or `@layer page-sections` (page sections), consuming CSS custom properties only — no hardcoded colors, spacing, shadows or breakpoint numbers. Tokens: `src/styles/variables/*` (primitive), `src/styles/themes/*` (semantic). **Never guess a token name** — the scales have plausible-looking steps that don't exist (`--spacing-2xs`, `--font-size-body-sm`, `--z-index-2`). The layer order is declared in both `BaseLayout.astro` and `src/pages/preview-renders/[...slug].astro`; keep them in sync.
- **Component-key derivation is shared**: `renderBlock.astro`, `live-editing.js` and `scripts/cms/lint.mjs` all import `src/components/utils/componentKey.mjs`. Change it only there — a divergence makes components vanish from the visual editor.
- **Interactive components** must work in the CloudCannon editor, where inline `<script>`s don't run: put setup logic in an importable module and register it in `editor-live-sync.js` (see `content-selector/setup.ts`).
- **Editable regions**: inline editing is opt-in via `data-editable` / `data-prop` and the `useDefaultEditableBinding` prop — read the editable-regions skill before touching these.
- **MDX snippets**: a component used in an `.mdx` page may only be passed props its `*.cloudcannon.snippets.yml` declares, or the Content Editor can't parse it.
- **The sidebar is derived, not configured**: a page's `group` + `order` frontmatter places it (`src/utils/docsNav.ts`); `src/data/sidebar.json` only orders the groups. A page with no `group` builds and is searchable but has no sidebar entry — deliberate.
- **Two collections, one route**: `src/pages/[...slug].astro` serves `pages` (page-builder `.md`) and `docs` (`.mdx` only — a `.md` file in `src/content/docs/` is silently ignored), mounted at the site root. A slug claimed by both is a build error naming the two files.
- **Generated routes**: `/llms.txt`, `/changelog.xml`, `/robots.txt` and each page's `.md` twin are endpoints in `src/pages/`, built from the content. Don't add static copies in `public/`.
- **`noindex: true`** drops a page from Pagefind (no `data-pagefind-body`) as well as adding the robots tag.
- **Code samples never use a Markdown fence.** CloudCannon's editor drops a fence's `title=`/`{n}` meta, redraws it with its own chrome, and mis-parses a fence nested in a fence badly enough to turn the rest of the file into plain text — so `code_block` is off in every rich-text surface and content uses `CodeBlock`/`CodeTabs`/`CodeAnnotations` (`src/components/utils/highlight.ts`). The exception is the fence between the tags of `CodeBlock`, `CodeTab`, `CodeDiff`, `CodeAnnotations`, `FileTree` and `Diagram`: their snippets read it as raw text and `src/utils/codeFencePlugin.mjs` folds it into the prop, because CloudCannon writes a multi-line string prop with raw newlines that break the MDX build. The fence pipeline still exists for Markdown outside `src/content/`; if you touch it, keep `CODE_THEME` from `src/utils/codeTheme.mjs` and the same `.code-surface` chrome.
- Fonts change in `site-fonts.mjs` only. Header, footer, SEO and other site data live in `src/data/*.json`.
- **Comments**: default to none — see `.agents/rules/comments.md`.
- **There is no `CHANGELOG.md`** — see `.agents/rules/changelog.md`.

## Debugging

A section not rendering usually means a `_component` path mismatch — check the dev-server console for the renderBlock warning listing every available component key.
