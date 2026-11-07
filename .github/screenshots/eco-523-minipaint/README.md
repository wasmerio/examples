# miniPaint verification evidence

- Application source: `c2b4d75525785d211aeae1f840abf448cfcbe53c`.
- Hosted preview: https://minipaint-template.wasmer.app/?image=/sample.svg.
- Wasmer build: `3926112b-f1c8-4477-b40f-fb2652ed453a` (26 seconds).
- Application version: `dav_2dAIdtdu1pP0`.
- Catalog entry: https://wasmer.io/templates/minipaint.
- Independent catalog copy: https://minipaint-copy-1106.wasmer.app/?image=/sample.svg, build `6c2b62a8-9c73-4404-a467-05eb7b55d57f`.
- These screenshots and this record are added separately; application source is unchanged.

## Rendered states

| File | Viewport | What it verifies |
| --- | --- | --- |
| `minipaint-c2b4d75-desktop.jpg` | 1440 × 900 | The original sample loads with upstream menus, tools, and image information. |
| `minipaint-c2b4d75-edited.jpg` | 1440 × 900 | Applying Black & White changes the canvas and preview. |
| `minipaint-c2b4d75-export.jpg` | 1440 × 900 | Upstream PNG export dialog, selected format, and focused filename input. |
| `minipaint-c2b4d75-tablet.jpg` | 768 × 1024 | The edited canvas fits beside upstream tools and panels. |
| `minipaint-c2b4d75-mobile.jpg` | 390 × 844 | Upstream mobile menus render; the existing canvas zoom crops the image after resizing. |
| `minipaint-c2b4d75-mobile-fit.jpg` | 390 × 844 | Using upstream Fit shows the whole edited image on the smaller viewport. |
| `minipaint-c2b4d75-catalog-copy.jpg` | 1440 × 900 | An independently created catalog copy loads the complete sample and editor. |

## Results and limits

- Computer-use verification applied Black & White and downloaded a 21,659-byte PNG: 960 × 640 pixels, two grayscale colors.
- The browser reported zero console warnings or errors during that desktop workflow.
- Actual catalog deployment created a separate app and loaded the original 960 × 640 sample successfully.
- The deployed bundle matches the locally built upstream bundle byte-for-byte: SHA-256 `88789c0f547b1c6fd8969bff65ad6facf17af832ef8cde5172d0ef80b82a754d`.
- This is a desktop-first editor. Tablet and mobile evidence covers display and Fit only; touch editing and mobile export were not tested.
- The screenshots contain only original sample artwork and generic export data.

## Canonical UI references

- [Pinned upstream page](https://github.com/viliusle/miniPaint/blob/a79733eb803fc97084ef0ee4faa96b031e69e1c0/index.html).
- [Upstream layout and responsive rules](https://github.com/viliusle/miniPaint/blob/a79733eb803fc97084ef0ee4faa96b031e69e1c0/src/css/layout.css).
- [Upstream controls](https://github.com/viliusle/miniPaint/blob/a79733eb803fc97084ef0ee4faa96b031e69e1c0/src/css/component.css) and [dialogs](https://github.com/viliusle/miniPaint/blob/a79733eb803fc97084ef0ee4faa96b031e69e1c0/src/css/popup.css).
- No upstream HTML, controls, CSS, or visual tokens are changed. The template's only original visual is `sample.svg`.
