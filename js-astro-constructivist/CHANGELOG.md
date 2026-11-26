# Changelog

Notable changes to Constructa are recorded here. The 1.0.0 source is published
and deployed from [65658c4](https://github.com/MiraHikari/astro-constructivist/commit/65658c432bb710deed22d12da0e054ef88a9b894).
The annotated tag and [v1.0.0 release](https://github.com/MiraHikari/astro-constructivist/releases/tag/v1.0.0)
point to that verified application source.
See [quality evidence](docs/QUALITY.md) and the [release checklist](docs/RELEASE.md)
for verification scope and publication status.

## Unreleased

### Added

- Configurable overlapping color-plate entrance, an original shared mark,
  independent navigation tiles, and an editorial chapter/search menu.
- Seven chapter bridges with local motion, stronger hero composition, and
  full-width project spreads.
- High-resolution dual-palette and feature previews, an editable 4K project
  cover, compliant 16:9 portal images, and a capture script that rejects stale or failed pages.

### Improved

- Split shared foundations, component styles, chapter composition, and
  document-experience overrides; reuse gallery, project, and index markup.
- Preserve keyboard focus when skipping the entrance; bound initial font/load
  readiness and refresh late resources without replaying the initial fragment.
- Remove decorative menu overflow, allow quick shortcut reopening, and restore
  the no-JavaScript mobile section index.
- Keep navigation usable during palette transitions; end theme transitions
  when reduced motion is enabled or printing begins.
- Improve mobile biography readability and omit stray zeroes from empty
  project highlights and education courses.
- Preserve local and remote SVG image formats while optimizing raster images,
  and allocate full-width slots to Chinese and other East Asian hero glyphs.
- Update to the stable Astro 7.4.12 patch for directory preparation and remove
  obsolete local 1.0.0 screenshots while retaining links to release evidence.

This refresh is prepared locally for review. The public 1.0.0 release and
theme-directory status are unchanged until the maintainer approves publication.

## 1.0.0 - 2026-11-01

### Added

- Constructivist Astro portfolio theme with a single `cv.json` content and
  configuration boundary and an editor-facing JSON schema.
- Section-local scroll motion and a progressive horizontal work exhibition.
- Seeded interleaved hero typography and an original pixel-globe treatment.
- Six palettes, dark mode, searchable command index, project dialogs, gallery
  modes, keyboard controls, and a desktop design inspector.
- Responsive floating navigation with a moving active indicator, layered label
  transitions, and a body-level cursor that paints above the dock.
- Compact CV printing, an A4 poster layout, and seeded SVG/PNG poster exports.
- English and Chinese introduction, configuration and deployment guides,
  contributor guidance, and prepared theme-listing material.

### Reliability

- Runtime reduced-motion handling and natural stacked fallback layouts.
- Storage-safe theme controls and a clipboard-denial selection fallback.
- Dialog cleanup when printing and complete skills output despite active filters.
- Regression coverage for navigation, keyboard access, dialogs, gallery controls,
  print, and responsive behavior. The final local production-subpath run completed
  with 93 passing cases, 11 expected platform skips, and no failures across
  104 cases, including floating navigation, cursor layering, and real touch input.
  A separate root-path production run passed the same 104-case matrix, for
  186 executed passes and 22 expected skips across both builds.
- Three production configuration fixtures and eight browser checks verify
  disabled/reordered sections, custom copy, a single case, empty gallery,
  wide headings, and one-page six-metric poster output.
- Fixed project-fragment hero actions, wide-glyph clipping, touch-globe gesture
  intent, and cursor stacking below the navigation dock.

### Toolchain

- Astro 7.4.4, pnpm 12.16.1, Node 24 LTS, and updated stable direct dependencies.
- TypeScript 6.0.3 retained for compatibility with the current Astro checker.
- Generated editor schema with 277 interface-copy hints, configuration validation,
  and schema-drift checks that do not depend on personalized copy values.
- Named pnpm catalogs, explicit build-script permissions, opt-in Git hooks,
  scoped security resolutions, and no network install in the pre-commit hook.
- Removed icon-download and post-build compression integrations in favor of
  local icon data and Astro's static build.

### Publication

- Published the public GitHub template and deployed the HTTPS demo to GitHub Pages.
- Published the annotated `v1.0.0` tag and GitHub release at the verified source commit.
- [Release pipeline 41236637936](https://github.com/MiraHikari/astro-constructivist/actions/runs/41236637936)
  passed all five Linux quality, root/subpath browser, build, and deployment jobs.
- Verified deployed assets, metadata, Index navigation, project focus, and case
  dialog interaction. Astro theme-directory submission has not been performed.
