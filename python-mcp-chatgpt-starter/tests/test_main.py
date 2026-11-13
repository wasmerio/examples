import pytest
from starlette.testclient import TestClient

from main import app

HEADERS = {"accept": "application/json, text/event-stream", "host": "cupcakes.wasmer.app"}


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
    page = client.get("/", headers={"host": "cupcakes.wasmer.app"})
    assert page.status_code == 200
    assert "cupcakes.wasmer.app/mcp" in page.text


def test_tools_answer_on_a_public_hostname(client):
    init = {"protocolVersion": "2025-06-18", "capabilities": {}, "clientInfo": {"name": "test", "version": "1"}}
    call(client, "initialize", init)
    names = {tool["name"] for tool in call(client, "tools/list", id=2)["tools"]}
    assert names == {"search", "fetch"}
    found = call(client, "tools/call", {"name": "search", "arguments": {"query": "alice"}}, id=3)
    assert found["structuredContent"]["results"][0]["id"] == "1"
    order = call(client, "tools/call", {"name": "fetch", "arguments": {"id": "1"}}, id=4)
    assert order["structuredContent"]["metadata"]["customer"] == "Alice"
