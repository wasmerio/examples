import io
from pathlib import Path

import numpy as np
import pytest
from PIL import Image

import main

SAMPLES = Path(main.app.static_folder) / "samples"


@pytest.fixture
def client():
    return main.app.test_client()


def test_preprocess_shape_and_normalization():
    tensor = main.preprocess(Image.new("RGB", (640, 480), (124, 116, 104)))
    assert tensor.shape == (1, 3, main.CROP_SIZE, main.CROP_SIZE)
    assert tensor.dtype == np.float32
    # A mid-grey close to the ImageNet mean normalizes to roughly zero.
    assert np.abs(tensor).max() < 0.05


def test_preprocess_converts_grayscale_and_alpha():
    for mode in ("L", "RGBA", "P"):
        assert main.preprocess(Image.new(mode, (100, 300))).shape == (1, 3, 224, 224)


@pytest.mark.parametrize("sample, expected", [("cat.jpg", "cat"), ("coffee.jpg", "espresso")])
def test_classify_bundled_samples(client, sample, expected):
    with open(SAMPLES / sample, "rb") as image:
        response = client.post("/api/classify", data={"image": (image, sample)})
    assert response.status_code == 200
    predictions = response.get_json()["predictions"]
    assert len(predictions) == main.TOP_K
    assert expected in predictions[0]["label"].lower()
    confidences = [p["confidence"] for p in predictions]
    assert confidences == sorted(confidences, reverse=True)
    assert 0 < sum(confidences) <= 1.0001


def test_rejects_non_image(client):
    response = client.post("/api/classify", data={"image": (io.BytesIO(b"hello"), "notes.txt")})
    assert response.status_code == 400
    assert "not a readable image" in response.get_json()["error"]


def test_requires_image_field(client):
    response = client.post("/api/classify", data={})
    assert response.status_code == 400


def test_rejects_oversized_upload(client):
    payload = io.BytesIO(b"0" * (main.MAX_UPLOAD_BYTES + 1))
    response = client.post("/api/classify", data={"image": (payload, "big.jpg")})
    assert response.status_code == 413
    assert "error" in response.get_json()


def test_index_and_samples_are_served(client):
    assert b"ONNX Image Classifier" in client.get("/").data
    assert client.get("/samples/cat.jpg").status_code == 200
