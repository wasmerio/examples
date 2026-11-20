# ONNX image classifier on Wasmer

Upload a photo, or pick a bundled sample, and get the five most likely [ImageNet](https://www.image-net.org/) labels with their confidences. The same classifier is available as a JSON API. Inference runs on the server with [ONNX Runtime](https://onnxruntime.ai/) and a bundled MobileNetV2 model, so no GPU, API key or outbound network call is needed.

## Demo

Live demo: <https://onnx-image-classifier-template.wasmer.app>

Click **Try the cat** or **Try the coffee** to classify a sample, or drop in your own image. From a terminal:

```bash
curl -F image=@photo.jpg https://onnx-image-classifier-template.wasmer.app/api/classify
```

```json
{"model": "mobilenetv2-12", "predictions": [{"label": "Egyptian cat", "confidence": 0.7103}, ...]}
```

Uploads that are not images return HTTP 400 and uploads over 10 MB return HTTP 413, both with an `error` field.

## How it works

- `main.py` is a small [Flask](https://flask.palletsprojects.com/) app. It loads the model once at startup with `onnxruntime.InferenceSession`, serves the page from `static/`, and handles `POST /api/classify` (multipart field `image`).
- The page in `static/index.html` is built from the shared Wasmer starter components. `static/wasmer-starter-ui.js` is a generated copy of `_shared/starter-ui/wasmer-starter-ui.js`; refresh it from the repository root with `node scripts/sync-starter-ui.mjs python-onnx-image-classifier/static/wasmer-starter-ui.js` instead of editing it.
- Preprocessing follows the ONNX model zoo's [`imagenet_preprocess.py`](https://github.com/onnx/models/blob/main/validated/vision/classification/imagenet_preprocess.py) using Pillow and numpy only: resize the short side to 256, center-crop 224×224, scale to `[0, 1]`, normalize with the ImageNet mean and standard deviation, and reorder to NCHW. A softmax over the 1,000 outputs gives the confidences.
- `model/mobilenetv2-12.onnx` (13.3 MB) and `model/synset.txt` (ImageNet labels) are bundled, so the app starts without downloading anything. Tunable values (input size, top-k, upload limit) live in one constants block at the top of `main.py`.
- On Wasmer Edge, `requirements.txt` is installed for the `wasix_wasm32` platform, which provides WASIX builds of numpy, Pillow and onnxruntime. `onnxruntime~=1.27.0` resolves to 1.27.1 on WASIX and 1.27.0 on PyPI. ONNX Runtime prints a harmless `Unsupported platform (wasi)` warning at startup.
- `Anybuild` selects Python 3.13 and the `python main.py` start command. The repository-root `Anybuild.python-onnx-image-classifier` provides the same configuration when building this monorepo with `--subdir python-onnx-image-classifier`.

Nothing is stored: uploads are classified in memory and discarded.

## Running locally

Use Python 3.13:

```bash
cd python-onnx-image-classifier
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt pytest
PORT=8080 .venv/bin/python main.py
```

Open <http://localhost:8080/>. Run the tests with `.venv/bin/python -m pytest`.

To run the same code under Wasmer's Python, install the WASIX wheels into `./pkgs` and mount them:

```bash
uvx pip install -r requirements.txt --index-url https://python-registry.wasmer.app/all/simple/ \
  --extra-index-url https://pypi.org/simple --platform wasix_wasm32 --python-version 3.13 \
  --only-binary=:all: --target ./pkgs
wasmer run python/python@=3.13.20 --volume ./pkgs:/packages --volume .:/app \
  --env PYTHONPATH=/packages --env PORT=8080 --net -- /app/main.py
```

## Deploying to Wasmer

1. Import `https://github.com/wasmerio/examples` in Wasmer and set the root directory to `python-onnx-image-classifier`, or upload the contents of this directory as a folder.
2. Keep the Python preset and start command `python main.py`. No database, secrets or volumes are needed.
3. Deploy and open the app URL, then click a sample.

With the Wasmer CLI, from this directory:

```bash
wasmer deploy --build-remote
```

To swap in another ImageNet classifier from the ONNX model zoo, replace the `.onnx` file and update `MODEL_PATH`. Models with different input sizes or normalization need the matching constants changed.

## License and sources

- Template code: Apache License 2.0, matching the bundled model; see [LICENSE](LICENSE).
- `model/mobilenetv2-12.onnx` and `model/synset.txt`: [ONNX model zoo, MobileNet v2-1.0 fp32](https://github.com/onnx/models/tree/main/validated/vision/classification/mobilenet), Apache License 2.0. SHA-256 of the model: `c0c3f76d93fa3fd6580652a45618618a220fced18babf65774ed169de0432ad5`.
- `static/samples/cat.jpg` ("chelsea", photo by Stefan van der Walt) and `static/samples/coffee.jpg` (photo by Rachel Michetti): from [scikit-image's sample data](https://github.com/scikit-image/scikit-image/blob/v0.19.3/skimage/data/_fetchers.py), released under CC0. Converted from PNG to JPEG.
