import json
import threading
import urllib.error
import urllib.request
from http.server import ThreadingHTTPServer

import numpy as np
import pytest

import main


@pytest.fixture(scope="module")
def index():
    documents = main.load_documents()
    return main.SearchIndex(main.Embedder(), documents)


def test_mean_pool_ignores_padding():
    tokens = np.array([[[1.0, 2.0], [3.0, 4.0], [100.0, 100.0]]])
    mask = np.array([[1, 1, 0]])
    np.testing.assert_allclose(main.mean_pool(tokens, mask), [[2.0, 3.0]])


def test_normalize_gives_unit_vectors():
    vectors = main.normalize(np.array([[3.0, 4.0], [0.0, 2.0]]))
    np.testing.assert_allclose(np.linalg.norm(vectors, axis=1), [1.0, 1.0])
    np.testing.assert_allclose(vectors[0], [0.6, 0.8])


def test_embeddings_are_normalized_and_ignore_batch_padding(index):
    batch = index.embed(["cold start", "cold start and a much longer second sentence"])
    alone = index.embed(["cold start"])
    assert batch.shape == (2, 384)
    np.testing.assert_allclose(np.linalg.norm(batch, axis=1), 1.0, rtol=1e-5)
    # The quantized model scales activations per batch, so allow a small drift.
    assert batch[0] @ alone[0] > 0.98


@pytest.mark.parametrize(
    "query, expected",
    [
        ("undo a broken release", "Rollback"),
        ("my app is slow on the first request", "Cold start"),
        ("which websites may call my API from JavaScript", "CORS"),
    ],
)
def test_query_ranks_known_document_first(index, query, expected):
    results = index.search(query)
    assert results[0]["title"] == expected
    assert results == sorted(results, key=lambda r: -r["score"])


def test_unrelated_query_returns_no_results(index):
    assert index.search("banana bread recipe") == []


def test_precomputed_embeddings_match_documents(index):
    cached = main.cached_vectors(index.documents)
    assert cached is not None, "documents.npz is stale: run python build_embeddings.py"
    np.testing.assert_allclose(cached, index.vectors, atol=1e-4)


def test_search_api(index):
    server = ThreadingHTTPServer(("127.0.0.1", 0), main.make_handler(index))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{server.server_port}"
    try:
        with urllib.request.urlopen(f"{base}/") as response:
            assert b'src="/wasmer-starter-ui.js"' in response.read()
        with urllib.request.urlopen(f"{base}/wasmer-starter-ui.js") as response:
            assert response.headers["Content-Type"].startswith("text/javascript")
        with urllib.request.urlopen(f"{base}/api/search?q=undo+a+broken+release&k=2") as response:
            body = json.load(response)
        assert [r["title"] for r in body["results"]][0] == "Rollback"
        assert len(body["results"]) <= 2
        with pytest.raises(urllib.error.HTTPError) as error:
            urllib.request.urlopen(f"{base}/api/search?q=")
        assert error.value.code == 400
    finally:
        server.shutdown()
