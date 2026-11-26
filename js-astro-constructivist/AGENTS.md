# Working on Constructa

Constructa is a static, constructivist Astro portfolio theme. Read this file before editing.

## Configuration-first rule

For a request to personalize content or configuration, edit **`cv.json` only**.

This includes profile details, projects, biography, section copy, navigation,
SEO, deployment address, palette choices, feature settings, hero presentation,
and interface wording in `cv.ui`. The editor-facing schema is `cv.schema.json`;
the runtime schema is `src/data/schema.ts`.

- Read the existing configuration and schema before choosing field names.
- Do not edit an Astro component, TypeScript module, stylesheet, or deployment
  workflow to change content that belongs in the configuration.
- Do not add a second configuration file or hardcode copies of the same value.
- Do not invent awards, metrics, testimonials, clients, credentials, or links.
- Keep JSON valid and preserve user content unrelated to the request.
- If the requested customization cannot be expressed by the current schema,
  explain the limitation and ask before extending application code.
- An explicit asset-replacement task may add user-supplied assets to `public/`
  and reference them in `cv.json`; ordinary text/configuration edits add no files.

## Code changes

For explicitly requested functionality or bug fixes, use the existing Astro,
TypeScript, and CSS architecture. Do not introduce React islands for effects
that can be implemented in the existing browser modules.

- Keep the real document as the source of truth. Never reinstate a global
  single-screen stage, trap wheel input, or move sections into dialogs.
- Respect reduced-motion preferences at startup and when they change.
- Preserve native touch scrolling, real anchors, keyboard focus, and print.
- Keep controls and content reachable in fallback layouts.
- Keep shared scroll state in the scroll controller; do not add competing
  observers that disagree about the active section.
- Resolve public asset URLs through the project's base-path utility. Test both
  root deployment and a GitHub Pages repository subpath.
- Add configuration fields and validation together. Keep `cv.schema.json` and
  runtime validation aligned; update configuration documentation when needed.
- Use local demo SVGs or appropriately licensed assets. Do not copy or port
  React Bits components into this redistributable theme.
- Preserve existing copyright notices and third-party licenses.

## Validation

Use Node.js 24 LTS and the pinned pnpm 12.16.1. Do not replace a working dependency
tree with an incompatible package-manager version. Never commit `node_modules`,
generated output, browser traces, or local temporary files.

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm knip
pnpm build
pnpm test:e2e
```

`pnpm run ci` runs the non-browser quality gates. Install Chromium with
`pnpm exec playwright install chromium` before the first browser test run.

Use `pnpm run ci` when a package-manager version reserves `pnpm ci` as its own
clean-install command. The repository's script is the quality gate, not a request
to delete dependencies. `pnpm schema` updates `cv.schema.json` after schema/code
changes; ordinary `cv.json` value edits must not require regenerating it.

For a content-only request, check that `git diff --name-only` contains only
`cv.json`, unless asset additions were explicitly requested. Report checks
actually run; never infer that the build or visual QA passed.

## Visual QA

For rendered changes, inspect desktop and mobile, a short viewport, reduced
motion, keyboard navigation, and any affected dialog. Check the real browser
console and production assets. Print changes require a real PDF page-count
check as well as a visual check; filtered skills must still print in full.

## Publication

Do not push, publish a package, create a public repository, submit to a theme
directory, change repository settings, or deploy without explicit user approval.
Prepared listing text and a successful local build are not a completed release.
