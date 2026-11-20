# Image editor API (FastAPI + Pillow) on Wasmer

Rotate, crop, resize and convert images between PNG, JPEG and WebP. Use the page for a live preview and a download, or call the documented JSON API. Images can come from a URL or an upload. Everything runs in one FastAPI app with [Pillow](https://pillow.readthedocs.io/) on Wasmer Edge.

## Demo

<https://pillow-image-editor-template.wasmer.app/>

The page opens with a sample photo from Lorem Picsum. Change any field and the preview updates.

## How it works

- `main.py` has the API. `EditOptions` is a Pydantic model that validates the form fields, so bad input gets a 422 with a message for each field.
- The image is read from the upload, or downloaded with `requests`, with a size limit and a timeout.
- Pillow applies the steps in this order: EXIF orientation (`ImageOps.exif_transpose`), rotate (counter-clockwise, and the canvas grows to fit), crop (on the rotated image), resize (if you give only a width or a height, the other follows the aspect ratio), then save as PNG, JPEG or WebP. Transparent images are flattened to RGB for JPEG.
- `static/index.html` is the editor. It posts the form to `/api/edit` 400 ms after you stop typing and shows the result.
- The page uses the shared Wasmer starter components in `static/wasmer-starter-ui.js`, generated from `_shared/starter-ui/` at the repository root.

The limits are one block of constants at the top of `main.py`:

| Constant | Default |
| --- | --- |
| `MAX_INPUT_BYTES` | 10 MB per download or upload |
| `DOWNLOAD_TIMEOUT_SECONDS` | 15 s |
| `MAX_INPUT_PIXELS` | 40 million (Pillow's decompression-bomb guard) |
| `MAX_OUTPUT_SIDE` | 4096 px for resize width or height |
| `QUALITY` | 85 for JPEG and WebP |

Errors come back as JSON `{"detail": ...}`: 422 for invalid fields, a missing image, or a crop box outside the image; 400 when the URL can't be downloaded; 413 for files that are too large; 415 when the file isn't an image; 504 when the download times out.

### API

`POST /api/edit` takes a `multipart/form-data` body and returns the edited image. The `X-Image-Width` and `X-Image-Height` headers give its size.

| Field | Meaning |
| --- | --- |
| `file` or `url` | The image. An upload wins over a URL. |
| `rotate` | Degrees counter-clockwise, −360 to 360 |
| `crop` | `left,top,right,bottom` in pixels |
| `width`, `height` | Output size, 1–4096 px |
| `format` | `png` (default), `jpeg` or `webp` |

```bash
curl -F url=https://picsum.photos/id/1015/1200/800 -F rotate=90 -F width=400 -F format=webp \
  https://pillow-image-editor-template.wasmer.app/api/edit -o edited.webp
curl -F file=@photo.jpg -F crop=0,0,500,500 -F format=png \
  https://pillow-image-editor-template.wasmer.app/api/edit -o cropped.png
```

The original route of this example still works: `GET /process?url=…&rotate=45&crop=0,0,200,200` returns a PNG. Interactive docs are at `/docs`.

The app downloads whatever public URL it's given. If you deploy it for others, keep the limits low or put it behind authentication.

## Running locally

Use Python 3.13:

```bash
cd python-pillow
python3 -m venv .venv
.venv/bin/pip install -r requirements-dev.txt
.venv/bin/uvicorn main:app --reload
```

Open <http://localhost:8000/>. Run the tests with `.venv/bin/python -m pytest`. They build images in memory and replace downloads with a fake response, so they don't use the network.

## Deploying to Wasmer

1. Import `https://github.com/wasmerio/examples` in Wasmer and set the root directory to `python-pillow`, or upload this directory.
2. Wasmer detects FastAPI and runs `uvicorn main:app`. Pillow installs from Wasmer's WASIX package index, so nothing else needs configuring.
3. Deploy and open the app URL.

With the CLI, from this directory:

```bash
wasmer deploy
```

No database, secrets or volumes are needed.
