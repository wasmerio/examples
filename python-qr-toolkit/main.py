"""Generate QR codes with segno and decode them with OpenCV's QRCodeDetector."""

import io
import os
from pathlib import Path

MAX_IMAGE_PIXELS = 25_000_000
# OpenCV reads this limit once, when cv2 is imported; its default is 2**30 pixels.
os.environ.setdefault("OPENCV_IO_MAX_IMAGE_PIXELS", str(MAX_IMAGE_PIXELS))

import cv2  # noqa: E402
import numpy as np  # noqa: E402
import segno  # noqa: E402
import uvicorn  # noqa: E402
from PIL import Image  # noqa: E402
from starlette.applications import Starlette  # noqa: E402
from starlette.responses import JSONResponse, Response  # noqa: E402
from starlette.routing import Mount, Route  # noqa: E402
from starlette.staticfiles import StaticFiles  # noqa: E402

STATIC_DIR = Path(__file__).parent / "static"
MAX_TEXT_LENGTH = 2000
MAX_UPLOAD_BYTES = 8 * 1024 * 1024
SCALE_RANGE = range(1, 21)
ERROR_LEVELS = ("L", "M", "Q", "H")
FORMATS = {"png": "image/png", "svg": "image/svg+xml"}


def error(message, status=400):
    return JSONResponse({"error": message}, status_code=status)


async def generate(request):
    try:
        data = await request.json()
    except ValueError:
        return error("Send a JSON body.")
    if not isinstance(data, dict):
        return error("Send a JSON object.")
    text = str(data.get("text", "")).strip()
    kind = str(data.get("format", "png")).lower()
    level = str(data.get("error", "M")).upper()
    try:
        scale = int(data.get("scale", 8))
    except (TypeError, ValueError):
        scale = 0
    if not text or len(text) > MAX_TEXT_LENGTH:
        return error(f"Text must be 1 to {MAX_TEXT_LENGTH} characters.")
    if kind not in FORMATS:
        return error("Format must be png or svg.")
    if level not in ERROR_LEVELS:
        return error("Error correction must be L, M, Q or H.")
    if scale not in SCALE_RANGE:
        return error(f"Scale must be {SCALE_RANGE.start} to {SCALE_RANGE.stop - 1}.")
    try:
        qr = segno.make_qr(text, error=level, boost_error=False)
    except segno.DataOverflowError:
        return error("Text is too long for a QR code at this error correction level.")
    buffer = io.BytesIO()
    qr.save(buffer, kind=kind, scale=scale, border=4)
    return Response(
        buffer.getvalue(),
        media_type=FORMATS[kind],
        headers={"Content-Disposition": f'inline; filename="qr-code.{kind}"'},
    )


async def read_limited_body(request):
    """Return the request body, or None as soon as it exceeds MAX_UPLOAD_BYTES."""
    declared = request.headers.get("content-length", "")
    if declared.isdigit() and int(declared) > MAX_UPLOAD_BYTES:
        return None
    body = bytearray()
    async for chunk in request.stream():
        body += chunk
        if len(body) > MAX_UPLOAD_BYTES:
            return None
    return bytes(body)


def image_pixels(data):
    """Read the pixel count from the image header without decoding the pixels."""
    with Image.open(io.BytesIO(data)) as header:
        return header.width * header.height


async def decode(request):
    body = await read_limited_body(request)
    if body is None:
        return error(f"Image must be {MAX_UPLOAD_BYTES // 2**20} MB or smaller.", 413)
    if not body:
        return error("Upload an image as the request body.")
    too_large = error(f"Image must be {MAX_IMAGE_PIXELS // 10**6} megapixels or smaller.", 413)
    try:
        if image_pixels(body) > MAX_IMAGE_PIXELS:
            return too_large
    except Image.DecompressionBombError:
        return too_large
    except OSError:
        return error("The file is not a readable image.")
    image = cv2.imdecode(np.frombuffer(body, np.uint8), cv2.IMREAD_COLOR)
    if image is None:
        return error("The file is not a readable image.")
    text, points, _ = cv2.QRCodeDetector().detectAndDecode(image)
    if points is None:
        return error("No QR code found in the image.", 422)
    if not text:
        return error("A QR code was found but could not be decoded.", 422)
    corners = points.reshape(-1, 2).round().astype(int)
    x, y, width, height = cv2.boundingRect(corners)
    return JSONResponse(
        {
            "text": text,
            "box": {"x": x, "y": y, "width": width, "height": height},
            "corners": corners.tolist(),
            "image": {"width": image.shape[1], "height": image.shape[0]},
        }
    )


app = Starlette(
    routes=[
        Route("/api/generate", generate, methods=["POST"]),
        Route("/api/decode", decode, methods=["POST"]),
        Mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="static"),
    ]
)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", "8080")))
