# Contributing

Read [`AGENTS.md`](AGENTS.md) (commands, conventions that bite, skills index) and [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) (how the machinery fits together) before changing anything structural. This file covers the contribution mechanics they don't.

## Adding a component

The canonical playbook is the [create-component skill](.agents/skills/create-component/SKILL.md) — follow it, not this summary. The shape of the work:

1. Pick the tier (core element / wrapper / page section) and create a kebab-case directory under `src/components/` with a matching `PascalCase.astro`. Discovery is by glob — no manual registry.
2. Write the sibling CloudCannon YAML: `{slug}.cloudcannon.structure-value.yml` (label, icon, defaults for every prop) and `{slug}.cloudcannon.inputs.yml`. Wrappers additionally need registering in `.cloudcannon/structures/*.yml` contexts.
3. Style with `<style is:global>` in `@layer components` (building blocks) or `@layer page-sections` (page sections), tokens only — no hardcoded colors/spacing/breakpoints.
4. Interactive JS that must work in the CloudCannon editor goes in an importable module registered in `editor-live-sync.js` — inline `<script>`s don't run there.
5. Insertable in a documentation page's body? Add `{slug}.cloudcannon.snippets.yml`, and check the tag name matches its key in `src/components/utils/mdxComponents.ts`.
6. Author a `*.preview.mjs` recipe, then `npm run previews:build` to compile its thumbnail SVG.
7. `npm run docs:catalog` to refresh the agent-facing component tables.
8. Place it on a page under `src/content/` so it ships composed — and so the smoke tests can reach it.
9. `npm run check`, then verify in the Visual Editor (`npm run dev`).

## Checks

Run `npm run check` before claiming any work done — it is what CI runs. The `check` script in [`package.json`](package.json) is the list of what it chains; `npm run check:fix` auto-fixes lint and formatting.

## Dependencies: never bare `npm install`

After editing `package.json`, run `npm run deps:sync` — never plain `npm install`. A macOS install strips the Linux-only optional dependencies (sharp and rollup native binaries) from the lockfile, which breaks CI. `deps:sync` regenerates the lockfile with those platforms pinned, then runs `npm ci`. `package.json` is JSON and can't carry a comment saying this — that's why it lives here.

## Changelog

There is no `CHANGELOG.md`. The site publishes its own changelog from `src/content/changelog/`, one file per release, and nothing is written there until a release is cut — describe your change in the commit message and the pull request instead. Full rule: [`.agents/rules/changelog.md`](.agents/rules/changelog.md).

## Skills layout

`AGENTS.md` is the one instructions file for every coding agent; `CLAUDE.md` only imports it and the rules. Agent skills and rules live canonically in `.agents/` (`skills/<skill>/SKILL.md`, `rules/<name>.md`). `.claude/skills/` and `.cursor/rules/` are generated copies — never hand-edit them. Edit under `.agents/`, then run `npm run agents:sync`; `agents:check` fails CI on drift.
