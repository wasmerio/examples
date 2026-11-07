# go-httpbin verification evidence

- Application source: `cb02c87c5cc3440cf9543dcf6cad4ac6cec0136a`.
- Hosted preview: https://go-httpbin-template.wasmer.app/.
- Hosted build: `ba110ced-402c-4a7a-8af3-d249216680c8`, 36 seconds.
- Application version: `dav_nX3IVt3u0yE5`.
- Public catalog: https://wasmer.io/templates/go-httpbin (`at_mRMMIrtkCvMR`).
- Independent catalog copy: https://go-httpbin-copy-1106.wasmer.app/, build `89c822d6-38b4-4e80-9bf0-412110c20f9b`, 21 seconds.
- Evidence commits add screenshots and this record without changing application source.

## Rendered states

| File | Raster size | What it verifies |
| --- | --- | --- |
| `go-httpbin-cb02c87-desktop.jpg` | 1425 × 802 | Original upstream endpoint directory; requested desktop viewport was 1440 × 900. |
| `go-httpbin-cb02c87-form.jpg` | 1440 × 900 | Original POST form with fake input, checked radio/checkbox, focused instructions field, and submit action. |
| `go-httpbin-cb02c87-tablet.jpg` | 768 × 1024 | The same upstream form fits the tablet viewport. |
| `go-httpbin-cb02c87-mobile.jpg` | 390 × 844 | The same upstream form fits the mobile viewport. |
| `go-httpbin-cb02c87-catalog-copy.jpg` | 1440 × 810 | Independently deployed catalog copy with fake form inputs; requested viewport was 1440 × 900. |

## Results and limits

- Native Go and Wasmer 7.4.2 each passed nine actual HTTP cases; the same nine checks also passed against the hosted SDK deployment.
- Cases cover home, GET/query/header inspection, JSON POST, reflected header filtering, relative redirects, 204, 418, and allowed/blocked external redirects.
- Computer-use testing submitted fake form values and confirmed that name, size, topping, and comments were echoed exactly.
- The independent catalog deployment passed the same nine HTTP cases and a separate browser form submission with four expected fake fields.
- `http-smoke-copy.json` preserves sanitized test metadata and the result summary; no raw HTTP responses are stored.
- Raw POST response screenshots are intentionally excluded because responses contain request network metadata. The attached images contain only generic upstream documentation and fake form inputs.
- Rendered review covers the endpoint directory on desktop and the POST form at desktop/tablet/mobile sizes. It does not establish that every upstream endpoint or long directory link is responsive on mobile.
- WebSocket echo, streaming, and the rest of the upstream endpoint catalog were not tested.

## Canonical UI references

- [Upstream v2.25.0 endpoint directory and styles](https://github.com/mccutchen/go-httpbin/blob/v2.25.0/httpbin/static/index.html.tmpl).
- [Upstream v2.25.0 POST form](https://github.com/mccutchen/go-httpbin/blob/v2.25.0/httpbin/static/forms-post.html.tmpl).
- The Go wrapper imports the upstream handler directly. It adds no HTML, CSS, replacement controls, or style overrides.
