# Semantic search on Wasmer

Search a set of short documents by meaning instead of keywords. Each document and each query is embedded with [all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2), and results are ranked by cosine similarity. The model runs on the server with ONNX Runtime; there is no external API, GPU or database.

## Demo

<https://semantic-search-template.wasmer.app/>

Try `undo a broken release` or `my app is slow on the first request`. The JSON API is available at `GET /api/search?q=your+query&k=5`:

```json
{"query": "undo a broken release", "results": [{"title": "Rollback", "text": "Returning an application to a previous known-good release after a bad deploy.", "score": 0.5956}], "took_ms": 8.1}
```

`k` sets the number of results (1–20, default 5). Results below a cosine similarity of 0.25 are dropped, so an unrelated query returns an empty list.

## How it works

- `documents.json` holds 86 cloud and WebAssembly glossary entries, each with a `title` and `text`. They were written for this template.
- `model/` contains the 8-bit quantized ONNX export of all-MiniLM-L6-v2 (`model_quantized.onnx`, 23 MB) and its `tokenizer.json`, from [Xenova/all-MiniLM-L6-v2](https://huggingface.co/Xenova/all-MiniLM-L6-v2). On the bundled documents it returns the same top result as the 90 MB full-precision export for every test query and embeds about seven times faster.
- `main.py` tokenizes text with `tokenizers`, runs the model with `onnxruntime`, then applies the model card's mean pooling over the attention mask and L2 normalization with NumPy. No PyTorch or sentence-transformers is needed.
- `documents.npz` stores precomputed document embeddings plus a fingerprint of `documents.json`. At startup the server loads them when the fingerprint matches, and embeds the documents itself when it does not. Loading them cuts about 0.9 s from each cold start.
- `static/` holds the page and the shared Wasmer starter components; `main.py` serves both with Python's standard `http.server`.
- `Anybuild` selects the Python runtime and `python main.py` start command. The repository-root `Anybuild.python-semantic-search` provides the same configuration for monorepo builds with `--subdir python-semantic-search`.

## Use your own documents

1. Replace `documents.json` with a JSON array of objects that have `title` and `text` fields. Extra fields are returned unchanged in API results.
2. Run `python build_embeddings.py` to refresh `documents.npz`. Skipping this step still works; the app then embeds the documents at every start.

Set `DOCUMENTS_PATH` to read documents from another file; its embeddings are read from the same path with an `.npz` extension. The whole index is held in memory, which suits a few thousand short documents.

## Running locally

Use Python 3.13:

```bash
cd python-semantic-search
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt pytest
.venv/bin/python -m pytest
PORT=8080 .venv/bin/python main.py
```

Open <http://localhost:8080/>.

To run the WebAssembly build locally with Wasmer:

```bash
uvx pip install -r requirements.txt --index-url https://python-registry.wasmer.app/all/simple/ \
  --extra-index-url https://pypi.org/simple --platform wasix_wasm32 --python-version 3.13 \
  --only-binary=:all: --target ./pkgs
wasmer run python/python@=3.13.20 --volume ./pkgs:/packages --volume .:/app \
  --env PYTHONPATH=/packages --net -- /app/main.py
```

## Deploying to Wasmer

1. Import `https://github.com/wasmerio/examples` in Wasmer and set the root directory to `python-semantic-search`, or upload the contents of this directory as a folder.
2. Keep the Python preset and start command `python main.py`. No database or secrets are needed.
3. Deploy and open the app URL.

From the CLI:

```bash
cd python-semantic-search
wasmer deploy --build-remote
```

## License

The template code and `documents.json` are MIT licensed; see [LICENSE](LICENSE). The model files in `model/` are distributed under the Apache License 2.0 by their authors; see [model/LICENSE](model/LICENSE).
