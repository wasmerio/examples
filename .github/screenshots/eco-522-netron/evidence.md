# ECO-522: Netron deployment evidence

- Application source commit: `a40e3a5ea95f0faed3396cbfdbf7d9323fbdbd46`.
- Canonical UI: the unchanged Netron 9.3.5 interface from the pinned Python wheel.
- Production demo: <https://netron-template.wasmer.app/>.
- Demo build: `998d0476-d04b-447e-a95f-fa4b86d0751f`; deployment version:
  `dav_nYYILt9uLvoB`.
- Remote build: Anybuild 0.33.2; completed in 22 seconds.
- Catalog entry: <https://wasmer.io/templates/netron> (`at_3KwGIWtBCBpK`).
- Independent catalog-created app: <https://netron-copy-1106.wasmer.app/>;
  build `c7fd657b-b114-4154-bfb4-ccefd00b0926`.
- Captured on November 6, 2026, against the deployed application source above.
- The evidence commit adds only these images and this document. No application
  files or upstream UI styles change after the captured source commit.

| Screenshot | Configured CSS viewport | Image raster | Verified state |
| --- | --- | --- | --- |
| `netron-a40e3a5-desktop.jpg` | 1440 × 900 | 1440 × 942 | Four-operation model graph |
| `netron-a40e3a5-weights.jpg` | 1440 × 900 | 1440 × 942 | MatMul properties and float32 3 × 2 weights |
| `netron-a40e3a5-tablet.jpg` | 768 × 1024 | 768 × 1066 | Graph at tablet width |
| `netron-a40e3a5-mobile.jpg` | 390 × 844 | 390 × 886 | Graph at mobile width |
| `netron-a40e3a5-catalog-copy.jpg` | 1280 × 720 | 1280 × 762 | Independent app created through catalog Deploy |

The screenshot tool produced image rasters 42 pixels taller than the configured
CSS viewports. Widths match. The two sizes are recorded separately above.

## Results and limits

- Passed: the public demo loads MatMul → Add → Relu → Softmax and exposes the
  sample's layer properties and weights.
- Passed: the actual catalog Deploy flow creates an independent app whose
  browser view displays all four operations.
- Passed: desktop, tablet, and mobile rendered checks against the upstream UI;
  no replacement controls, cards, colors, typography, or page-local overrides.
- Failed locally: Anybuild's build encountered the existing path-with-spaces
  issue in this workspace; the remote Anybuild build and deployment passed.
- Not run: opening an additional model using Netron's local-file Open action.
- No database, GPU, API key, or persistent volume was required.
