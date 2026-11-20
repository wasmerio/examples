"""Train a TF-IDF + logistic regression text classifier and report its accuracy.

Usage: python train.py [--data path/to/your.csv] [--save]
The CSV needs a header row with `label` and `text` columns. `--save` writes the
fitted pipeline to model.joblib, which main.py then loads instead of training.
"""

import argparse
import csv
import os
from pathlib import Path

import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline

HERE = Path(__file__).parent
DATA_PATH = Path(os.environ.get("DATA_PATH", HERE / "data" / "sms_spam.csv"))
MODEL_PATH = HERE / "model.joblib"
RANDOM_STATE = 42


def load_csv(path):
    with open(path, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    return [r["text"] for r in rows], [r["label"] for r in rows]


def build_pipeline():
    return Pipeline(
        [
            ("tfidf", TfidfVectorizer(sublinear_tf=True, ngram_range=(1, 2), min_df=2)),
            ("clf", LogisticRegression(C=10, class_weight="balanced", max_iter=1000)),
        ]
    )


def train(data_path=DATA_PATH):
    """Score on a stratified 20% hold-out split, then refit on every row."""
    texts, labels = load_csv(data_path)
    x_train, x_test, y_train, y_test = train_test_split(
        texts, labels, test_size=0.2, stratify=labels, random_state=RANDOM_STATE
    )
    accuracy = build_pipeline().fit(x_train, y_train).score(x_test, y_test)
    return build_pipeline().fit(texts, labels), accuracy


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--data", default=DATA_PATH, type=Path)
    parser.add_argument("--save", action="store_true", help=f"write {MODEL_PATH.name}")
    args = parser.parse_args()
    pipeline, accuracy = train(args.data)
    print(f"Hold-out accuracy: {accuracy:.3f}")
    if args.save:
        joblib.dump(pipeline, MODEL_PATH)
        print(f"Saved {MODEL_PATH}")
