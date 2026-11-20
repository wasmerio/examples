# QR code toolkit on Wasmer

Generate QR codes from text or a URL, and read QR codes from photos. This template is a single page plus a small JSON API, written in Python with [segno](https://github.com/heuer/segno) for generation and OpenCV's built-in [`QRCodeDetector`](https://docs.opencv.org/4.x/de/dc3/classcv_1_1QRCodeDetector.html) for decoding.

## Demo

Live demo: <https://qr-toolkit-template.wasmer.app>

- **Generate:** enter text, choose PNG or SVG, the module size (1 to 20 px) and the error-correction level (L, M, Q or H), then download the code.
- **Decode:** upload a photo or screenshot, or select **Try sample photo**. The page shows the decoded text and outlines the code's corners on the image.

## How it works

- `main.py` is a [Starlette](https://www.starlette.io/) app served by uvicorn on `0.0.0.0`, reading `PORT` (default `8080`). Limits and options are constants at the top of the file.
- `POST /api/generate` takes JSON and returns the image:

  ```bash
  curl -X POST https://qr-toolkit-template.wasmer.app/api/generate \
    -H 'Content-Type: application/json' \
    -d '{"text": "https://wasmer.io", "format": "svg", "scale": 8, "error": "M"}' -o qr.svg
  ```

- `POST /api/decode` takes the image file as the request body (up to 8 MB) and returns the text, the four corner points and the bounding box in image pixels:

  ```bash
  curl -X POST https://qr-toolkit-template.wasmer.app/api/decode --data-binary @static/qr-photo.jpg
  # {"text":"https://wasmer.io","box":{"x":418,"y":245,"width":374,"height":414},"corners":[[453,245],...],"image":{"width":1200,"height":900}}
  ```

  An image without a QR code returns `422` with `{"error": "No QR code found in the image."}`; a file that is not an image returns `400`.
- `static/index.html` is the page. It uses the shared Wasmer starter components in `static/wasmer-starter-ui.js`, generated from `_shared/starter-ui/` at the repository root with `node scripts/sync-starter-ui.mjs python-qr-toolkit/static/wasmer-starter-ui.js`. There is no front-end build step.
- `static/qr-photo.jpg` is a synthetic photo of a printed code at an angle. `python create_sample.py` regenerates it.
- `Anybuild` selects the Python runtime and the `python main.py` start command. The repository-root `Anybuild.python-qr-toolkit` provides the same configuration when Anybuild builds this monorepo with `--subdir python-qr-toolkit`.

On Wasmer, `numpy` and `opencv-python-headless` install as WASIX builds from `https://python-registry.wasix.org/simple`; the other packages are pure Python from PyPI. Images are processed in memory and never stored. No database, API key or volume is required.

## Running locally

Use Python 3.13:

```bash
cd python-qr-toolkit
python3 -m venv .venv
.venv/bin/pip install -r requirements-dev.txt
.venv/bin/python -m pytest
PORT=8080 .venv/bin/python main.py
```

Open <http://localhost:8080/>.

To run the same code under Wasmer locally, install the WASIX wheels and mount them:

```bash
uvx pip install -r requirements.txt --index-url https://python-registry.wasmer.app/all/simple/ \
  --extra-index-url https://pypi.org/simple --platform wasix_wasm32 --python-version 3.13 \
  --only-binary=:all: --target ./pkgs
wasmer run python/python@=3.13.20 --volume ./pkgs:/packages --volume .:/app \
  --env PYTHONPATH=/packages --net -- /app/main.py
```

## Deploying to Wasmer

1. Import `https://github.com/wasmerio/examples` in Wasmer and set the root directory to `python-qr-toolkit`, or upload the contents of this directory as a folder.
2. Keep the Python preset and start command `python main.py`. No database or secrets are needed.
3. Deploy and open the app URL.

From the CLI:

```bash
cd python-qr-toolkit
wasmer deploy --build-remote
```

## License

The template code and sample image are original to this repository and released under the [MIT license](LICENSE). segno is BSD-3-Clause, OpenCV is Apache-2.0, and Starlette and uvicorn are BSD-3-Clause.
