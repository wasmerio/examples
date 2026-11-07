"""Serve Netron's unchanged model viewer with an included ONNX example."""

import os
from pathlib import Path

import netron


def main():
    model = Path(__file__).parent / "samples" / "tiny-classifier.onnx"
    port = int(os.environ.get("PORT", "8080"))
    netron.start(str(model), address=("0.0.0.0", port), browse=False)
    netron.wait()


if __name__ == "__main__":
    main()
