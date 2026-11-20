import io
import resource
import sys
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
    assert client.get("/wasmer-starter-ui.js").status_code == 200


def png(image):
    buffer = io.BytesIO()
    image.save(buffer, "PNG")
    buffer.seek(0)
    return buffer


def peak_rss_mb():
    peak = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
    return peak / (1024 * 1024) if sys.platform == "darwin" else peak / 1024


@pytest.mark.parametrize("size", [(1, 100_000), (100_000, 1)])
def test_extreme_aspect_ratio_stays_small(client, size):
    before = peak_rss_mb()
    response = client.post("/api/classify", data={"image": (png(Image.new("RGB", size)), "thin.png")})
    assert response.status_code == 200
    # The old resize-then-crop path allocated a 256 x 25.6M pixel intermediate (~20 GB).
    assert peak_rss_mb() - before < 100


def test_center_crop_matches_reference_preprocessing():
    image = Image.open(SAMPLES / "coffee.jpg").convert("RGB")
    scale = main.RESIZE_SHORT_SIDE / min(image.size)
    reference = image.resize((round(image.width * scale), round(image.height * scale)), Image.Resampling.BILINEAR)
    left, top = (reference.width - 224) // 2, (reference.height - 224) // 2
    reference = reference.crop((left, top, left + 224, top + 224))
    expected = (np.asarray(reference, dtype=np.float32) / 255.0 - main.MEAN) / main.STD
    assert np.abs(main.preprocess(image)[0].transpose(1, 2, 0) - expected).mean() < 0.05


@pytest.mark.filterwarnings("ignore::PIL.Image.DecompressionBombWarning")
@pytest.mark.parametrize("size", [(6000, 5000), (8000, 8000)])  # our check, then Pillow's 2x error
def test_rejects_decompression_bombs(client, size):
    response = client.post("/api/classify", data={"image": (png(Image.new("1", size)), "bomb.png")})
    assert response.status_code == 413
    assert "megapixels" in response.get_json()["error"]
