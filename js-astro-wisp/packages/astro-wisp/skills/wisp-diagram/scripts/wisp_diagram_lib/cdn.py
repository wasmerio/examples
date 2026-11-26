"""CDN 资源的本地缓存：首次联网下载到 <cache>/cdn/，之后离线可用。

- 缓存键为完整 URL（sha256），文件名附带 URL 末段便于辨认；
- WISP_DIAGRAM_OFFLINE=1 时只读缓存，未命中直接报错（并提示如何预热）。
"""
from __future__ import annotations

import os
import re
import time
import urllib.error
import urllib.request
from pathlib import Path

from .env import WispError, cache_dir, log, offline, sha256
from .versions import JSDELIVR

USER_AGENT = "wisp-diagram (+https://github.com/; python urllib)"


def cdn_dir() -> Path:
    d = cache_dir() / "cdn"
    d.mkdir(parents=True, exist_ok=True)
    return d


def cache_path(url: str) -> Path:
    tail = re.sub(r"[^A-Za-z0-9._@+-]+", "_", url.rstrip("/").rsplit("/", 2)[-2] + "_" + url.rstrip("/").rsplit("/", 1)[-1])[-60:]
    return cdn_dir() / f"{sha256(url)[:20]}-{tail}"


def is_cached(url: str) -> bool:
    return cache_path(url).exists()


class OfflineMiss(WispError):
    pass


def download(url: str, dest: Path, *, timeout: float = 60, retries: int = 2) -> bytes:
    last: Exception | None = None
    for attempt in range(retries + 1):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
            with urllib.request.urlopen(req, timeout=timeout) as r:
                body = r.read()
            tmp = dest.with_name(dest.name + f".{os.getpid()}.tmp")
            tmp.write_bytes(body)
            os.replace(tmp, dest)
            return body
        except urllib.error.HTTPError as e:
            if e.code == 404:
                raise WispError(f"[wisp-diagram] 下载失败（HTTP 404）：{url}") from e
            last = e
        except (urllib.error.URLError, TimeoutError, OSError) as e:
            last = e
        time.sleep(0.5 * (attempt + 1))
    raise WispError(f"[wisp-diagram] 下载失败：{url}（{last}）。检查网络，或先在联网环境运行 `wisp_diagram.py cache warm`。")


def fetch(url: str, *, quiet: bool = False) -> bytes:
    """读缓存；未命中时下载（离线模式下报错）。"""
    p = cache_path(url)
    if p.exists():
        return p.read_bytes()
    if offline():
        raise OfflineMiss(
            f"[wisp-diagram] 离线模式（WISP_DIAGRAM_OFFLINE）下缓存中没有：{url}\n"
            "请先在联网环境运行一次 `uv run <skill>/scripts/wisp_diagram.py cache warm`（或正常执行一次 build / export）。"
        )
    if not quiet:
        log(f"下载 {url}")
    return download(url, p)


def jsdelivr(path: str) -> str:
    return JSDELIVR + path


def fetch_npm(path: str, *, quiet: bool = False) -> bytes:
    """path 形如 /npm/pkg@ver/file"""
    return fetch(jsdelivr(path), quiet=quiet)


_IMPORT_RE = re.compile(r"""(?:\bfrom|\bimport)\s*["']([^"'\s]+)["']""")


def prefetch_module_graph(entries: list[str], import_map: dict[str, str], *, rewrite=None, workers: int = 16) -> int:
    """并行预取 ES 模块图（只跟随静态 import），把浏览器逐个串行请求的冷启动从分钟级降到秒级。
    entries / import_map 的值为 jsDelivr 路径（/npm/...）。返回新下载的文件数；单个文件失败不报错
    （浏览器加载时会再次请求并给出明确错误）。"""
    from concurrent.futures import ThreadPoolExecutor
    from urllib.parse import urljoin

    seen: set[str] = set()
    new = 0

    def resolve(spec: str, base: str) -> str | None:
        if spec.startswith("/npm/"):
            return spec
        if spec.startswith("./") or spec.startswith("../"):
            return urljoin(base, spec)
        return import_map.get(spec)

    def work(path: str) -> tuple[str, bytes | None, bool]:
        url = jsdelivr(path)
        cached = is_cached(url)
        try:
            return path, fetch(url, quiet=True), not cached
        except WispError:
            return path, None, False

    frontier = [p for p in entries]
    with ThreadPoolExecutor(max_workers=workers) as ex:
        while frontier:
            batch = [p for p in dict.fromkeys(frontier) if p not in seen]
            seen.update(batch)
            frontier = []
            for path, body, downloaded in ex.map(work, batch):
                new += downloaded
                if body is None or not path.endswith((".js", ".mjs", "/+esm")):
                    continue
                if rewrite:
                    body = rewrite(body)
                for m in _IMPORT_RE.finditer(body.decode("utf-8", "replace")):
                    nxt = resolve(m.group(1), path)
                    if nxt and nxt not in seen:
                        frontier.append(nxt)
    return new
