"""公共环境：目录、缓存、日志、生成器标识、离线开关。只依赖标准库。"""
from __future__ import annotations

import hashlib
import os
import sys
from pathlib import Path

#: skill 的 scripts/ 目录
SCRIPTS_DIR = Path(__file__).resolve().parent.parent
#: skill 根目录（含 palette.json）
SKILL_DIR = SCRIPTS_DIR.parent

#: 生成器标识，写入 manifest；导出结果有不兼容变化时递增。
#: Python 版与 T5b 的 TS 版输出逐字节一致，因此沿用同一标识。
GENERATOR = "wisp-diagram@1"


class WispError(Exception):
    """面向用户的错误：CLI 只打印 message，不打印堆栈。"""


def cache_dir() -> Path:
    """缓存目录：$WISP_DIAGRAM_CACHE → $XDG_CACHE_HOME/wisp-diagram → ~/.cache/wisp-diagram。"""
    base = os.environ.get("WISP_DIAGRAM_CACHE")
    if not base:
        xdg = os.environ.get("XDG_CACHE_HOME") or str(Path.home() / ".cache")
        base = str(Path(xdg) / "wisp-diagram")
    p = Path(base)
    p.mkdir(parents=True, exist_ok=True)
    return p


def offline() -> bool:
    v = os.environ.get("WISP_DIAGRAM_OFFLINE", "")
    return v not in ("", "0", "false", "no")


def sha256(data: str | bytes) -> str:
    if isinstance(data, str):
        data = data.encode("utf-8")
    return hashlib.sha256(data).hexdigest()


def log(msg: str) -> None:
    if os.environ.get("WISP_DIAGRAM_QUIET"):
        return
    sys.stderr.write(f"[wisp-diagram] {msg}\n")
    sys.stderr.flush()


def debug() -> bool:
    return bool(os.environ.get("WISP_DIAGRAM_DEBUG"))
