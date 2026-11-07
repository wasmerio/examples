# IT-Tools deployment evidence

- Ticket: [ECO-526](https://linear.app/wasmer/issue/ECO-526/publish-it-tools-as-a-reusable-wasmer-app-template).
- App source: `926e104f72256b1492b595e3ac784ac0867b3b05`.
- Hosted demo: <https://it-tools-template.wasmer.app/>.
- Tested flow: <https://it-tools-template.wasmer.app/base64-string-converter/>.
- SDK build: `bd77be9e-04d8-4598-ad1b-ab9dda72a5e3`; succeeded in 56 seconds.
- App version: `dav_R8EIJtWulwPE`.
- Catalog: <https://wasmer.io/templates/it-tools>, ID `at_8RjPIgtMCmEK`.
- Independent catalog app: <https://it-tools-copy-1106.wasmer.app/>, ID `da_KN4IZtyUwowv`, version `dav_nBBIbtruZb8d`.
- Independent build: `ff82e1fc-9c2f-47c9-a058-ff68c8332633`; succeeded in 70 seconds.

## Core results

- Browser Base64 encode `Wasmer` → `V2FzbWVy` and decode back: passed.
- Browser SHA-256 for `Wasmer`: `4592dbc3bcfcd37cefb2d5aa98e826a25924123fe84d5aec949719ea8192f5a8`.
- Browser warnings/errors: 0/0 in the tested flows.
- Local frozen dependency installation, TypeScript and Vite production build: passed.
- Root plus all 94 direct tool routes: HTTP 200 on the local preview.
- Pinned source/unchanged license downloads, missing-asset HTTP 404 and corrupted-archive rejection: passed.

## Rendered review

- `it-tools-926e104-desktop.jpg`: 1440×900; Base64 form with the verified input/output.
- `it-tools-926e104-tablet.jpg`: 768×1024; form renders and the upstream header wraps.
- `it-tools-926e104-mobile.jpg`: 390×844; form fits the viewport with collapsed navigation.
- `it-tools-926e104-mobile-menu-open.jpg`: 390×844; upstream mobile navigation overlay.
- `it-tools-926e104-hash.jpg`: 1440×900; focused hash input and matching SHA-256 output.
- `it-tools-926e104-catalog-copy.jpg`: 1440×1000; independent app's encoder and decode input; decoded output is below the captured area.
- Canonical upstream commit: `d505845f918e946ec300af7b36efc107e2f66e9e`.
- References: `src/ui/c-card/c-card.vue`, `src/ui/c-input-text/c-input-text.vue`, `src/ui/c-button/c-button.vue`, `src/ui/c-select/c-select.vue` and `src/layouts/tool.layout.vue`.
- Upstream Vue/Naive UI components, controls, surfaces, colors, typography and styles remain unchanged; the template introduces no UI overrides.
- Baseline limitation: the upstream tablet header wraps its action icons and sponsor button. This is documented rather than redesigned.
- Not run: a full upstream accessibility/localization/disabled-state matrix or every utility.
- Independent creation from the public catalog: passed; browser encode `Wasmer` → `V2FzbWVy` and decode back to `Wasmer` both verified.
