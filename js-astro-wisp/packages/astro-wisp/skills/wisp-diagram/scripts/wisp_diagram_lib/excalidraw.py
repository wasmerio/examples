"""规范化 .excalidraw（与 TS 版逐字节一致）。"""
from __future__ import annotations

import copy
import json
from typing import Any

from .jsjson import js_string, sort_keys, stringify, utf16_key


def normalize_excalidraw(src: str | dict) -> str:
    """按 id 稳定排序元素（全部元素都有分数索引 `index` 时先按 index）、appState 只保留
    viewBackgroundColor 和 gridSize、键排序、2 空格缩进 + 末尾换行。幂等。"""
    doc: dict[str, Any] = json.loads(src) if isinstance(src, str) else copy.deepcopy(src)
    els = list(doc["elements"]) if isinstance(doc.get("elements"), list) else []
    has_index = len(els) > 0 and all(isinstance(e, dict) and isinstance(e.get("index"), str) for e in els)

    def key(e: Any) -> tuple:
        idv = e.get("id") if isinstance(e, dict) else None
        sid = utf16_key(js_string(idv if idv is not None else ""))
        return (utf16_key(e["index"]), sid) if has_index else (sid,)

    doc["elements"] = sorted(els, key=key)
    app = doc.get("appState") or {}
    kept: dict[str, Any] = {}
    if isinstance(app, dict):
        if "viewBackgroundColor" in app:
            kept["viewBackgroundColor"] = app["viewBackgroundColor"]
        if "gridSize" in app:
            kept["gridSize"] = app["gridSize"]
    doc["appState"] = kept
    return stringify(sort_keys(doc)) + "\n"
