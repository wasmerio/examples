"""draw.io 源文件：压缩格式互转、页面列表、规范化（解压 + 统一缩进）。"""
from __future__ import annotations

import base64
import re
import zlib
from dataclasses import dataclass
from urllib.parse import quote, unquote

from .xmlfmt import format_xml

_URI_SAFE = "-_.!~*'()"


def compress_diagram(xml: str) -> str:
    """draw.io 的压缩格式：URI 编码 → deflate-raw → base64。"""
    c = zlib.compressobj(wbits=-15)
    data = c.compress(quote(xml, safe=_URI_SAFE).encode("utf-8")) + c.flush()
    return base64.b64encode(data).decode("ascii")


def decompress_diagram(data: str) -> str:
    raw = zlib.decompress(base64.b64decode(data.strip()), wbits=-15).decode("utf-8")
    return unquote(raw, errors="strict")


DIAGRAM_RE = re.compile(r"(<diagram\b[^>]*>)([\s\S]*?)(</diagram>)")


def _is_compressed(body: str) -> bool:
    b = body.strip()
    return b != "" and not b.startswith("<")


@dataclass
class DrawioPage:
    index: int
    id: str | None
    name: str | None
    compressed: bool


def list_pages(xml: str) -> list[DrawioPage]:
    pages: list[DrawioPage] = []
    for i, m in enumerate(DIAGRAM_RE.finditer(xml)):
        open_tag = m.group(1)

        def get(n: str) -> str | None:
            mm = re.search(rf'\s{n}="([^"]*)"', open_tag)
            return mm.group(1) if mm else None

        pages.append(DrawioPage(i, get("id"), get("name"), _is_compressed(m.group(2))))
    return pages


def normalize_drawio(xml: str) -> str:
    """把所有页面解压为明文 XML 并统一格式；幂等。"""
    def repl(m: re.Match) -> str:
        o, body, c = m.group(1), m.group(2), m.group(3)
        return f"{o}{decompress_diagram(body)}{c}" if _is_compressed(body) else f"{o}{body}{c}"

    return format_xml(DIAGRAM_RE.sub(repl, xml))
