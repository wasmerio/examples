"""Semantic search over documents.json with all-MiniLM-L6-v2 (ONNX), served over HTTP."""

import hashlib
import json
import os
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

import numpy as np
import onnxruntime as ort
from tokenizers import Tokenizer

ROOT = Path(__file__).parent
MODEL_PATH = ROOT / "model" / "model_quantized.onnx"
TOKENIZER_PATH = ROOT / "model" / "tokenizer.json"
DOCUMENTS_PATH = Path(os.environ.get("DOCUMENTS_PATH", ROOT / "documents.json"))
EMBEDDINGS_PATH = DOCUMENTS_PATH.with_suffix(".npz")  # written by build_embeddings.py
STATIC_FILES = {
    "/": (ROOT / "static" / "index.html", "text/html; charset=utf-8"),
    "/wasmer-starter-ui.js": (ROOT / "static" / "wasmer-starter-ui.js", "text/javascript; charset=utf-8"),
}

MAX_TOKENS = 256  # all-MiniLM-L6-v2 truncates input at 256 word pieces
BATCH_SIZE = 32
DEFAULT_RESULTS = 5
MAX_RESULTS = 20
MIN_SCORE = 0.25  # results below this cosine similarity are treated as unrelated
MAX_QUERY_CHARS = 500


def mean_pool(token_embeddings, attention_mask):
    """Average token vectors, ignoring padding (the model card's pooling recipe)."""
    mask = attention_mask[..., None].astype(token_embeddings.dtype)
    return (token_embeddings * mask).sum(axis=1) / np.clip(mask.sum(axis=1), 1e-9, None)


def normalize(vectors):
    """Scale each row to unit length so a dot product equals cosine similarity."""
    return vectors / np.clip(np.linalg.norm(vectors, axis=1, keepdims=True), 1e-12, None)


class Embedder:
    def __init__(self):
        self.tokenizer = Tokenizer.from_file(str(TOKENIZER_PATH))
        self.tokenizer.enable_truncation(MAX_TOKENS)
        self.tokenizer.enable_padding()
        self.session = ort.InferenceSession(str(MODEL_PATH), providers=["CPUExecutionProvider"])

    def __call__(self, texts):
        chunks = []
        for start in range(0, len(texts), BATCH_SIZE):
            encodings = self.tokenizer.encode_batch(texts[start : start + BATCH_SIZE])
            inputs = {
                "input_ids": np.array([e.ids for e in encodings], dtype=np.int64),
                "attention_mask": np.array([e.attention_mask for e in encodings], dtype=np.int64),
                "token_type_ids": np.array([e.type_ids for e in encodings], dtype=np.int64),
            }
            (token_embeddings,) = self.session.run(None, inputs)
            chunks.append(mean_pool(token_embeddings, inputs["attention_mask"]))
        return normalize(np.concatenate(chunks))


def fingerprint(documents):
    """Identify the documents and model that a set of precomputed embeddings belongs to."""
    return hashlib.sha256(json.dumps([MODEL_PATH.name, documents]).encode()).hexdigest()


def cached_vectors(documents):
    """Return precomputed embeddings if they match the current documents, else None."""
    if not EMBEDDINGS_PATH.exists():
        return None
    with np.load(EMBEDDINGS_PATH) as cache:
        return cache["vectors"] if cache["fingerprint"] == fingerprint(documents) else None


class SearchIndex:
    def __init__(self, embedder, documents, vectors=None):
        self.embed = embedder
        self.documents = documents
        if vectors is None:
            vectors = embedder([f"{d['title']}: {d['text']}" for d in documents])
        self.vectors = vectors

    def search(self, query, limit=DEFAULT_RESULTS):
        scores = self.vectors @ self.embed([query])[0]
        best = np.argsort(-scores)[:limit]
        return [
            {**self.documents[i], "score": round(float(scores[i]), 4)}
            for i in best
            if scores[i] >= MIN_SCORE
        ]


def make_handler(index):
    static = {route: (path.read_bytes(), content_type) for route, (path, content_type) in STATIC_FILES.items()}

    class Handler(BaseHTTPRequestHandler):
        def do_GET(self):
            url = urlparse(self.path)
            if url.path in static:
                return self.reply(200, *static[url.path])
            if url.path != "/api/search":
                return self.reply_json(404, {"error": "Not found"})
            params = parse_qs(url.query)
            query = params.get("q", [""])[0].strip()
            if not query or len(query) > MAX_QUERY_CHARS:
                return self.reply_json(400, {"error": f"q must be 1-{MAX_QUERY_CHARS} characters"})
            try:
                limit = min(max(int(params.get("k", [DEFAULT_RESULTS])[0]), 1), MAX_RESULTS)
            except ValueError:
                return self.reply_json(400, {"error": "k must be an integer"})
            started = time.perf_counter()
            results = index.search(query, limit)
            took_ms = round((time.perf_counter() - started) * 1000, 1)
            self.reply_json(200, {"query": query, "results": results, "took_ms": took_ms})

        do_HEAD = do_GET

        def reply_json(self, status, payload):
            self.reply(status, json.dumps(payload).encode(), "application/json")

        def reply(self, status, body, content_type):
            self.send_response(status)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            if self.command != "HEAD":
                self.wfile.write(body)

    return Handler


def load_documents():
    return json.loads(DOCUMENTS_PATH.read_text(encoding="utf-8"))


def main():
    started = time.perf_counter()
    documents = load_documents()
    vectors = cached_vectors(documents)
    index = SearchIndex(Embedder(), documents, vectors)
    source = "precomputed" if vectors is not None else "embedded at startup"
    print(f"Indexed {len(documents)} documents ({source}) in {time.perf_counter() - started:.2f}s", flush=True)
    port = int(os.environ.get("PORT", "8080"))
    ThreadingHTTPServer(("0.0.0.0", port), make_handler(index)).serve_forever()


if __name__ == "__main__":
    main()
