# Release checklist

## Current review - 2026-11-14

- [x] Layered color-plate Loader, independent navigation, and seven chapter bridges are implemented.
- [x] CSS is organized into foundations, components, sections, and document-experience layers; project/gallery/index markup is reusable.
- [x] Schema freshness, configuration, lint, types, Knip, and 83 unit tests pass.
- [x] Root and repository-subpath production builds pass.
- [x] Three configuration variants cover disabled/reordered sections, empty lists, wide headings, six metrics, and Chinese glyphs.
- [x] Remote SVG and PNG sources build and render using the appropriate output format.
- [x] Real one-page A4 output and SVG/PNG exports are inspected; SVG fonts are embedded.
- [x] Current dual-palette preview, feature board, mobile preview, and 4K cover are prepared from production output.
- [x] Configuration, architecture, design direction, and listing copy describe the refresh.
- [x] Final Astro 7.4.12 production matrices are recorded: 122 passed and 14 expected skips per root/subpath build, with zero failures or flaky cases.
- [x] Frozen installation and production/full audits pass; old local release images are cleaned. Temporary fixture sources and the old dependency backup remain outside the repository because automatic policy rejected their removal.
- [x] The maintainer accepted this version and authorized commit, push, deployment, and Astro submission on 2026-11-14.
- [ ] The accepted version is committed, pushed, and deployed, with its own Linux CI and public-site verification.
- [ ] Astro portal submission is completed through the built-in browser after acceptance.

The public source and directory status remain separate from this local review.
Prepared copy and screenshots do not mean that the refreshed version is deployed
or accepted by the theme directory.

## Published 1.0.0 checklist

Status checkpoint: **2026-11-01, Constructa 1.0.0 deployed source**.
Checked items have evidence in [QUALITY.md](QUALITY.md). Final local root/subpath
aggregates and updated captures cover the dock/cursor/touch refinements. Linux
quality/browser jobs and public Pages deployment passed for
[65658c4](https://github.com/MiraHikari/astro-constructivist/commit/65658c432bb710deed22d12da0e054ef88a9b894).
Theme-directory submission has not been performed.

## Configuration and content

- [x] `cv.json`, `cv.schema.json`, and runtime validation agree.
- [x] Normal content/copy/navigation/SEO/feature settings have a `cv.json` configuration boundary.
- [x] Three isolated production configurations pass eight browser checks for optional, disabled, and reordered content.
- [x] The example content is neutral and contains no private contact data,
  misleading credentials, real personal filing numbers, or third-party photos.
- [x] Demo SVGs and promotional assets have clear provenance and licenses.
- [ ] Long headings, non-ASCII text, empty lists, local images, and remote images
  have been checked.

## Build and quality

- [x] An isolated frozen install with Node.js 24 LTS and pnpm 12.16.1 succeeds with lifecycle scripts disabled.
- [x] `pnpm run ci` succeeds, including 75 passing unit tests.
- [x] `pnpm build` succeeds with zero type errors or warnings.
- [x] Production and full dependency audits report zero advisories for the reviewed lockfile.
- [x] Final repository-subpath aggregate complete: 93 passed, 11 expected platform skips, 0 failures.
- [x] Separate root-path aggregate complete: 93 passed, 11 expected platform skips, 0 failures.
- [x] Linux CI quality gates and both production-browser jobs succeed in the linked release run.
- [x] The final aggregate covers the floating dock, cursor layering, and touch-globe changes.
- [x] Root and repository-base local production previews load without missing assets.
- [x] The exercised production-browser flows report no uncaught application errors or stale debug overlays.
- [ ] No temporary dependency junction, local screenshots, browser traces, or
  machine-specific helper files are included in Git.

## Experience

- [ ] Desktop, mobile, short viewport, and long-content layouts are inspected.
- [x] Hero mixed typography and pixel globe pass their configuration, motion, and real-touch checks.
- [x] Local project navigation, history, deep links, and keyboard focus work in the tested build.
- [x] Command search, cases, lightbox, gallery controls, and filters pass their browser checks.
- [x] Reduced-motion changes while the page is open tear down animation safely.
- [x] No-JS visitors can read the content and follow useful links.
- [x] Clipboard denial and storage restrictions leave useful fallbacks.
- [x] Compact print includes all skills and expanded records.
- [x] Poster mode produces one real, zero-margin A4 PDF page and returns cleanly.
- [ ] SVG/PNG poster exports include actual content and usable image/font assets.

## Public repository

- [x] Public repository name, description, and topics are set.
- [x] GitHub template mode is enabled.
- [x] Private vulnerability reporting is enabled.
- [x] License and release source are present on the public default branch.
- [x] README and Chinese README local links resolve; their public repository and demo destinations are live.
- [x] The original cover, desktop/mobile/navigation captures, and social card
  are preserved in the [1.0.0 release](https://github.com/MiraHikari/astro-constructivist/releases/tag/v1.0.0).
- [x] Desktop, mobile, and full Index screenshots are refreshed for the final navigation design.
- [x] Contribution, security, issue, and pull-request guidance is prepared.
- [x] Original license notices and third-party terms are preserved locally.
- [x] No React Bits component or exported template asset is redistributed.

## Deployment and publication

- [x] GitHub Pages is configured to deploy from GitHub Actions.
- [x] Workflow permissions and the `github-pages` environment complete a successful deployment.
- [x] The public demo deployment succeeds at the documented URL.
- [x] Canonical, robots, sitemap, social image, favicon, and base-path requests
  have been inspected on the deployed site, not just locally.
- [x] Package version and dated changelog describe the published 1.0.0 release.
- [x] Publication is explicitly authorized by the maintainer.
- [x] The annotated `v1.0.0` tag and [release notes](https://github.com/MiraHikari/astro-constructivist/releases/tag/v1.0.0) are published at verified source commit `65658c4`.
- [ ] Theme-directory submission is separately reviewed and authorized.

Do not mark a gate complete because an earlier version or the original personal
portfolio passed. Report known gaps instead of silently converting them into
promises in marketing copy.
