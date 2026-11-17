import sys
from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path

import pytest
from fastapi.testclient import TestClient


@pytest.fixture
def client(tmp_path, monkeypatch):
    monkeypatch.delenv("DB_HOST", raising=False)
    monkeypatch.delenv("DATABASE_URL", raising=False)
    monkeypatch.setenv("SQLITE_PATH", str(tmp_path / "todos.db"))

    # Load a fresh app for each test because its database is configured at import.
    spec = spec_from_file_location("starter_test_app", Path(__file__).resolve().parents[1] / "main.py")
    assert spec is not None and spec.loader is not None
    module = module_from_spec(spec)
    monkeypatch.setitem(sys.modules, spec.name, module)
    spec.loader.exec_module(module)

    try:
        with TestClient(module.app) as test_client:
            yield test_client
    finally:
        module.engine.dispose()


def test_todo_lifecycle(client):
    assert client.get("/").status_code == 200
    created = client.post("/api/todos", json={"title": "Ship it"}).json()
    assert created["title"] == "Ship it" and created["done"] is False
    updated = client.patch(f"/api/todos/{created['id']}", json={"title": "Ship it", "done": True}).json()
    assert updated["done"] is True
    assert [t["title"] for t in client.get("/api/todos").json()] == ["Ship it"]
    assert "Ship it" in client.get("/").text
    assert client.delete(f"/api/todos/{created['id']}").status_code == 204
    assert client.get("/api/todos").json() == []


def test_form_flow_redirects_home(client):
    response = client.post("/todos", data={"title": "From the form"}, follow_redirects=False)
    assert response.status_code == 303
    assert "From the form" in client.get("/").text


def test_blank_titles_are_rejected_in_both_entry_points(client):
    api_error = client.post("/api/todos", json={"title": "   "})
    assert api_error.status_code == 422
    assert "detail" in api_error.json()

    client.post("/api/todos", json={"title": "Keep this todo"})
    form_error = client.post("/todos", data={"title": "   "})
    assert form_error.status_code == 422
    assert form_error.headers["content-type"].startswith("text/html")
    assert '<wasmer-notice variant="error">Enter a title that contains text.</wasmer-notice>' in form_error.text
    assert "Keep this todo" in form_error.text
    assert 'action="/todos"' in form_error.text

    retry = client.post("/todos", data={"title": "Valid retry"})
    assert retry.status_code == 200
    assert "Valid retry" in retry.text
    assert 'variant="error"' not in retry.text


def test_max_length_title_keeps_the_wrapping_element_after_completion(client):
    assert client.get("/api/todos").json() == []
    title = "W" * 200
    response = client.post("/api/todos", json={"title": title})
    assert response.status_code == 201
    todo_id = response.json()["id"]
    assert f'<span class="todo-title">{title}</span>' in client.get("/").text

    response = client.post(f"/todos/{todo_id}/toggle", follow_redirects=False)
    assert response.status_code == 303
    assert f'<span class="todo-title"><s>{title}</s></span>' in client.get("/").text
