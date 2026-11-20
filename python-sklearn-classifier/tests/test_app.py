import math

import joblib
import pytest

import main
import train


def test_training_beats_accuracy_floor():
    _, accuracy = train.train()
    assert accuracy >= 0.97


def test_saved_model_is_loaded_instead_of_training(tmp_path, monkeypatch):
    pipeline, _ = train.train()
    monkeypatch.setattr(main, "MODEL_PATH", tmp_path / "model.joblib")
    joblib.dump(pipeline, main.MODEL_PATH)
    monkeypatch.setattr(main, "build_pipeline", lambda: pytest.fail("trained instead of loading"))
    assert main.load_pipeline().predict(["see you at lunch"])[0] == "ham"


@pytest.fixture
def client():
    return main.app.test_client()


def test_predict_returns_probabilities(client):
    res = client.post("/api/predict", json={"text": "WINNER! Claim your free prize now, call 09061701461"})
    body = res.get_json()
    assert res.status_code == 200
    assert body["label"] == "spam"
    assert math.isclose(sum(body["probabilities"].values()), 1.0)
    assert body["top_words"] and all(w["weight"] > 0 for w in body["top_words"])


@pytest.mark.parametrize("payload", [{}, {"text": "   "}, {"text": 42}, ["text"], {"text": "x" * (main.MAX_CHARS + 1)}])
def test_predict_rejects_bad_input(client, payload):
    res = client.post("/api/predict", json=payload)
    assert res.status_code == 400
    assert "error" in res.get_json()


def test_predict_rejects_non_json(client):
    assert client.post("/api/predict", data="hello").status_code == 400


def test_page_and_starter_ui_are_served(client):
    assert b"/static/wasmer-starter-ui.js" in client.get("/").data
    res = client.get("/static/wasmer-starter-ui.js")
    assert res.status_code == 200 and "javascript" in res.content_type
