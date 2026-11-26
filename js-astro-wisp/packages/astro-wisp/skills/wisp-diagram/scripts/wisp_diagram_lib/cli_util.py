from __future__ import annotations

import glob
import os


def kind_of(file: str) -> str | None:
    if file.endswith(".excalidraw"):
        return "excalidraw"
    if file.endswith(".drawio"):
        return "drawio"
    return None


def expand_args(args: list[str]) -> list[str]:
    """展开参数：存在的文件原样保留，否则按 glob 展开；返回排序去重后的列表。"""
    out: set[str] = set()
    for a in args:
        if os.path.exists(a):
            out.add(a)
        else:
            out.update(glob.glob(a, recursive=True))
    return sorted(out)
