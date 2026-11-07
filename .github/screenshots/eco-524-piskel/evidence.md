# Piskel verification evidence

- Captured source: `55bb2d537c8c75624f8543be483f1bebd2231dc1`; `js-piskel` tree `edc26584a2ab50bdedcb8ad203cbee1b4c3f0457`.
- The subsequent merge of `main` and this evidence commit leave that application tree and `Anybuild.js-piskel` unchanged.
- Upstream: Piskel 0.15.2-SNAPSHOT, commit `745caa20ebebbe3991247064ccc5b51ee9a5490d`; original application code, templates, controls, styles, icons, fonts and Apache notices retained.
- Demo: https://piskel-template.wasmer.app/, remote build completed in 16 seconds, live version `dav_Ko6Iot9uZOqW`.
- Catalog: https://wasmer.io/templates/piskel (`at_ynm3Iet1CJr2`), public and requiring a repository copy.
- Independent copy: actual catalog repository-copy backend copied only `js-piskel` with matching content SHAs; https://piskel-copy-1106.wasmer.app/ deployed in 17 seconds, build `9da1a3f2-1564-4db6-a885-9718524c705c`, version `dav_RMMIrt0uV4MO`.

| Screenshot | CSS viewport and raster | What it verifies |
| --- | --- | --- |
| `piskel-55bb2d5-desktop.jpg` | 1440 × 900 | Actual imported 16 × 16 sample, two frames at 4 FPS, and one edited black pixel. |
| `piskel-55bb2d5-export.jpg` | 1440 × 900 | Original GIF export controls and preview. |
| `piskel-55bb2d5-png-export.jpg` | 1440 × 900 | Original PNG export panel, one column/two rows. |
| `piskel-55bb2d5-tablet.jpg` | 768 × 1024 | Compact upstream desktop layout with visible tools and small canvas. |
| `piskel-55bb2d5-mobile.jpg` | 390 × 844 | Upstream desktop-only limit: canvas is clipped and unusable. |
| `piskel-55bb2d5-catalog-copy.jpg` | 1440 × 900 | Independent app: drawn rectangle, duplicate frame, and black edit in frame two. |

## Results and review

- Passed: checksum-verified source extraction, registry-only locked install, production build, stable timestamped filenames, direct/monorepo Anybuild 0.26.4 plans, 509 HTTP asset/notice byte checks and three build-only 404 checks.
- Passed: actual native Edge file import via Replace + confirmation loaded the original 16 × 16, two-frame sample at 4 FPS; embedded-browser Combine also completed through the upstream UI. No Piskel application state was injected.
- Passed: original sample GIF download is 4,971 bytes, 16 × 16, two frames with 250 ms duration each; one pixel edit and PNG download produced a 321-byte, 16 × 32 sprite sheet containing the black edit.
- Passed: independent copy drew a 32 × 32 rectangle, duplicated its frame, changed frame two, and downloaded a 5,007-byte GIF with two different 32 × 32 frames at 80 ms each (12 FPS rounding).
- Passed: source and rendered comparison of all six images against upstream `src/index.html`, `src/templates/`, `src/css/` and its generated production interface; no replacement controls or styling overrides. Independent recipe/design review found no blockers.
- Desktop-only: upstream explicitly does not support mobile/tablets. The tablet baseline renders compactly; mobile clipping remains unchanged and is documented in the template/catalog README.
- Limits: embedded-browser Replace stalled at upstream's `window.confirm`; native Edge Replace and embedded-browser Combine passed. A complete local Anybuild runtime build was not run.
