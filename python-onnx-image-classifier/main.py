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

session = ort.InferenceSession(str(MODEL_PATH), providers=["CPUExecutionProvider"])
input_name = session.get_inputs()[0].name
# Each line is "<wordnet id> <comma-separated names>"; keep the first name.
labels = [line.split(" ", 1)[1].split(",")[0] for line in LABELS_PATH.read_text().splitlines()]


def preprocess(image):
    """Resize, center-crop and normalize as in the ONNX model zoo's imagenet_preprocess.py."""
    image = ImageOps.exif_transpose(image).convert("RGB")
    scale = RESIZE_SHORT_SIDE / min(image.size)
    image = image.resize(
        (round(image.width * scale), round(image.height * scale)), Image.Resampling.BILINEAR
    )
    left = (image.width - CROP_SIZE) // 2
    top = (image.height - CROP_SIZE) // 2
    image = image.crop((left, top, left + CROP_SIZE, top + CROP_SIZE))
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
            predictions = classify(image)
    except (UnidentifiedImageError, OSError):
        return jsonify(error="That file is not a readable image. Try a JPEG, PNG, GIF or WebP."), 400
    return jsonify(model=MODEL_PATH.stem, predictions=predictions)


@app.errorhandler(413)
def too_large(_error):
    return jsonify(error=f"Images must be {MAX_UPLOAD_BYTES // (1024 * 1024)} MB or smaller."), 413


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", "8080")))
