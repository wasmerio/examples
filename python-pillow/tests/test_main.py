from io import BytesIO

import pytest
import urllib3
from fastapi.testclient import TestClient
from PIL import Image

import main

IMAGE_URL = "https://images.example/photo.png"


def sample_png(size=(400, 200), mode="RGBA") -> bytes:
    buffer = BytesIO()
    Image.new(mode, size, (200, 80, 40, 255) if mode == "RGBA" else (200, 80, 40)).save(buffer, "PNG")
    return buffer.getvalue()


@pytest.fixture
def client():
    return TestClient(main.app)


@pytest.fixture
def remote_image(network):
    network.serve(sample_png(), content_type="image/png")
    return network


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


def test_legacy_route_pads_crop_on_small_images(client, network):
    network.serve(sample_png(size=(120, 80)), content_type="image/png")
    response = client.get("/process", params={"url": IMAGE_URL})
    assert response.status_code == 200
    assert opened(response).size == (200, 200)


def test_rotation_canvas_is_bounded(client, monkeypatch):
    monkeypatch.setattr(main, "MAX_OUTPUT_PIXELS", 90_000)
    data = {"rotate": "45"}
    response = client.post("/api/edit", data=data, files={"file": ("photo.png", sample_png(), "image/png")})
    assert response.status_code == 413


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
    # 400x200 = 80,000 pixels: above the cap, but below the 2x where Pillow itself raises.
    monkeypatch.setattr(main, "MAX_INPUT_PIXELS", 50_000)
    response = client.post("/api/edit", files={"file": ("photo.png", sample_png(), "image/png")})
    assert response.status_code == 413


@pytest.mark.parametrize(
    ("response", "status"),
    [
        ({"body": b"", "status": 404}, 400),
        ({"body": b"<html></html>", "content_type": "text/html"}, 415),
        ({"body": b"x" * (main.MAX_INPUT_BYTES + 1)}, 413),
    ],
)
def test_download_errors(client, network, response, status):
    network.serve(**response)
    result = client.post("/api/edit", data={"url": IMAGE_URL})
    assert result.status_code == status
    assert "404" not in result.json()["detail"]


def test_download_timeout(client, network):
    network.responses.append(urllib3.exceptions.ConnectTimeoutError())
    assert client.post("/api/edit", data={"url": IMAGE_URL}).status_code == 504


def test_connects_to_the_checked_address(client, remote_image):
    assert client.post("/api/edit", data={"url": IMAGE_URL}).status_code == 200
    assert remote_image.requests == [{"ip": "93.184.215.14", "path": "/photo.png", "host": "images.example"}]


@pytest.mark.parametrize(
    "url",
    [
        "http://127.0.0.1/a.png",
        "http://169.254.169.254/latest/meta-data/",
        "http://10.0.0.5/a.png",
        "http://[::1]/a.png",
        "http://[::ffff:192.168.1.1]/a.png",
        "http://224.0.0.1/a.png",
    ],
)
def test_private_addresses_are_rejected(client, network, url):
    response = client.post("/api/edit", data={"url": url})
    assert response.status_code == 422
    assert "private or local" in response.json()["detail"]
    assert network.requests == []


def test_redirect_to_private_address_is_rejected(client, network):
    network.serve(status=302, headers={"location": "http://169.254.169.254/latest/meta-data/"})
    response = client.post("/api/edit", data={"url": IMAGE_URL})
    assert response.status_code == 422
    assert len(network.requests) == 1


def test_redirects_are_followed_and_capped(client, network):
    network.serve(status=301, headers={"location": "/moved.png"})
    network.serve(sample_png(), content_type="image/png")
    assert client.post("/api/edit", data={"url": IMAGE_URL}).status_code == 200
    assert [r["path"] for r in network.requests] == ["/photo.png", "/moved.png"]

    for _ in range(5):
        network.serve(status=302, headers={"location": "/again"})
    response = client.post("/api/edit", data={"url": IMAGE_URL})
    assert response.status_code == 400 and "redirected" in response.json()["detail"]
