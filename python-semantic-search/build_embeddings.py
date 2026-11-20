"""Precompute document embeddings so the server can skip embedding at startup.

Run after editing documents.json: python build_embeddings.py
"""

import numpy as np

import main

documents = main.load_documents()
index = main.SearchIndex(main.Embedder(), documents)
np.savez(main.EMBEDDINGS_PATH, vectors=index.vectors, fingerprint=main.fingerprint(documents))
print(f"Wrote {len(documents)} embeddings to {main.EMBEDDINGS_PATH.name}")
