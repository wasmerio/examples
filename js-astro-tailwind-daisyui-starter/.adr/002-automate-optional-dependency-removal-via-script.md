# 5. Automate optional dependency removal via script

Status: Superseded
Status Date: 2026-04-20
Driver: Alexander Holbreich
Contributors: —

Superseded by: product direction update on 2026-04-21 removing automated stack-removal tooling from the starter

## Context

DaisyUI and Alpine JS are explicitly marketed as "removable" in the template
README. Previously the removal instructions were a bullet list of manual steps:
uninstall the package, remove an import, edit a config file, delete a folder.

Problems with the manual approach:

- Easy to miss a step, leaving broken imports or dead config entries.
- Alpine removal requires rewriting two components (ThemeToggle, Navbar) with
  vanilla JS equivalents — non-trivial for a developer unfamiliar with the code.
- Steps drift from reality as the template evolves but the docs don't.

## Historical decision

Provide `scripts/remove.mjs` — a Node.js script with `--daisyui` and `--alpine`
flags, invokable via `pnpm remove:daisyui` and `pnpm remove:alpine`.

The script handles everything that can be done safely and deterministically:

- Uninstalls packages via `pnpm remove`
- Patches config files with regex (theme.css, astro.config.mjs, site-config.ts)
- Deletes demo pages and component folders
- **For Alpine**: rewrites `ThemeToggle.astro` and `Navbar.astro` in-place with
  vanilla JS equivalents that use `astro:page-load` for View Transitions compat

What the script explicitly does NOT do:

- Remove DaisyUI utility classes from HTML (too risky to automate reliably)
- Rewrite custom Alpine directives added by the user outside template files

The script prints clear warnings listing what still needs manual attention.

### Consequences at the time

- The "removable" promise is now backed by a one-command experience.
- Vanilla JS replacements use `astro:page-load` events, keeping them compatible
  with `<ClientRouter />` View Transitions.
- The script is idempotent for file deletions (checks `existsSync` before `rmSync`).
- Regex patches are validated against the actual file content in the test suite.

## Why this ADR is superseded

The repository no longer treats removability as a core product story. The
starter now prefers a clearer default stack over automated removal helpers, and
the script described here has been deleted.

## Options considered at the time

### Option 1: Manual documentation only (previous approach)

Simple to maintain but easy to miss steps and drifts out of date.

### Option 2: Full codemods (e.g. jscodeshift)

Accurate but heavy — requires an AST parser dependency, significant
maintenance burden for a starter template. Overkill.

### Option 3: Node.js script with regex + file operations (chosen)

No extra dependencies (uses Node built-ins only). Covers the deterministic
parts, defers the non-deterministic parts (class cleanup) to the developer
with explicit guidance.

## Advices

Do not extend or restore this workflow without a separate product decision.

When adding new Alpine-dependent components to the template, update both the
script's `NAVBAR_VANILLA` / `THEME_TOGGLE_VANILLA` constants and add the new
component to the list of manual steps in the script's warning output.
