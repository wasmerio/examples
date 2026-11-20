"""Image editor API: FastAPI + Pillow on Wasmer Edge.

Rotate, crop, resize and convert an image from a URL or an upload.

Routes:
    GET  /            HTML editor with a live preview
    POST /api/edit    multipart form (url or file + options), returns the edited image
    GET  /process     original query-string route: url, rotate, crop; returns PNG
    GET  /docs        interactive API docs
"""

from __future__ import annotations

import math
from io import BytesIO
from pathlib import Path
from typing import Annotated, Literal
from urllib.parse import urlsplit

from fastapi import FastAPI, Form, HTTPException, Query, Request, UploadFile
from fastapi.exceptions import RequestValidationError
from fastapi.responses import FileResponse, JSONResponse, Response
from fastapi.staticfiles import StaticFiles
from PIL import Image, ImageOps, UnidentifiedImageError
from pydantic import BaseModel, Field, ValidationError, field_validator

from fetch import FetchError, fetch

# Limits. Wasmer Edge instances have about 1 GB of memory. At 4 bytes per pixel, the
# pixel caps keep each decoded copy under ~100 MB while decoding, rotating and encoding.
MAX_INPUT_BYTES = 10 * 1024 * 1024  # largest download or upload
DOWNLOAD_TIMEOUT_SECONDS = 15  # total time allowed for a download
MAX_INPUT_PIXELS = 16_000_000  # checked from the header, before decoding
MAX_OUTPUT_PIXELS = 24_000_000  # largest canvas after rotate(expand=True)
MAX_OUTPUT_SIDE = 4096  # largest resize width or height
QUALITY = 85  # JPEG and WebP quality
FORMATS = {"png": "image/png", "jpeg": "image/jpeg", "webp": "image/webp"}

Image.MAX_IMAGE_PIXELS = MAX_INPUT_PIXELS
STATIC_DIR = Path(__file__).parent / "static"

app = FastAPI(
    title="Image editor API",
    description="Rotate, crop, resize and convert images with Pillow, running on Wasmer Edge.",
)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


@app.exception_handler(FetchError)
def fetch_error(_: Request, error: FetchError) -> JSONResponse:
    return JSONResponse({"detail": error.message}, status_code=error.status)


class EditOptions(BaseModel):
    url: str | None = Field(None, description="http(s) link to an image; ignored when a file is uploaded")
    rotate: float = Field(0, ge=-360, le=360, description="Degrees counter-clockwise; the canvas grows to fit")
    crop: str | None = Field(None, description="left,top,right,bottom in pixels, applied after rotation")
    width: int | None = Field(None, ge=1, le=MAX_OUTPUT_SIDE, description="Resize width; height follows if omitted")
    height: int | None = Field(None, ge=1, le=MAX_OUTPUT_SIDE, description="Resize height; width follows if omitted")
    format: Literal["png", "jpeg", "webp"] = "png"

    @field_validator("url", "crop", mode="before")
    @classmethod
    def blank_is_none(cls, value):
        return value.strip() or None if isinstance(value, str) else value

    @field_validator("url")
    @classmethod
    def http_url(cls, value: str | None) -> str | None:
        parts = urlsplit(value or "")
        if value and (parts.scheme not in ("http", "https") or not parts.netloc):
            raise ValueError("Enter a full http:// or https:// link to an image")
        return value

    @field_validator("crop")
    @classmethod
    def crop_box(cls, value: str | None) -> str | None:
        if value is None:
            return None
        try:
            left, top, right, bottom = (int(part) for part in value.split(","))
        except ValueError:
            raise ValueError("Crop must be four whole numbers: left,top,right,bottom") from None
        if min(left, top) < 0 or right <= left or bottom <= top:
            raise ValueError("Crop needs 0 ≤ left < right and 0 ≤ top < bottom")
        return f"{left},{top},{right},{bottom}"


def download(url: str) -> bytes:
    return fetch(url, max_bytes=MAX_INPUT_BYTES, timeout=DOWNLOAD_TIMEOUT_SECONDS)


def edit_image(data: bytes, options: EditOptions, pad_crop: bool = False) -> Image.Image:
    """Rotate, crop and resize. With pad_crop, a crop box outside the image is padded (the original behaviour)."""
    too_many_pixels = HTTPException(413, f"The image has more than {MAX_INPUT_PIXELS:,} pixels.")
    try:
        image = Image.open(BytesIO(data))  # reads only the header
        # Pillow only raises above 2 x MAX_IMAGE_PIXELS, so check the size before decoding.
        if image.width * image.height > MAX_INPUT_PIXELS:
            raise too_many_pixels
        image.load()
    except Image.DecompressionBombError:
        raise too_many_pixels from None
    except (UnidentifiedImageError, OSError):
        raise HTTPException(415, "That file is not an image Pillow can read.") from None
    image = ImageOps.exif_transpose(image)
    if options.rotate:
        angle = math.radians(options.rotate)
        cos, sin = abs(math.cos(angle)), abs(math.sin(angle))
        canvas = (image.width * cos + image.height * sin) * (image.width * sin + image.height * cos)
        if canvas > MAX_OUTPUT_PIXELS:
            raise HTTPException(413, f"Rotating this image would need more than {MAX_OUTPUT_PIXELS:,} pixels.")
        image = image.rotate(options.rotate, resample=Image.Resampling.BICUBIC, expand=True)
    if options.crop:
        box = tuple(int(part) for part in options.crop.split(","))
        if not pad_crop and (box[2] > image.width or box[3] > image.height):
            raise HTTPException(422, f"The crop box must fit inside the {image.width}×{image.height} image.")
        image = image.crop(box)
    if options.width or options.height:
        width = options.width or max(1, round(image.width * options.height / image.height))
        height = options.height or max(1, round(image.height * options.width / image.width))
        image = image.resize((width, height), Image.Resampling.LANCZOS)
    return image


def encode(image: Image.Image, image_format: str) -> Response:
    if image_format == "jpeg" and image.mode not in ("RGB", "L"):
        image = image.convert("RGB")
    buffer = BytesIO()
    image.save(buffer, format=image_format.upper(), quality=QUALITY)
    return Response(
        buffer.getvalue(),
        media_type=FORMATS[image_format],
        headers={
            "Content-Disposition": f'inline; filename="edited.{"jpg" if image_format == "jpeg" else image_format}"',
            "X-Image-Width": str(image.width),
            "X-Image-Height": str(image.height),
        },
    )


@app.post("/api/edit", response_class=Response, responses={200: {"content": {t: {} for t in FORMATS.values()}}})
def api_edit(options: Annotated[EditOptions, Form()], file: UploadFile | None = None) -> Response:
    """Edit an uploaded `file`, or the image at `url`. Steps run in order: rotate, crop, resize, convert."""
    if file and file.filename:
        data = file.file.read(MAX_INPUT_BYTES + 1)
        if len(data) > MAX_INPUT_BYTES:
            raise HTTPException(413, f"The image is larger than {MAX_INPUT_BYTES // 1024 // 1024} MB.")
    elif options.url:
        data = download(options.url)
    else:
        raise HTTPException(422, "Add an image URL or upload an image.")
    return encode(edit_image(data, options), options.format)


@app.get("/process", response_class=Response, responses={200: {"content": {"image/png": {}}}})
def process(url: str, rotate: float = Query(0), crop: str = "0,0,200,200") -> Response:
    """Original route of this example: rotate, then crop (padding outside the image), and return a PNG."""
    try:
        options = EditOptions(url=url, rotate=rotate, crop=crop)
    except ValidationError as error:
        raise RequestValidationError(error.errors(include_url=False, include_context=False)) from None
    if not options.url:
        raise HTTPException(422, "Add an image URL.")
    return encode(edit_image(download(options.url), options, pad_crop=True), "png")


@app.get("/", include_in_schema=False)
def index() -> FileResponse:
    return FileResponse(STATIC_DIR / "index.html")
