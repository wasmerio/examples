from io import BytesIO

import pytest
import requests
from fastapi.testclient import TestClient
from PIL import Image

import main

IMAGE_URL = "https://images.example/photo.png"


def sample_png(size=(400, 200), mode="RGBA") -> bytes:
    buffer = BytesIO()
    Image.new(mode, size, (200, 80, 40, 255) if mode == "RGBA" else (200, 80, 40)).save(buffer, "PNG")
    return buffer.getvalue()


class FakeResponse:
    def __init__(self, body: bytes, status: int = 200):
        self.body, self.status_code = body, status
        self.headers = {"content-type": "image/png", "content-length": str(len(body))}

    def __enter__(self):
        return self

    def __exit__(self, *exc):
        return False

    def raise_for_status(self):
        if self.status_code >= 400:
            raise requests.HTTPError(response=self)

    def iter_content(self, chunk_size):
        for start in range(0, len(self.body), chunk_size):
            yield self.body[start : start + chunk_size]


@pytest.fixture
def client():
    return TestClient(main.app)


@pytest.fixture
def remote_image(monkeypatch):
    monkeypatch.setattr(main.requests, "get", lambda *args, **kwargs: FakeResponse(sample_png()))


def opened(response) -> Image.Image:
    return Image.open(BytesIO(response.content))


def test_index_and_static_assets(client):
    page = client.get("/")
    assert page.status_code == 200 and 'action="/api/edit"' in page.text
    assert client.get("/static/wasmer-starter-ui.js").status_code == 200


def test_upload_rotate_crop_resize_convert(client):
    response = client.post(
        "/api/edit",
        data={"rotate": "90", "crop": "0,0,200,300", "width": "100", "format": "jpeg"},
        files={"file": ("photo.png", sample_png(), "image/png")},
    )
    assert response.status_code == 200
    assert response.headers["content-type"] == "image/jpeg"
    image = opened(response)
    assert image.format == "JPEG" and image.mode == "RGB"
    assert image.size == (100, 150)
    assert response.headers["x-image-width"] == "100" and response.headers["x-image-height"] == "150"


@pytest.mark.parametrize(("image_format", "pillow_name"), [("png", "PNG"), ("webp", "WEBP")])
def test_url_source_and_formats(client, remote_image, image_format, pillow_name):
    response = client.post("/api/edit", data={"url": IMAGE_URL, "height": "50", "format": image_format})
    assert response.status_code == 200
    image = opened(response)
    assert image.format == pillow_name and image.size == (100, 50)


def test_legacy_process_route_still_returns_png(client, remote_image):
    response = client.get("/process", params={"url": IMAGE_URL, "rotate": 45})
    assert response.status_code == 200
    assert response.headers["content-type"] == "image/png"
    assert opened(response).size == (200, 200)


@pytest.mark.parametrize(
    ("data", "field"),
    [
        ({"url": IMAGE_URL, "crop": "1,2,3"}, "crop"),
        ({"url": IMAGE_URL, "crop": "10,10,5,20"}, "crop"),
        ({"url": IMAGE_URL, "rotate": "720"}, "rotate"),
        ({"url": IMAGE_URL, "width": "0"}, "width"),
        ({"url": IMAGE_URL, "width": str(main.MAX_OUTPUT_SIDE + 1)}, "width"),
        ({"url": IMAGE_URL, "format": "gif"}, "format"),
        ({"url": "file:///etc/passwd"}, "url"),
    ],
)
def test_invalid_options_are_422(client, data, field):
    response = client.post("/api/edit", data=data)
    assert response.status_code == 422
    assert response.json()["detail"][0]["loc"][-1] == field


def test_legacy_route_rejects_bad_crop(client):
    response = client.get("/process", params={"url": IMAGE_URL, "crop": "a,b,c,d"})
    assert response.status_code == 422


def test_missing_source(client):
    response = client.post("/api/edit", data={"rotate": "10"})
    assert response.status_code == 422
    assert response.json()["detail"] == "Add an image URL or upload an image."


def test_crop_outside_image(client, remote_image):
    response = client.post("/api/edit", data={"url": IMAGE_URL, "crop": "0,0,900,100"})
    assert response.status_code == 422
    assert "400×200" in response.json()["detail"]


def test_not_an_image(client):
    response = client.post("/api/edit", files={"file": ("notes.txt", b"hello", "text/plain")})
    assert response.status_code == 415


def test_upload_too_large(client):
    big = b"0" * (main.MAX_INPUT_BYTES + 1)
    response = client.post("/api/edit", files={"file": ("big.png", big, "image/png")})
    assert response.status_code == 413


def test_decompression_bomb(client, monkeypatch):
    monkeypatch.setattr(main.Image, "MAX_IMAGE_PIXELS", 1000)
    response = client.post("/api/edit", files={"file": ("photo.png", sample_png(), "image/png")})
    assert response.status_code == 413


@pytest.mark.parametrize(
    ("fake", "status"),
    [
        (lambda *a, **k: FakeResponse(b"", status=404), 400),
        (lambda *a, **k: FakeResponse(b"x" * (main.MAX_INPUT_BYTES + 1)), 413),
    ],
)
def test_download_errors(client, monkeypatch, fake, status):
    monkeypatch.setattr(main.requests, "get", fake)
    assert client.post("/api/edit", data={"url": IMAGE_URL}).status_code == status


def test_download_timeout(client, monkeypatch):
    def slow(*args, **kwargs):
        raise requests.Timeout()

    monkeypatch.setattr(main.requests, "get", slow)
    assert client.post("/api/edit", data={"url": IMAGE_URL}).status_code == 504
