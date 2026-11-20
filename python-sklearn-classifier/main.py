"""Serve the trained scikit-learn text classifier as a web page and a JSON API."""

import os
import warnings
from pathlib import Path

import joblib
from flask import Flask, jsonify, request, send_file
from sklearn.exceptions import InconsistentVersionWarning

from train import DATA_PATH, MODEL_PATH, build_pipeline, load_csv

MAX_CHARS = 2000
TOP_WORDS = 5


def load_pipeline():
    """Load a model saved by `train.py --save`, or fit one from the CSV (about 0.3 s on Edge)."""
    if not MODEL_PATH.exists():
        return build_pipeline().fit(*load_csv(DATA_PATH))
    # A pickle is only safe to load with the scikit-learn version that wrote it.
    with warnings.catch_warnings():
        warnings.simplefilter("error", InconsistentVersionWarning)
        return joblib.load(MODEL_PATH)


pipeline = load_pipeline()
vectorizer, classifier = pipeline["tfidf"], pipeline["clf"]
vocabulary = vectorizer.get_feature_names_out()

app = Flask(__name__)


def predict(text):
    features = vectorizer.transform([text])
    probabilities = classifier.predict_proba(features)[0]
    best = int(probabilities.argmax())
    if classifier.coef_.shape[0] == 1:  # binary: one row of weights favouring classes_[1]
        weights = classifier.coef_[0] if best == 1 else -classifier.coef_[0]
    else:
        weights = classifier.coef_[best]
    contributions = features.data * weights[features.indices]
    top = sorted(zip(contributions, features.indices), reverse=True)[:TOP_WORDS]
    return {
        "label": str(classifier.classes_[best]),
        "probabilities": {str(c): float(p) for c, p in zip(classifier.classes_, probabilities)},
        "top_words": [{"word": vocabulary[i], "weight": round(float(w), 4)} for w, i in top if w > 0],
    }


@app.get("/")
def index():
    return send_file(Path(__file__).parent / "index.html")


@app.post("/api/predict")
def api_predict():
    body = request.get_json(silent=True)
    text = body.get("text") if isinstance(body, dict) else None
    if not isinstance(text, str) or not text.strip():
        return jsonify(error='Provide a non-empty "text" string.'), 400
    if len(text) > MAX_CHARS:
        return jsonify(error=f"Text is limited to {MAX_CHARS} characters."), 400
    return jsonify(predict(text))


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", "8080")))
