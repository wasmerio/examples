# Netron model viewer on Wasmer

Explore an AI model as an interactive graph with [Netron](https://github.com/lutzroeder/netron). This template opens a small ONNX classifier immediately and keeps Netron's upstream interface unchanged.

## Demo

Deploy your own copy, open its URL, and select a layer to inspect its inputs, outputs and weights. Use Netron's **Open** action to inspect a model from your computer; the browser handles local model files.

The included graph has four operations: **MatMul → Add → Relu → Softmax**. Its illustrative weights are original to this template. It demonstrates model inspection, not training or inference.

## How it works

- `requirements.txt` pins Netron **9.3.5**, a Python wheel with no runtime dependencies.
- `main.py` starts Netron on `0.0.0.0` and reads `PORT`, defaulting to `8080`.
- `samples/tiny-classifier.onnx` opens by default. It can be regenerated with `python samples/create_sample.py`, using only Python's standard library.
- `Anybuild` selects the Python runtime and `python main.py` start command. The repository-root `Anybuild.python-netron` provides the same configuration when Anybuild 0.26.4 builds this monorepo with `--subdir python-netron`.

No database, GPU, API key or persistent volume is required. Browser-opened files are not saved to the server, so this is not a shared model-storage service.

## Running locally

Use Python 3.13 and create a virtual environment:

```bash
cd python-netron
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
PORT=8080 .venv/bin/python main.py
```

Open <http://localhost:8080/>. A different `PORT` can be supplied for local development.

## Deploying to Wasmer

1. Import `https://github.com/wasmerio/examples` in Wasmer and set the root directory to `python-netron`, or upload the contents of this directory as a folder.
2. Keep the Python preset and start command `python main.py`. This example does not need database or secret configuration.
3. Deploy and open the resulting app URL. The four-layer sample should appear automatically.

For a CLI build with Anybuild 0.26.4:

```bash
cd python-netron
anybuild plan . --wasmer
anybuild . --wasmer --start
```

The second command builds and runs locally with Wasmer; it does not publish the app. Keep the `Anybuild` file with the source so the runtime and start command remain explicit.

From the repository root, inspect the monorepo configuration with `anybuild plan . --subdir python-netron --wasmer`. Folder uploads only need the self-contained `python-netron` directory.

## License and upstream

[Netron](https://github.com/lutzroeder/netron) is created by Lutz Roeder and is distributed under the [MIT license](https://github.com/lutzroeder/netron/blob/main/LICENSE). The template and generated sample use the same license; see [LICENSE](LICENSE). No Netron source or visual styles are changed. Other models opened by a user retain their own licenses.
