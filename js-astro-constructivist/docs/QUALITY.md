# Quality and release evidence

## Current local review - 2026-11-14

The layered-loader, independent-navigation, and chapter-motion refresh is a
accepted review build. The maintainer authorized commit, push, deployment,
and Astro directory submission on 2026-11-14. Publication results will be
recorded after the actions complete. The published 1.0.0 evidence below
describes its own source commit, not this refresh.

| Gate | Current result |
| --- | --- |
| Schema, configuration, lint, types, Knip, unit tests | `pnpm run ci` passed; 83 unit tests; 117 checked files with zero errors, warnings, or hints. |
| Static build | Root and `/astro-constructivist/` production builds passed. |
| Final production browser matrices | Astro 7.4.12 root and repository subpath each passed 122 tests, with 14 expected platform skips, zero failures, and zero flaky cases. Total: 244 executed passes across 272 cases. |
| Configuration variants | Three independently built variants passed nine viewport checks: minimal/disabled/reordered sections, wide three-line type with six metrics, and Chinese copy. |
| Remote image output | Remote project and gallery SVGs retained vector output; a remote PNG produced WebP. Browser checks confirmed all three load. |
| Dependency reproducibility and audit | Pinned pnpm frozen-lockfile install passed; production and full audits report zero known vulnerabilities on 2026-11-14. |
| Print and export | Actual one-page A4 output, including the six-metric fixture; 1200 × 1600 SVG and PNG downloaded through real controls. The SVG contains the CV content and embedded Anton, Space Grotesk, and JetBrains Mono fonts. |
| Promotional captures | Current 4K cover, 3840 × 2432 dual-palette preview, 3840 × 2880 feature board, and 780 × 1688 mobile view use actual production captures. |

The current review exercises keyboard loader skipping, failed-script and slow-font
release, initial fragments, late geometry refresh, menu shortcut reopening,
case focus, native touch scrolling, gallery controls, filters, blocked storage,
clipboard fallback, dynamic reduced motion, print, and theme transitions that
leave navigation clickable. The built-in browser verified the current page,
real downloads, and focus return without application warning or error logs.

Visual inspection checks desktop and mobile type, navigation gaps, annotation
contrast, project media, chapter continuity, export legibility, and print
footers. The Chinese fixture additionally checks adjacent glyphs for overlap.
The image-capture script verifies the requested palettes and rejects blank
pages, framework overlays, failed resources, and application errors before
replacing the promotional set. There is no accepted AI concept image; the
design is original code/vector composition with real browser evidence.

Current checks run on Node.js 24.22.1, pinned pnpm 12.16.1, Astro 7.4.12,
Playwright 1.64.1, and Chromium with desktop and Pixel 7 emulation. Firefox
and WebKit are not included. Linux/public-deployment results below remain
dated evidence for 1.0.0; they were not re-run or published for this local
refresh.

## Published 1.0.0 - 2026-11-01

This report records local, Linux CI, and public-deployment verification of
Constructa 1.0.0 on **2026-11-01**, at
[commit 65658c4](https://github.com/MiraHikari/astro-constructivist/commit/65658c432bb710deed22d12da0e054ef88a9b894).
Theme-directory submission has not been performed.

**Published checkpoint:** both final local production builds cover the floating
navigation dock, body-level cursor, and touch-globe refinements. Root and
repository-subpath runs each passed with 93 cases, 11 expected platform skips,
and no failures. Screenshots were refreshed. The Linux root/subpath CI jobs and
GitHub Pages deployment also succeeded, followed by a public-site smoke test.

## Environment

| Item | Verified environment |
| --- | --- |
| Runtime | Node.js 24.22.1 on Windows; Node 24 LTS is the documented line. |
| Package manager | pnpm 12.16.1 with package integrity pinned. |
| Framework | Astro 7.4.4, static output. |
| TypeScript | 6.0.3, matching the current Astro checker's supported peer range. |
| Unit runner | Vitest 5.0.5. |
| Browser runner | Playwright 1.64.1, Chromium desktop and mobile-emulated projects. |
| Content | Neutral demo configuration and original SVG artwork. |

## Completed local gates

| Gate | Result | Evidence scope |
| --- | --- | --- |
| `pnpm run ci` | Passed | Schema freshness, configuration, lint, types, Knip, and unit tests. |
| Unit tests | 75 passed, 0 failed | Current theme data, configuration, and utility tests. |
| Type diagnostics | 0 errors, 0 warnings | Astro check reported 94 files. |
| `pnpm build` | Passed | Current static theme build, not the predecessor portfolio. |
| Schema generation | Passed | `cv.schema.json` contains 277 UI-copy keys and matches the runtime schema. |
| Production dependency audit | 0 advisories | Current locked production graph. |
| Full dependency audit | 0 advisories | Current locked graph including development tools. |
| Clean frozen installation | Passed | Fresh directory, `pnpm install --frozen-lockfile --ignore-scripts`; no lockfile rewrite or peer warnings. |
| Repository-subpath browser suite | 93 passed, 11 expected skips, 0 failed | 104 cases in 2.6 minutes, including final dock/cursor/touch changes. |
| Root-path browser suite | 93 passed, 11 expected skips, 0 failed | A separate 104-case production run in 2.6 minutes. |
| Configuration fixtures | 3 production builds and 8 browser checks passed | Minimal/disabled/reordered content and wide-heading/print edge cases. |

The clean-install check was isolated from the working checkout. It validates
lockfile reproducibility with lifecycle scripts disabled. The normal Linux CI
install subsequently succeeded with the declared `allowBuilds` policy.

Audit counts are a snapshot, not a guarantee of permanent security. Dependencies
retain their own upstream licenses and advisories. Exact reviewed overrides and
release-age exceptions are documented in [TOOLCHAIN.md](TOOLCHAIN.md).

## Browser and visual verification

The final repository-subpath **104-case** production-browser run completed with
**93 passed, 11 expected desktop/mobile skips, and 0 failures** in 2.6 minutes.
It exercised the immutable Astro production build at
`http://127.0.0.1:4326/astro-constructivist/`, with
`BASE_PATH=/astro-constructivist/`.

A separately built root-path site at `http://127.0.0.1:4327/`, using
`BASE_PATH=/` and `SITE_URL=https://example.com`, also completed **104 cases:
93 passed, 11 expected skips, 0 failures**, in 2.6 minutes. Together, the local
matrix contains 208 cases: 186 executed passes and 22 expected platform skips.

Primary projects used a 1440 x 900 desktop viewport and Pixel 7 emulation at
390 x 844. The responsive sweep covered 320 x 844, 390 x 844, 768 x 1024,
1024 x 768, 1280 x 720, and 1440 x 900. All four font families loaded, and
the checks found no missing assets. The run included Axe checks for the full
page, sections, and reduced-motion state, plus an actual one-page A4 PDF.

The exercised flows include:

- Desktop and mobile layouts, short viewports, and horizontal work fallback.
- Section and project anchors, history, keyboard focus, and command search.
- Project cases, lightbox, gallery modes, filters, and clipboard fallback.
- Live reduced-motion changes and blocked-storage behavior.
- Complete compact printing and a real one-page A4 PDF.
- Base-aware production assets, metadata, fonts, and public endpoints.
- Floating-dock indicator updates, cursor paint order, and underlying pointer targets.
- Real touch gestures: horizontal globe rotation and preserved native vertical panning.

[Desktop](https://github.com/MiraHikari/astro-constructivist/releases/download/v1.0.0/desktop.png)
(1440 x 900), [mobile](https://github.com/MiraHikari/astro-constructivist/releases/download/v1.0.0/mobile.png)
(390 x 844), and [navigation](https://github.com/MiraHikari/astro-constructivist/releases/download/v1.0.0/navigation.png)
(1440 x 1080) were refreshed from the final validated
floating-dock build and visually inspected. The globe was paused with its real
control, all four fonts had loaded, and no page or asset errors were recorded.
The mobile image includes the call to action, metrics, profiles, and scroll
control. The navigation image shows all seven Index rows at a genuine tall
viewport. Cover and social artwork are separate promotional graphics, not test
screenshots.

These completed runs validate real local production output at both root and
repository-subpath URLs. The separate Linux GitHub-hosted root and subpath jobs
also succeeded; those results are linked below rather than inferred from Windows.

## Independent review and configuration fixtures

The final review followed the project's Antfu conventions: named catalogs,
explicit runtime boundaries, schema-backed configuration, ESLint formatting,
Knip, and checks before publication. It fixed four actionable interaction issues:

| Finding | Fix and verification |
| --- | --- |
| Hero action targeting a project fragment | Resolve the real project destination rather than dropping the CTA; verified with a custom configured target. |
| Very wide hero glyphs | Fit configured lines without clipping, including three wide lines and six metrics. |
| Touch globe blocks page gestures | Separate horizontal drag intent from vertical scrolling; actual touch input changes the canvas horizontally and preserves native vertical pan. |
| Cursor hidden under the top bar | Mount the cursor outside `main`'s stacking context as a body child; verify paint order and that underlying controls remain clickable. |

Three isolated production configurations passed eight browser checks. They cover
all enhancements disabled, the top section disabled, reordered chapters, custom
UI copy, a single project, an empty gallery, and long/wide three-line headings.
The six-metric configuration still produces one A4 poster page. These fixtures
are evidence for configurable behavior, not a promise that arbitrary content
will fit without inspection.

Toolchain review removed obsolete integrations and unsafe default hook behavior,
added deterministic schema-drift checking, and validated a clean frozen install.
Both audits reported zero advisories after reviewed dependency updates and
narrow security overrides. TypeScript remains on the supported 6.x line rather
than forcing an unsupported latest major into the Astro checker.

## Public status

The [public template repository](https://github.com/MiraHikari/astro-constructivist)
contains the verified source, license, documentation, and demo assets. Description,
topics, GitHub template mode, and private vulnerability reporting are configured.

The annotated `v1.0.0` tag and
[GitHub release](https://github.com/MiraHikari/astro-constructivist/releases/tag/v1.0.0)
are published at the same verified source commit `65658c4`. Subsequent
documentation-only updates do not change the application build described here.

[GitHub Pages run 41236637936](https://github.com/MiraHikari/astro-constructivist/actions/runs/41236637936)
completed successfully for commit `65658c432bb710deed22d12da0e054ef88a9b894`.
All five jobs passed: quality gates, root production-browser tests, subpath
production-browser tests, configured-site build, and Pages deployment.

The [public HTTPS demo](https://mirahikari.github.io/astro-constructivist/)
returned 200. The following deployed resources also returned 200 with appropriate
content types: `robots.txt`, `sitemap-index.xml`, `sitemap-0.xml`,
`manifest.webmanifest`, `favicon.svg`, `apple-touch-icon.png`, `og.png`, and
`demo/project-forma.svg`. Canonical and Open Graph URLs use the repository base,
including the correct social-image URL; robots metadata allows indexing and
points to the deployed sitemap.

An in-app browser smoke test confirmed the title and eight real sections.
Searching the Index for `Forma` returned two results; Enter on the first result
navigated to `#project-1` with the correct focus, and the case dialog opened.
The exercised public flow produced no application warning or error logs.

## Explicit limits

- No Lighthouse score, performance ranking, or universal accessibility
  certification is claimed.
- Firefox and WebKit are not covered by the current Chromium-only suite.
- TypeScript 7 is intentionally not installed because the current Astro checker
  declares support for TypeScript 5/6, not 7. See the compatibility note in
  [TOOLCHAIN.md](TOOLCHAIN.md).
- Static hosting removes a deployed application-server surface, but build/dev
  tools and remote user assets still require normal security review.
- Astro theme-directory submission is separate from local QA and deployment;
  this report does not imply acceptance or endorsement.

Re-run the relevant gates after changing content, dependencies, or build
configuration. Use [RELEASE.md](RELEASE.md) to track what remains rather than
turning an unchecked item into marketing copy.
