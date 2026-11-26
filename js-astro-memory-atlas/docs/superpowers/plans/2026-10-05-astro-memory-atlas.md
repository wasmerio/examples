# Astro Memory Atlas Implementation Plan

> **For agentic workers:** Implement task by task with tests before implementation. Keep the source `anniversary` checkout untouched.

**Goal:** Extract an anonymized, forkable Astro memory-site starter and deploy its synthetic demo to GitHub Pages.

**Architecture:** Copy only reusable Astro UI, scripts, CSS, fonts, static map, and locally vendored dependencies from the source project. Replace all factual content and imagery with synthetic modules and newly authored abstract SVGs, then validate IDs/dates/references at build time. Configure static paths from one site config and publish with GitHub Actions.

**Tech Stack:** Astro, JavaScript ES modules, Node.js tests, npm, GitHub Actions, Leaflet, locally hosted fonts and map assets.

**Spec:** `docs/superpowers/specs/2026-10-05-astro-memory-atlas-template-design.md`

## Global Constraints

- Remove source-specific identity and content rather than attempting reversible redaction.
- Build a small synthetic sample dataset with neutral fictional names, invented dates, and generic demo locations; use locally authored abstract placeholder illustrations instead of source photos.
- The debug panel is enabled by default in the sample configuration and starts visible and expanded on every page, without a `?debug=1` query.
- GitHub Pages must build with the repository base path and deploy the anonymized sample site to `https://liyuk.github.io/astro-memory-atlas/`.
- Do not include screenshots or visuals captured from the private source site.
- Preserve the Noto Sans SC OFL notice and notices for all copied third-party dependencies.
- Leave the source repository and its existing uncommitted changes untouched.

## Review Focus

- Missing, duplicate, malformed, or cross-linked sample IDs/dates must fail with actionable validation errors.
- Root-relative asset and navigation links must continue to work under `/astro-memory-atlas/`.
- The debug panel must be visible and expanded on all six routes on first load and remain keyboard collapsible.
- Map data/assets must load offline without external tile or font requests.
- Public files and history must not contain source identity, dates, domain, private assets, EXIF-bearing images, screenshots, or private docs.

---

### Task 1: Establish a clean public starter foundation

**Files:** Create package metadata, `.gitignore`, MIT `LICENSE`, dependency notices, README shell, and copy allowlisted Astro config/layout/styles/fonts/navigation primitives and local vendor assets.

**Produces:** Runnable Astro shell with public-safe metadata and retained notices; no source `dist`, Git history, photos, or personal data.

- [x] Create scaffold and run a clean dependency install.
- [x] Add license and notices for retained font/vendor assets.
- [x] Verify `npm run build` creates a static shell.
- [x] Commit `chore: scaffold public Astro starter`.

### Task 2: Add centralized config and synthetic validated content

**Files:** `src/config/site.js`, `src/data/*.js`, `src/lib/*`, `src/assets/images/demo/*.svg`, validation tests and build hook.

**Produces:** One documented config, stable sample IDs, synthetic memories/timeline/recaps/wishes/places, abstract art, and build-time validation for dates and references.

- [x] Write failing tests for required fields, unique IDs, ISO dates, and cross-module references.
- [x] Run tests and observe the expected failures.
- [x] Implement sample modules, illustrations, and actionable validator.
- [x] Run focused tests and build; verify all references pass.
- [x] Commit `feat: add synthetic memory atlas data`.

### Task 3: Restore the six-page experience

**Files:** Six Astro routes, shared components, album/timeline/map scripts and styles, image assets, static map assets.

**Produces:** Home, album, journey, annual recaps, places, and future wishes routes powered only by sample data, with album search/year/page-turn/viewer and selectable local map.

- [x] Add route smoke tests for all six rendered pages and key sample content.
- [x] Run focused tests and observe missing-route failures.
- [x] Port allowlisted UI and interactions, replacing all copy/data references with sample modules.
- [x] Run route tests and production build.
- [x] Commit `feat: add six sample memory atlas pages`.

### Task 4: Make the debug panel a configurable default feature

**Files:** `src/components/SiteDebugPanel.astro`, `src/scripts/site-debug.js`, `src/styles/site-debug.css`, config, tests.

**Produces:** Visible, expanded panel on each route by default; config can disable it; sample actions cover anniversaries, birthday, navigation, album filters/viewer, map selection, and structural audit.

- [x] Write tests for default-on, disabled, and available sample actions.
- [x] Observe expected failures.
- [x] Implement route-wide panel and generic sample actions.
- [x] Run focused tests and production build.
- [x] Commit `feat: enable configurable sample debug panel`.

### Task 5: Publish docs and GitHub Pages automation

**Files:** `README.md`, `.github/workflows/deploy-pages.yml`, repository metadata/config.

**Produces:** English-first setup guide, concise Chinese quick start, configuration/debug/data guides, Pages instructions, and push/manual deploy workflow using the repository base path.

- [x] Validate README commands and workflow configuration.
- [x] Build using `BASE_PATH=/astro-memory-atlas/` and check generated URLs.
- [x] Commit `docs: document setup and Pages demo deployment`.

### Task 6: Verify public-safety and release readiness

**Files:** privacy-audit script/tests and any defects found.

**Produces:** Automated checks against committed paths/content and a clean successful install/test/build result.

- [x] Add audit tests for forbidden source names, dates, domains, asset paths, EXIF-bearing image formats, screenshots, and source docs.
- [x] Run audit and inspect its findings.
- [x] Fix every leak or failure and rerun the full verification suite.
- [x] Commit `test: audit public template for source data`.
