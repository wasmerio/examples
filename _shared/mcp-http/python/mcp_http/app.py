"""Auth-gated stateless Streamable HTTP for one upstream MCP server.

Adapters, in the order templates should prefer them:

- in-process: a low-level ``mcp.server.Server`` mounted with a new stateless
  session per request
- native-http: an upstream process that already speaks Streamable HTTP
- stdio-bridge: one child process per instance, newline-delimited JSON-RPC
"""

from __future__ import annotations

import asyncio
import hashlib
import hmac
import html
import json
import logging
import os
import sys
from collections.abc import AsyncIterator, Callable
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any

import uvicorn
from starlette.applications import Starlette
from starlette.requests import Request
from starlette.responses import HTMLResponse, JSONResponse, Response
from starlette.routing import Route

logger = logging.getLogger("mcp-http")

UI_PATH = Path(__file__).with_name("wasmer-starter-ui.js")
HOP_HEADERS = {b"content-length", b"transfer-encoding", b"connection", b"keep-alive"}


def _required(names: list[str]) -> list[str]:
    ordered = ["MCP_AUTH_TOKEN"]
    for name in names:
        if name not in ordered:
            ordered.append(name)
    return ordered


def _missing(names: list[str]) -> list[str]:
    return [name for name in names if not os.environ.get(name)]


def _tokens_match(presented: str, expected: str) -> bool:
    left = hashlib.sha256(presented.encode()).digest()
    right = hashlib.sha256(expected.encode()).digest()
    return hmac.compare_digest(left, right)


def _bearer(header: str | None) -> str:
    if not header:
        return ""
    prefix = "Bearer "
    if not header.startswith(prefix):
        return ""
    return header[len(prefix) :]


def _rpc_id(raw: bytes) -> Any:
    if not raw:
        return None
    try:
        payload = json.loads(raw)
    except json.JSONDecodeError:
        return None
    if isinstance(payload, dict):
        return payload.get("id")
    return None


def _rpc_error(req_id: Any, code: int, message: str, status: int) -> JSONResponse:
    body = {"jsonrpc": "2.0", "id": req_id, "error": {"code": code, "message": message}}
    return JSONResponse(body, status_code=status)


def _esc(value: object) -> str:
    return html.escape(str(value), quote=True)


def _public_base(request: Request) -> str:
    proto = request.headers.get("x-forwarded-proto", request.url.scheme)
    if proto not in {"http", "https"}:
        proto = "https"
    host = request.headers.get("host", request.url.netloc)
    return f"{proto}://{host}"


def _brief(text: str) -> str:
    clean = " ".join(str(text or "").split())
    if not clean:
        return ""
    cut = clean.split(". ", 1)[0]
    sentence = cut + "." if len(cut) < len(clean) else cut
    return sentence[:157] + "..." if len(sentence) > 160 else sentence


def _page(cfg: dict[str, Any], base: str, missing: list[str], tools: list[dict[str, str]], tool_error: str) -> str:
    endpoint = f"{base}/mcp"
    slug = cfg["slug"]
    snippet = {
        "mcpServers": {
            slug: {
                "url": endpoint,
                "headers": {"Authorization": "Bearer <MCP_AUTH_TOKEN>"},
            }
        }
    }
    claude = (
        f"claude mcp add --transport http {slug} {endpoint} "
        '--header "Authorization: Bearer <MCP_AUTH_TOKEN>"'
    )
    if missing:
        state = (
            '<wasmer-notice variant="warning">Set these environment variables before calling /mcp: '
            + _esc(", ".join(missing))
            + ".</wasmer-notice>"
        )
    else:
        state = '<wasmer-notice variant="success">Required environment variables are set.</wasmer-notice>'
    if tool_error:
        tool_html = '<wasmer-notice variant="error">' + _esc(tool_error) + "</wasmer-notice>"
    elif not tools:
        tool_html = "<wasmer-text>No tools reported.</wasmer-text>"
    else:
        items = "".join(
            "<li><strong>" + _esc(tool["name"]) + "</strong> — " + _esc(_brief(tool.get("description") or "")) + "</li>"
            for tool in tools
        )
        tool_html = "<ul>" + items + "</ul>"
    limits = cfg.get("limits") or "No write tools are switched off."
    secret_names = cfg.get("required_env") or ["MCP_AUTH_TOKEN"]
    setup = (
        "<wasmer-text>Wasmer does not ask for secrets on the deploy page. Open wasmer.io, then this app, then Settings, then Secrets. Add "
        + _esc(", ".join(secret_names))
        + ". Create MCP_AUTH_TOKEN with <strong>openssl rand -hex 32</strong>. Save the secrets and redeploy. Until they are set, /mcp returns 503.</wasmer-text>"
    )
    return f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{_esc(cfg["title"])}</title><script type="module" src="/wasmer-starter-ui.js"></script>
<style>body{{margin:0}}pre{{overflow:auto;white-space:pre-wrap}}</style></head>
<body><wasmer-starter><wasmer-card>
<wasmer-stack slot="header" vertical><wasmer-badge>MCP</wasmer-badge><wasmer-title>{_esc(cfg["title"])}</wasmer-title></wasmer-stack>
<wasmer-text>{_esc(cfg["summary"])}</wasmer-text>
{state}
{setup}
<wasmer-text>Tools</wasmer-text>
{tool_html}
<wasmer-text>Connect to <strong>{_esc(endpoint)}</strong> with header <strong>Authorization: Bearer &lt;MCP_AUTH_TOKEN&gt;</strong>.</wasmer-text>
<pre>{_esc(json.dumps(snippet, indent=2))}</pre>
<pre>{_esc(claude)}</pre>
<wasmer-text>Cursor uses the same JSON in its MCP settings. ChatGPT connectors use this URL and the same bearer header.</wasmer-text>
<wasmer-text>Limits: {_esc(limits)}</wasmer-text>
<wasmer-stack slot="footer">
<wasmer-action href="{_esc(cfg["repository"])}" variant="outline">Upstream source</wasmer-action>
<wasmer-text>{_esc(cfg["package"])} {_esc(cfg["version"])} · {_esc(cfg["license_name"])}</wasmer-text>
</wasmer-stack>
</wasmer-card></wasmer-starter></body></html>"""


def _parse_message(content_type: str, body: bytes) -> dict[str, Any] | None:
    if not body:
        return None
    if "text/event-stream" in content_type:
        for line in body.decode(errors="replace").splitlines():
            if not line.startswith("data:"):
                continue
            data = line[5:].strip()
            if not data:
                continue
            try:
                message = json.loads(data)
            except json.JSONDecodeError:
                continue
            if isinstance(message, dict) and "id" in message:
                return message
        return None
    try:
        message = json.loads(body)
    except json.JSONDecodeError:
        return None
    return message if isinstance(message, dict) else None


class StdioBridge:
    """One stdio child per instance. Restart it if it exits."""

    def __init__(self, command: list[str]) -> None:
        self.command = command
        self.proc: asyncio.subprocess.Process | None = None
        self.pending: dict[Any, asyncio.Future[dict[str, Any]]] = {}
        self.lock = asyncio.Lock()
        self.stderr: list[str] = []
        self.error = ""
        self._reader: asyncio.Task[None] | None = None
        self._stderr_task: asyncio.Task[None] | None = None

    async def start(self) -> None:
        if self.proc is not None and self.proc.returncode is None:
            return
        env = os.environ.copy()
        env.pop("MCP_AUTH_TOKEN", None)
        env["PYTHONUNBUFFERED"] = "1"
        try:
            self.proc = await asyncio.create_subprocess_exec(
                *self.command,
                stdin=asyncio.subprocess.PIPE,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                env=env,
            )
        except Exception as exc:
            self.error = f"Could not start stdio server: {exc}"
            raise
        self.error = ""
        self._reader = asyncio.create_task(self._read_stdout())
        self._stderr_task = asyncio.create_task(self._read_stderr())

    async def stop(self) -> None:
        proc = self.proc
        self.proc = None
        if proc is None or proc.returncode is not None:
            return
        proc.terminate()
        try:
            await asyncio.wait_for(proc.wait(), timeout=2)
        except asyncio.TimeoutError:
            proc.kill()

    async def request(self, message: dict[str, Any]) -> dict[str, Any] | None:
        await self.start()
        proc = self.proc
        if proc is None or proc.stdin is None or proc.returncode is not None:
            raise RuntimeError(self.error or "stdio server is not running")
        loop = asyncio.get_running_loop()
        future: asyncio.Future[dict[str, Any]] | None = None
        async with self.lock:
            if "id" in message and message["id"] is not None:
                future = loop.create_future()
                self.pending[message["id"]] = future
            proc.stdin.write(json.dumps(message, separators=(",", ":")).encode() + b"\n")
            await proc.stdin.drain()
        if future is None:
            return None
        try:
            return await asyncio.wait_for(future, timeout=60)
        finally:
            self.pending.pop(message["id"], None)

    async def _read_stdout(self) -> None:
        assert self.proc is not None and self.proc.stdout is not None
        buffer = b""
        while True:
            chunk = await self.proc.stdout.read(65536)
            if not chunk:
                self._fail_pending("stdio server exited")
                return
            buffer += chunk
            while b"\n" in buffer:
                line, buffer = buffer.split(b"\n", 1)
                text = line.strip()
                if not text:
                    continue
                try:
                    message = json.loads(text)
                except json.JSONDecodeError:
                    logger.info("stdio non-json: %s", text[:200])
                    continue
                if not isinstance(message, dict):
                    continue
                req_id = message.get("id")
                future = self.pending.get(req_id)
                if future is not None and not future.done():
                    future.set_result(message)

    async def _read_stderr(self) -> None:
        assert self.proc is not None and self.proc.stderr is not None
        while True:
            line = await self.proc.stderr.readline()
            if not line:
                return
            text = line.decode(errors="replace").rstrip()
            self.stderr.append(text)
            del self.stderr[:-40]
            logger.info("stdio: %s", text)

    def _fail_pending(self, reason: str) -> None:
        self.error = reason
        for future in self.pending.values():
            if not future.done():
                future.set_exception(RuntimeError(reason))
        self.pending.clear()


class NativeHttp:
    def __init__(self, command: list[str], port: int) -> None:
        self.command = command
        self.port = port
        self.proc: asyncio.subprocess.Process | None = None
        self.error = ""

    async def start(self) -> None:
        if self.proc is not None and self.proc.returncode is None and not self.error:
            return
        env = os.environ.copy()
        env.pop("MCP_AUTH_TOKEN", None)
        try:
            # WASIX rejects asyncio pipe transports ("Pipe transport is for
            # pipes/sockets only"). The child only has to listen; its logs
            # are discarded so spawn does not open a pipe.
            self.proc = await asyncio.create_subprocess_exec(
                *self.command,
                stdin=asyncio.subprocess.DEVNULL,
                stdout=asyncio.subprocess.DEVNULL,
                stderr=asyncio.subprocess.DEVNULL,
                env=env,
            )
        except Exception as exc:
            self.error = f"Could not start upstream HTTP server: {exc}"
            return
        if not await self._wait_port():
            code = self.proc.returncode if self.proc is not None else None
            self.error = f"Upstream did not listen on 127.0.0.1:{self.port}. exit={code}"

    async def stop(self) -> None:
        proc = self.proc
        self.proc = None
        if proc is None or proc.returncode is not None:
            return
        proc.terminate()
        try:
            await asyncio.wait_for(proc.wait(), timeout=2)
        except asyncio.TimeoutError:
            proc.kill()

    async def _wait_port(self) -> bool:
        for _ in range(150):
            if self.proc is not None and self.proc.returncode is not None:
                return False
            try:
                _reader, writer = await asyncio.open_connection("127.0.0.1", self.port)
            except OSError:
                await asyncio.sleep(0.2)
                continue
            writer.close()
            await writer.wait_closed()
            self.error = ""
            return True
        return False


async def _asgi_post(app: Any, raw: bytes) -> tuple[int, str, bytes]:
    sent = False

    async def receive() -> dict[str, Any]:
        nonlocal sent
        if sent:
            return {"type": "http.disconnect"}
        sent = True
        return {"type": "http.request", "body": raw, "more_body": False}

    started: dict[str, Any] = {"status": 500, "headers": []}
    chunks: list[bytes] = []

    async def send(message: dict[str, Any]) -> None:
        if message["type"] == "http.response.start":
            started["status"] = message["status"]
            started["headers"] = message.get("headers", [])
        elif message["type"] == "http.response.body":
            chunks.append(message.get("body") or b"")

    scope = {
        "type": "http",
        "asgi": {"version": "3.0"},
        "http_version": "1.1",
        "method": "POST",
        "scheme": "http",
        "path": "/mcp",
        "raw_path": b"/mcp",
        "query_string": b"",
        "headers": [
            (b"content-type", b"application/json"),
            (b"accept", b"application/json, text/event-stream"),
            (b"content-length", str(len(raw)).encode()),
        ],
        "client": ("127.0.0.1", 0),
        "server": ("127.0.0.1", 80),
    }
    await app(scope, receive, send)
    content_type = "application/json"
    for key, value in started["headers"]:
        if key.lower() == b"content-type":
            content_type = value.decode()
    return started["status"], content_type, b"".join(chunks)


def _manager_app(manager: Any) -> Callable[..., Any]:
    async def app(scope: dict[str, Any], receive: Any, send: Any) -> None:
        await manager.handle_request(scope, receive, send)

    return app


async def _tools_via_asgi(app: Any) -> list[dict[str, str]]:
    body = json.dumps({"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}}).encode()
    _status, content_type, raw = await _asgi_post(app, body)
    message = _parse_message(content_type, raw)
    if not message:
        raise RuntimeError("tools/list returned no JSON-RPC message")
    if "error" in message:
        raise RuntimeError(message["error"].get("message", "tools/list failed"))
    tools = message.get("result", {}).get("tools", [])
    return [{"name": tool.get("name", ""), "description": tool.get("description", "")} for tool in tools]


def build_app(cfg: dict[str, Any]) -> Starlette:
    from mcp.server.streamable_http_manager import StreamableHTTPSessionManager

    manager = None
    if cfg["adapter"] == "in-process":
        manager = StreamableHTTPSessionManager(
            app=cfg["mcp_server"],
            event_store=None,
            json_response=True,
            stateless=True,
        )
    native = NativeHttp(cfg["command"], cfg["upstream_port"]) if cfg["adapter"] == "native-http" else None
    stdio = StdioBridge(cfg["command"]) if cfg["adapter"] == "stdio-bridge" else None
    manager_app = _manager_app(manager) if manager is not None else None

    @asynccontextmanager
    async def lifespan(_app: Starlette) -> AsyncIterator[None]:
        try:
            if manager is not None:
                async with manager.run():
                    yield
            else:
                yield
        finally:
            if native is not None:
                await native.stop()
            if stdio is not None:
                await stdio.stop()

    async def healthz(_request: Request) -> JSONResponse:
        return JSONResponse({"ok": True})

    async def starter_ui(_request: Request) -> Response:
        if not UI_PATH.is_file():
            return Response("Starter UI is missing.", status_code=500, media_type="text/plain")
        return Response(UI_PATH.read_bytes(), media_type="text/javascript; charset=utf-8")

    async def tool_list() -> tuple[list[dict[str, str]], str]:
        if _missing(cfg["required_env"]):
            return [], ""
        try:
            if manager_app is not None:
                return await _tools_via_asgi(manager_app), ""
            if native is not None:
                await native.start()
                if native.error:
                    return [], native.error
                return await _tools_via_http(cfg["upstream_port"]), ""
            if stdio is not None:
                return await _tools_via_stdio(cfg["command"])
        except Exception as exc:
            logger.exception("tool list failed")
            return [], str(exc)
        return [], "No adapter is configured."

    async def home(request: Request) -> HTMLResponse:
        missing = _missing(cfg["required_env"])
        tools, tool_error = await tool_list()
        page = _page(cfg, _public_base(request), missing, tools, tool_error)
        return HTMLResponse(page, headers={"cache-control": "no-store"})

    async def mcp(request: Request) -> Response:
        raw = await request.body()
        req_id = _rpc_id(raw)
        missing = _missing(cfg["required_env"])
        if missing:
            names = ", ".join(missing)
            return _rpc_error(req_id, -32000, f"Set these environment variables before calling /mcp: {names}", 503)
        if request.method != "POST":
            return Response("Method Not Allowed", status_code=405, headers={"allow": "POST"})
        expected = os.environ["MCP_AUTH_TOKEN"]
        if not _tokens_match(_bearer(request.headers.get("authorization")), expected):
            return _rpc_error(req_id, -32001, "Unauthorized", 401)
        try:
            if manager_app is not None:
                return await _forward_asgi(manager_app, raw)
            if native is not None:
                await native.start()
                if native.error:
                    return _rpc_error(req_id, -32002, native.error, 502)
                return await _forward_http(cfg["upstream_port"], raw, request)
            if stdio is not None:
                return await _forward_stdio(stdio, raw)
        except Exception as exc:
            logger.exception("mcp request failed")
            return _rpc_error(req_id, -32603, str(exc), 500)
        return _rpc_error(req_id, -32603, "No adapter is configured.", 500)

    return Starlette(
        routes=[
            Route("/healthz", endpoint=healthz, methods=["GET"]),
            Route("/wasmer-starter-ui.js", endpoint=starter_ui, methods=["GET"]),
            Route("/", endpoint=home, methods=["GET"]),
            Route("/mcp", endpoint=mcp, methods=["GET", "POST", "DELETE"]),
        ],
        lifespan=lifespan,
    )


async def _forward_asgi(app: Any, raw: bytes) -> Response:
    status, content_type, body = await _asgi_post(app, raw)
    return Response(body, status_code=status, media_type=content_type.split(";")[0], headers={"cache-control": "no-store"})


async def _forward_http(port: int, raw: bytes, request: Request) -> Response:
    import httpx

    headers = {
        "content-type": request.headers.get("content-type", "application/json"),
        "accept": request.headers.get("accept", "application/json, text/event-stream"),
        "host": f"127.0.0.1:{port}",
    }
    for name in ("mcp-protocol-version", "mcp-session-id", "last-event-id"):
        value = request.headers.get(name)
        if value:
            headers[name] = value
    async with httpx.AsyncClient(timeout=90) as client:
        upstream = await client.post(f"http://127.0.0.1:{port}/mcp", content=raw, headers=headers)
    media = upstream.headers.get("content-type", "application/json").split(";")[0]
    extra = {"cache-control": "no-store"}
    session = upstream.headers.get("mcp-session-id")
    if session:
        extra["mcp-session-id"] = session
    return Response(upstream.content, status_code=upstream.status_code, media_type=media, headers=extra)


async def _tools_via_http(port: int) -> list[dict[str, str]]:
    import httpx

    body = json.dumps({"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}}).encode()
    headers = {
        "content-type": "application/json",
        "accept": "application/json, text/event-stream",
        "host": f"127.0.0.1:{port}",
    }
    async with httpx.AsyncClient(timeout=30) as client:
        upstream = await client.post(f"http://127.0.0.1:{port}/mcp", content=body, headers=headers)
    message = _parse_message(upstream.headers.get("content-type", ""), upstream.content)
    if not message or "error" in message:
        detail = (message or {}).get("error", {}).get("message", "tools/list failed")
        raise RuntimeError(detail)
    tools = message.get("result", {}).get("tools", [])
    return [{"name": tool.get("name", ""), "description": tool.get("description", "")} for tool in tools]


async def _tools_via_stdio(command: list[str]) -> tuple[list[dict[str, str]], str]:
    probe = StdioBridge(command)
    try:
        await probe.request(
            {
                "jsonrpc": "2.0",
                "id": 1,
                "method": "initialize",
                "params": {
                    "protocolVersion": "2025-03-26",
                    "capabilities": {},
                    "clientInfo": {"name": "landing", "version": "0.0.0"},
                },
            }
        )
        await probe.request({"jsonrpc": "2.0", "method": "notifications/initialized"})
        message = await probe.request({"jsonrpc": "2.0", "id": 2, "method": "tools/list", "params": {}})
    except Exception as exc:
        return [], str(exc)
    finally:
        await probe.stop()
    if not message or "error" in message:
        detail = (message or {}).get("error", {}).get("message", probe.error or "tools/list failed")
        return [], detail
    tools = message.get("result", {}).get("tools", [])
    return [{"name": tool.get("name", ""), "description": tool.get("description", "")} for tool in tools], ""


async def _forward_stdio(bridge: StdioBridge, raw: bytes) -> Response:
    try:
        message = json.loads(raw)
    except json.JSONDecodeError:
        return _rpc_error(None, -32700, "Parse error", 400)
    if not isinstance(message, dict):
        return _rpc_error(None, -32600, "Invalid request", 400)
    response = await bridge.request(message)
    if response is None:
        return Response(status_code=202)
    return JSONResponse(response, headers={"cache-control": "no-store"})


def serve(
    *,
    title: str,
    repository: str,
    license_name: str,
    package: str,
    version: str,
    required_env: list[str],
    adapter: str,
    summary: str,
    slug: str,
    mcp_server: Any = None,
    command: list[str] | None = None,
    upstream_port: int = 8765,
    limits: str = "",
) -> None:
    if adapter not in {"in-process", "native-http", "stdio-bridge"}:
        raise ValueError(f"Unknown adapter: {adapter}")
    if adapter == "in-process" and mcp_server is None:
        raise ValueError("in-process requires mcp_server")
    if adapter in {"native-http", "stdio-bridge"} and not command:
        raise ValueError(f"{adapter} requires command")
    cfg = {
        "title": title,
        "repository": repository,
        "license_name": license_name,
        "package": package,
        "version": version,
        "required_env": _required(required_env),
        "adapter": adapter,
        "summary": summary,
        "slug": slug,
        "mcp_server": mcp_server,
        "command": command or [],
        "upstream_port": upstream_port,
        "limits": limits,
    }
    app = build_app(cfg)
    port = int(os.environ.get("PORT", "8080"))
    logger.info("mcp-http %s listening on 0.0.0.0:%s", adapter, port)
    uvicorn.run(app, host="0.0.0.0", port=port, log_level="info")


def _main_guard() -> None:
    if __name__ == "__main__":
        print("This module is started by a template's main.py.", file=sys.stderr)


_main_guard()
