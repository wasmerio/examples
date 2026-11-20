import json

import pytest
from starlette.testclient import TestClient

from main import app

HOST = "cupcakes.wasmer.app"
ORIGIN = f"https://{HOST}"
HEADERS = {"accept": "application/json, text/event-stream", "host": HOST, "x-forwarded-proto": "https"}


@pytest.fixture(scope="module")
def client():
    # The MCP session manager starts once per app, so the tests share one client.
    with TestClient(app) as test_client:
        yield test_client


def call(client, method, params=None, id=1):
    body = {"jsonrpc": "2.0", "id": id, "method": method, "params": params or {}}
    response = client.post("/mcp", json=body, headers=HEADERS)
    assert response.status_code == 200, response.text
    return response.json()["result"]


def test_home_page_shows_endpoint(client):
    page = client.get("/", headers=HEADERS)
    assert page.status_code == 200
    assert f"{ORIGIN}/mcp" in page.text
    assert "public sample data" in page.text


def test_tools_answer_on_a_public_hostname(client):
    init = {"protocolVersion": "2025-06-18", "capabilities": {}, "clientInfo": {"name": "test", "version": "1"}}
    call(client, "initialize", init)
    names = {tool["name"] for tool in call(client, "tools/list", id=2)["tools"]}
    assert names == {"search", "fetch"}
    found = call(client, "tools/call", {"name": "search", "arguments": {"query": "alice"}}, id=3)
    citation = f"{ORIGIN}/records/1"
    assert found["structuredContent"]["results"][0] == {"id": "1", "title": "Alice order", "url": citation}
    assert json.loads(found["content"][0]["text"]) == found["structuredContent"]

    order = call(client, "tools/call", {"name": "fetch", "arguments": {"id": "1"}}, id=4)
    document = order["structuredContent"]
    assert set(document) == {"id", "title", "text", "url", "metadata"}
    assert document["url"] == citation
    assert document["metadata"]["customer"] == "Alice"
    assert json.loads(order["content"][0]["text"]) == document

    response = client.get(document["url"])
    assert response.status_code == 200
    assert response.json() == {key: value for key, value in document.items() if key != "url"}
    assert client.get(f"{ORIGIN}/records/unknown").status_code == 404


def test_forwarded_scheme_cannot_inject_html(client):
    page = client.get("/", headers={"host": "cupcakes.wasmer.app", "x-forwarded-proto": "<script>unsafe()</script>"})
    assert "<script>unsafe()" not in page.text
    assert "http://cupcakes.wasmer.app/mcp" in page.text
