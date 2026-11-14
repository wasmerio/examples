import os

os.environ["SQLITE_PATH"] = "/tmp/wasmer-starter-test.db"
if os.path.exists(os.environ["SQLITE_PATH"]):
    os.remove(os.environ["SQLITE_PATH"])

from fastapi.testclient import TestClient  # noqa: E402

from main import app  # noqa: E402


def test_todo_lifecycle():
    with TestClient(app) as client:
        assert client.get("/").status_code == 200
        created = client.post("/api/todos", json={"title": "Ship it"}).json()
        assert created["title"] == "Ship it" and created["done"] is False
        updated = client.patch(f"/api/todos/{created['id']}", json={"title": "Ship it", "done": True}).json()
        assert updated["done"] is True
        assert [t["title"] for t in client.get("/api/todos").json()] == ["Ship it"]
        assert "Ship it" in client.get("/").text
        assert client.delete(f"/api/todos/{created['id']}").status_code == 204
        assert client.get("/api/todos").json() == []


def test_form_flow_redirects_home():
    with TestClient(app) as client:
        response = client.post("/todos", data={"title": "From the form"}, follow_redirects=False)
        assert response.status_code == 303
        assert "From the form" in client.get("/").text
