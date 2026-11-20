"""Classify images with MobileNetV2 (ONNX Runtime) and return the top ImageNet labels."""

import os
from pathlib import Path

import numpy as np
import onnxruntime as ort
from flask import Flask, jsonify, request
from PIL import Image, ImageOps, UnidentifiedImageError

ROOT = Path(__file__).parent
MODEL_PATH = ROOT / "model" / "mobilenetv2-12.onnx"
LABELS_PATH = ROOT / "model" / "synset.txt"
RESIZE_SHORT_SIDE = 256
CROP_SIZE = 224
MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
STD = np.array([0.229, 0.224, 0.225], dtype=np.float32)
TOP_K = 5
MAX_UPLOAD_BYTES = 10 * 1024 * 1024
# Decoded RGB at this size is ~75 MB, well inside the ~1 GB Edge instance limit.
MAX_IMAGE_PIXELS = 25_000_000

# Pillow raises DecompressionBombError above twice this; classify_upload rejects anything
# above it after reading only the header, before any pixels are decoded.
Image.MAX_IMAGE_PIXELS = MAX_IMAGE_PIXELS

session = ort.InferenceSession(str(MODEL_PATH), providers=["CPUExecutionProvider"])
input_name = session.get_inputs()[0].name
# Each line is "<wordnet id> <comma-separated names>"; keep the first name.
labels = [line.split(" ", 1)[1].split(",")[0] for line in LABELS_PATH.read_text().splitlines()]


def preprocess(image):
    """Normalize as in the ONNX model zoo's imagenet_preprocess.py.

    Resizing the short side to 256 and center-cropping 224 equals resizing the central
    square of side short * 224 / 256 straight to 224x224, so no intermediate is larger
    than the decoded image (capped by MAX_IMAGE_PIXELS), whatever the aspect ratio.
    """
    scale = RESIZE_SHORT_SIDE / min(image.size)
    # Let the JPEG decoder downscale by up to 8x while keeping the short side >= 256.
    image.draft("RGB", (round(image.width * scale), round(image.height * scale)))
    image = ImageOps.exif_transpose(image).convert("RGB")
    side = min(image.size) * CROP_SIZE / RESIZE_SHORT_SIDE
    left = (image.width - side) / 2
    top = (image.height - side) / 2
    image = image.resize(
        (CROP_SIZE, CROP_SIZE), Image.Resampling.BILINEAR, box=(left, top, left + side, top + side)
    )
    pixels = (np.asarray(image, dtype=np.float32) / 255.0 - MEAN) / STD
    return pixels.transpose(2, 0, 1)[np.newaxis]


def classify(image):
    logits = session.run(None, {input_name: preprocess(image)})[0][0]
    probabilities = np.exp(logits - logits.max())
    probabilities /= probabilities.sum()
    top = np.argsort(probabilities)[::-1][:TOP_K]
    return [{"label": labels[i], "confidence": round(float(probabilities[i]), 4)} for i in top]


app = Flask(__name__, static_folder="static", static_url_path="")
app.config["MAX_CONTENT_LENGTH"] = MAX_UPLOAD_BYTES


@app.get("/")
def index():
    return app.send_static_file("index.html")


@app.post("/api/classify")
def classify_upload():
    upload = request.files.get("image")
    if upload is None:
        return jsonify(error="Send an image file in the 'image' form field."), 400
    try:
        with Image.open(upload.stream) as image:
            if image.width * image.height > MAX_IMAGE_PIXELS:
                raise Image.DecompressionBombError
            predictions = classify(image)
    except Image.DecompressionBombError:
        return jsonify(error=f"Images must be at most {MAX_IMAGE_PIXELS // 1_000_000} megapixels."), 413
    except (UnidentifiedImageError, OSError):
        return jsonify(error="That file is not a readable image. Try a JPEG, PNG, GIF or WebP."), 400
    return jsonify(model=MODEL_PATH.stem, predictions=predictions)


@app.errorhandler(413)
def too_large(_error):
    return jsonify(error=f"Images must be {MAX_UPLOAD_BYTES // (1024 * 1024)} MB or smaller."), 413


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", "8080")))
