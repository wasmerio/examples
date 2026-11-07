# Excalidraw verification evidence

- Captured application source: `0436ad0f7853f05c51701031015c17a63271b75d`; `js-excalidraw` tree `887a330d5097aad999eaf0f1f3b784009119e127`.
- The subsequent merge of `main` and this evidence commit leave that application tree and `Anybuild.js-excalidraw` unchanged.
- Upstream: Excalidraw 0.18.0 source snapshot `701b901a0f1ba3d0b390d9cdf63d112e25abac4b`; original toolbar, menus, export dialog, controls, component styles, and MIT/font notices retained.
- Demo: https://excalidraw-template.wasmer.app/; build `f2cc2621-f64b-4c71-a462-1ab92730fe9c` completed in 58 seconds; live version `dav_KN4IZtJu8JeA`.
- Catalog: https://wasmer.io/templates/excalidraw (`at_dn73IatdCQbn`), public and requiring a repository copy.
- Independent copy: the actual catalog repository-copy backend copied only `js-excalidraw`, with matching file content SHAs; https://excalidraw-copy-1106.wasmer.app/ deployed in 43 seconds, build `397dbd73-2ce0-47ed-81bc-8b673d331334`, version `dav_2dAIdtdu1pyz`.

| Screenshot | CSS viewport and raster | What it verifies |
| --- | --- | --- |
| `excalidraw-0436ad0-desktop.jpg` | 1440 × 900 | Two rectangles, two labels, one arrow; drawing survived reload. |
| `excalidraw-0436ad0-export.jpg` | 1440 × 900 | Original image export preview and controls with correct Assistant typography. |
| `excalidraw-0436ad0-tablet.jpg` | 768 × 1024 | Original tablet toolbar and drawing fitted with Shift+1. |
| `excalidraw-0436ad0-mobile.jpg` | 390 × 844 | Original mobile toolbar and complete fitted drawing. |
| `excalidraw-0436ad0-catalog-copy.jpg` | 1440 × 900 | Independent copied app drew a labeled rectangle and retained it after reload. |

## Results and review

- Passed: source archive checksum, frozen registry-only install, native production build and upstream TypeScript check; Anybuild 0.26.4 direct and monorepo plans.
- Passed: 1,643 local HTTP asset/notice byte checks, four content-versioned font URL/MIME/hash checks, and three build-only paths returning 404.
- Passed: final deployment serves all four exact upstream Assistant font weights through revisioned URLs; previous missing-font/serif fallback was corrected without changing components or styles.
- Passed: actual computer-use drawing, reload persistence, export preview, viewport fit, and independent-copy drawing/persistence.
- Passed: ordinary Microsoft Edge exported a visually verified 340 × 190 PNG, 17,132 bytes, on initial source `7b7afb4`; later fixes only package/version UI fonts and do not change drawing/export logic.
- Passed: rendered comparison of all five screenshots to upstream `excalidraw-app/App.tsx`, `packages/excalidraw` toolbar/menu/export components and styles; no replacement controls, styling overrides, or Wasmer branding were added. Independent recipe/design review found no blockers.
- Single-user configuration uses the upstream collaboration guard, supported `aiEnabled`/export options, and removal of unavailable AI plugins; collaboration, server sharing, Firebase, and AI services remain unconfigured.
- Limits: embedded-browser native file save/clipboard APIs remained pending; ordinary-browser PNG save passed. Local scene import, SVG download, and a complete local Anybuild runtime build were not run.
