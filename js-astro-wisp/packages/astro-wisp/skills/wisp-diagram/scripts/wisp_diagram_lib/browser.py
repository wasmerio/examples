"""Playwright 会话（同步 API）：懒启动 Chromium，多张图共用一个浏览器。

页面挂在虚拟源 http://wisp.local/ 下：
- `/` 为页面 HTML；`files` / `mounts` 提供内存内容或本地目录；
- `/npm/...` 映射到 jsDelivr（https://cdn.jsdelivr.net/npm/...），经本地缓存（cdn.py）提供；
- `proxies` 把指定路径前缀映射到远端目录（同样经本地缓存），用于 draw.io 的 MathJax；
- 其余网络请求一律拦截，保证导出离线、可复现。
"""
from __future__ import annotations

import mimetypes
import os
import re
from pathlib import Path
from typing import Any
from urllib.parse import unquote, urlsplit

from . import cdn
from .env import WispError, debug, log

ORIGIN = "http://wisp.local"
PLAYWRIGHT_VERSION = "1.64.1"
INSTALL_HINT = f"uv run --with playwright=={PLAYWRIGHT_VERSION} playwright install chromium"

_MIME = {
    ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".html": "text/html",
    ".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf", ".svg": "image/svg+xml",
    ".json": "application/json", ".png": "image/png",
}


def _mime(path: str) -> str:
    if path.endswith("/+esm"):
        return "text/javascript"
    ext = os.path.splitext(path)[1].lower()
    return _MIME.get(ext) or mimetypes.guess_type(path)[0] or "application/octet-stream"


_DEDUPE_RE = re.compile(rb"/npm/(react|react-dom)@[0-9][^/\"'`]*/")


def _is_js(path: str) -> bool:
    return path.endswith("/+esm") or path.endswith(".js") or path.endswith(".mjs")


def dedupe_js(body: bytes) -> bytes:
    """jsDelivr 的 +esm 构建把依赖写成绝对路径并各自解析版本（react@18.2.0、react-dom@19.0.0…）。
    统一改写到锁定版本，保证页面里只有一份 React / ReactDOM——与 esbuild 打包结果一致
    （ReactDOM 在模块初始化时会消耗一次 Math.random，多份副本会打乱种子化随机序列）。"""
    from .versions import REACT
    return _DEDUPE_RE.sub(lambda m: b"/npm/" + m.group(1) + b"@" + REACT.encode() + b"/", body)


class WispPage:
    def __init__(self, page: Any, context: Any, errors: list[str], missing: list[str]):
        self.page = page
        self.context = context
        self.errors = errors
        #: 离线模式下缓存未命中的 URL
        self.missing = missing

    def failures(self) -> str:
        """页面错误与缓存缺失的简要说明（用于报错信息）。"""
        parts = list(dict.fromkeys(self.errors))
        if self.missing:
            parts.append(f"离线模式（WISP_DIAGRAM_OFFLINE）下缓存缺少 {len(self.missing)} 个文件（如 {self.missing[0]}）；"
                         "请先在联网环境运行 `uv run <skill>/scripts/wisp_diagram.py cache warm`")
        return "；".join(parts)

    def close(self) -> None:
        try:
            self.context.close()
        except Exception:  # pragma: no cover
            pass


def load_playwright():
    try:
        from playwright.sync_api import sync_playwright  # noqa: F401
    except ImportError as e:  # pragma: no cover
        raise WispError(
            "[wisp-diagram] 需要 Python 包 playwright。请用 `uv run <skill>/scripts/wisp_diagram.py …` 运行"
            f"（脚本头部已声明依赖），或手动 `pip install playwright=={PLAYWRIGHT_VERSION}`。"
        ) from e
    from playwright.sync_api import sync_playwright
    return sync_playwright


# 同一线程里只能有一个 sync_playwright 实例：进程内共享，按引用计数启停。
_PW: dict[str, Any] = {"cm": None, "pw": None, "refs": 0}


def _acquire_playwright():
    if _PW["pw"] is None:
        sp = load_playwright()
        cm = sp()
        _PW["pw"] = cm.start()
        _PW["cm"] = cm
    _PW["refs"] += 1
    return _PW["pw"]


def _release_playwright() -> None:
    _PW["refs"] -= 1
    if _PW["refs"] <= 0 and _PW["cm"] is not None:
        try:
            _PW["cm"].__exit__(None, None, None)
        except Exception:  # pragma: no cover
            pass
        _PW.update(cm=None, pw=None, refs=0)


def chromium_status() -> tuple[bool, str]:
    """检查 Chromium 是否已安装（不启动浏览器）。"""
    try:
        pw = _acquire_playwright()
    except WispError as e:
        return False, str(e)
    except Exception as e:  # pragma: no cover
        return False, f"playwright 无法初始化：{str(e).splitlines()[0]}"
    try:
        exe = pw.chromium.executable_path
    finally:
        _release_playwright()
    if exe and Path(exe).exists():
        return True, f"Chromium：{exe}"
    return False, f"未安装 Chromium（运行 `{INSTALL_HINT}`）"


class BrowserSession:
    def __init__(self) -> None:
        self._pw_cm = None
        self._pw = None
        self._browser = None
        self._cache: dict[str, Any] = {}
        self.downloads = 0

    # ---- lifecycle
    def browser(self):
        if self._browser is not None:
            return self._browser
        self._pw = _acquire_playwright()
        self._pw_cm = True
        try:
            self._browser = self._pw.chromium.launch()
        except Exception as e:
            first = str(e).strip().splitlines()[0] if str(e).strip() else repr(e)
            self.close()
            raise WispError(f"[wisp-diagram] 无法启动 Chromium：{first}\n请运行 `{INSTALL_HINT}`。") from e
        return self._browser

    def close(self) -> None:
        for v in list(self._cache.values()):
            if isinstance(v, WispPage):
                v.close()
        self._cache.clear()
        if self._browser is not None:
            try:
                self._browser.close()
            except Exception:  # pragma: no cover
                pass
            self._browser = None
        if self._pw_cm is not None:
            _release_playwright()
            self._pw_cm = None
            self._pw = None

    def __enter__(self) -> "BrowserSession":
        return self

    def __exit__(self, *exc: Any) -> None:
        self.close()

    # ---- 会话级缓存（如 excalidraw / svgo 页面）
    def cached(self, key: str, factory):
        if key not in self._cache:
            self._cache[key] = factory()
        return self._cache[key]

    # ---- pages
    def open_page(
        self,
        *,
        html: str | None = None,
        files: dict[str, bytes | str] | None = None,
        mounts: dict[str, str | Path] | None = None,
        proxies: dict[str, str] | None = None,
        color_scheme: str = "light",
        device_scale_factor: float = 1,
        viewport: dict | None = None,
        init_script: str | None = None,
    ) -> WispPage:
        browser = self.browser()
        context = browser.new_context(
            color_scheme=color_scheme,
            device_scale_factor=device_scale_factor,
            viewport=viewport or {"width": 1600, "height": 1200},
        )
        page = context.new_page()
        errors: list[str] = []
        missing: list[str] = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        if debug():
            page.on("console", lambda m: log(f"console[{m.type}]: {m.text}"))
        if init_script:
            page.add_init_script(init_script)
        mts = sorted(((k, str(v)) for k, v in (mounts or {}).items()), key=lambda kv: -len(kv[0]))
        fs = files or {}
        body_html = html or '<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>'
        session = self

        def handle(route: Any) -> None:
            url = route.request.url
            parts = urlsplit(url)
            if f"{parts.scheme}://{parts.netloc}" != ORIGIN:
                if debug():
                    log(f"blocked {url}")
                route.abort()
                return
            p = unquote(parts.path)
            if p in ("/", "/index.html"):
                route.fulfill(body=body_html, content_type="text/html; charset=utf-8")
                return
            if p in fs:
                route.fulfill(body=fs[p], content_type=_mime(p))
                return
            if p.startswith("/npm/"):
                full = cdn.jsdelivr(parts.path + (f"?{parts.query}" if parts.query else ""))
                try:
                    if not cdn.is_cached(full):
                        session.downloads += 1
                    body = cdn.fetch(full, quiet=True)
                except cdn.OfflineMiss:
                    missing.append(full)
                    route.fulfill(status=503, body="offline cache miss")
                    return
                except WispError as e:
                    errors.append(str(e))
                    route.fulfill(status=503, body=str(e))
                    return
                if _is_js(p):
                    body = dedupe_js(body)
                route.fulfill(body=body, content_type=_mime(p))
                return
            for prefix, remote in (proxies or {}).items():
                if p.startswith(prefix):
                    full = remote.rstrip("/") + "/" + parts.path[len(prefix):].lstrip("/")
                    try:
                        if not cdn.is_cached(full):
                            session.downloads += 1
                        route.fulfill(body=cdn.fetch(full, quiet=True), content_type=_mime(p))
                    except cdn.OfflineMiss:
                        missing.append(full)
                        route.fulfill(status=503, body="offline cache miss")
                    except WispError as e:
                        errors.append(str(e))
                        route.fulfill(status=503, body=str(e))
                    return
            for prefix, d in mts:
                if p.startswith(prefix):
                    rel = p[len(prefix):]
                    if ".." in rel:
                        route.fulfill(status=403)
                        return
                    fp = Path(d) / rel
                    if fp.is_file():
                        route.fulfill(body=fp.read_bytes(), content_type=_mime(p))
                    else:
                        route.fulfill(status=404)
                    return
            route.fulfill(status=404)

        context.route("**/*", handle)
        page.goto(f"{ORIGIN}/")
        return WispPage(page, context, errors, missing)
