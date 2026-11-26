"""项目模式的 manifest：记录每个图表源文件及其产物的内容哈希（diagrams.md §4）。

- build（带 --manifest）只重建有变化的源文件；
- check 只比对哈希（CI 用，不需要浏览器或 draw.io）。

格式与哈希算法与 astro-wisp 的 src/lib/render-diagram.ts（页面渲染时的只读校验）完全一致：
`sha256-<hex>`，哈希前把 CRLF 统一为 LF；JSON 键排序、2 空格缩进、末尾换行。本模块只依赖标准库。
"""
from __future__ import annotations

import glob
import hashlib
import json
import os
from dataclasses import dataclass
from pathlib import Path

from .env import GENERATOR
from .jsjson import stringify, utf16_key

DEFAULT_SCAN = ("src/content/**/diagrams/*.excalidraw", "src/content/**/diagrams/*.drawio")


def content_hash(data: str | bytes) -> str:
    """内容哈希：统一换行符，避免 Windows 检出（autocrlf）导致误报。"""
    text = data.decode("utf-8", "replace") if isinstance(data, bytes) else data
    return "sha256-" + hashlib.sha256(text.replace("\r\n", "\n").encode("utf-8")).hexdigest()


def to_posix(p: str) -> str:
    return p.replace(os.sep, "/")


def repo_rel(abs_path: str, root: str) -> str:
    return to_posix(os.path.relpath(abs_path, root))


def empty_manifest() -> dict:
    return {"version": 1, "generator": GENERATOR, "entries": {}}


def load_manifest(path: str) -> dict:
    if not os.path.exists(path):
        return empty_manifest()
    m = json.loads(Path(path).read_text("utf-8"))
    if m.get("version") != 1:
        raise ValueError(f"manifest 版本不支持：{m.get('version')}")
    if m.get("entries") is None:
        m["entries"] = {}
    return m


def _sort_obj(o: dict) -> dict:
    return {k: o[k] for k in sorted(o, key=utf16_key)}


def serialize_manifest(m: dict) -> str:
    """稳定序列化：键排序、2 空格缩进、末尾换行。"""
    entries = {}
    for k, e in _sort_obj(m["entries"]).items():
        x = {"source": e["source"], "style": e["style"], "exporter": e["exporter"], "embedFonts": e["embedFonts"],
             "outputs": _sort_obj(e["outputs"])}
        if e.get("pages") is not None:
            x["pages"] = e["pages"]
        entries[k] = x
    return stringify({"version": 1, "generator": m["generator"], "entries": entries}) + "\n"


def save_manifest(m: dict, path: str) -> None:
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    Path(path).write_text(serialize_manifest(m), "utf-8", newline="\n")


def scan_sources(root: str, patterns: tuple[str, ...] = DEFAULT_SCAN) -> list[str]:
    """扫描源文件，返回相对 root 的 POSIX 路径（已排序）。"""
    found: set[str] = set()
    for p in patterns:
        for f in glob.glob(p, root_dir=root, recursive=True):
            found.add(to_posix(f))
    return sorted(found, key=utf16_key)


@dataclass
class Status:
    kind: str  # ok | unbuilt | source-changed | output-missing | output-modified | generator-changed
    output: str | None = None
    was: str | None = None


def entry_status(rel: str, m: dict, root: str) -> Status:
    e = m["entries"].get(rel)
    if not e:
        return Status("unbuilt")
    if content_hash(Path(root, rel).read_bytes()) != e["source"]:
        return Status("source-changed")
    for out, h in e["outputs"].items():
        p = Path(root, out)
        if not p.exists():
            return Status("output-missing", out)
        if content_hash(p.read_bytes()) != h:
            return Status("output-modified", out)
    if m.get("generator") != GENERATOR:
        return Status("generator-changed", was=m.get("generator"))
    return Status("ok")


def describe_status(s: Status) -> str:
    return {
        "ok": "ok",
        "unbuilt": "尚未构建（manifest 中没有记录）",
        "source-changed": "源文件已修改，产物过期",
        "output-missing": f"缺少产物 {s.output}",
        "output-modified": f"产物 {s.output} 被手动修改（哈希不一致）",
        "generator-changed": f"生成器版本变化（{s.was} → {GENERATOR}）",
    }[s.kind]


def check_all(root: str, manifest_path: str, patterns: tuple[str, ...] = DEFAULT_SCAN) -> list[tuple[str, str]]:
    """CI 校验：所有扫描到的源文件都已构建且哈希一致；manifest 中没有孤儿记录。"""
    m = load_manifest(manifest_path)
    problems: list[tuple[str, str]] = []
    sources = scan_sources(root, patterns)
    for rel in sources:
        s = entry_status(rel, m, root)
        if s.kind != "ok":
            problems.append((rel, describe_status(s)))
    known = set(sources)
    for rel in m["entries"]:
        if rel not in known:
            problems.append((rel, "manifest 中有记录，但源文件已不存在（运行 build 清理）"))
    return problems
