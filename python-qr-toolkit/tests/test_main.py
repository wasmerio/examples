from pathlib import Path

import cv2
import numpy as np
from starlette.testclient import TestClient

from main import app

client = TestClient(app)
SAMPLE = Path(__file__).parents[1] / "static" / "qr-photo.jpg"


def test_generate_then_decode_round_trip():
    text = "https://wasmer.io/templates?q=qr"
    generated = client.post("/api/generate", json={"text": text, "format": "png", "scale": 6, "error": "H"})
    assert generated.status_code == 200
    assert generated.headers["content-type"] == "image/png"

    decoded = client.post("/api/decode", content=generated.content)
    assert decoded.status_code == 200
    result = decoded.json()
    assert result["text"] == text
    assert len(result["corners"]) == 4
    assert result["box"]["width"] > 0 and result["box"]["height"] > 0


def test_serves_page_and_starter_components():
    assert "QR code toolkit" in client.get("/").text
    assert client.get("/wasmer-starter-ui.js").headers["content-type"].startswith("text/javascript")


def test_generate_svg():
    response = client.post("/api/generate", json={"text": "hello", "format": "svg"})
    assert response.status_code == 200
    assert response.headers["content-type"].startswith("image/svg+xml")
    assert b"<svg" in response.content


def test_generate_rejects_invalid_options():
    assert client.post("/api/generate", json={"text": ""}).status_code == 400
    assert client.post("/api/generate", json={"text": "x", "error": "Z"}).status_code == 400
    assert client.post("/api/generate", json={"text": "x", "scale": 99}).status_code == 400


def test_decode_sample_photo():
    response = client.post("/api/decode", content=SAMPLE.read_bytes())
    assert response.status_code == 200
    result = response.json()
    assert result["text"] == "https://wasmer.io"
    assert result["image"] == {"width": 1200, "height": 900}


def test_decode_image_without_qr_code_returns_clear_error():
    _, png = cv2.imencode(".png", np.full((200, 200, 3), 255, np.uint8))
    response = client.post("/api/decode", content=png.tobytes())
    assert response.status_code == 422
    assert response.json() == {"error": "No QR code found in the image."}


def test_decode_rejects_non_image():
    response = client.post("/api/decode", content=b"not an image")
    assert response.status_code == 400
    assert response.json() == {"error": "The file is not a readable image."}
