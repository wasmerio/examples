"""调色板 / 图表样式换代：把源文件里旧调色板的令牌值改写成当前 palette.json 的同名令牌。

和 `lint --fix` 的区别：lint 按 ΔE 吸附到**最近**的令牌，调色板整体换代后最近的未必是同名令牌
（例如旧 violet #7c3aed 离新 slate 更近）。migrate 按**令牌名**一一对应，所以结果是确定的。

同时按旧调色板的 `diagram` 设置改写样式：
- 线宽：旧 thin / normal / bold → 新 thin / normal / bold（只改图形和连线，不改文字元素）；
- 圆角：draw.io 顶点 `rounded=1` → `absoluteArcSize=1;arcSize=<2 × corner-radius>`（连线的 rounded 是折线拐角，不动）；
  Excalidraw 的 `roundness: {type: 3}` → `{type: 3, value: <corner-radius>}`。

支持：.excalidraw、.excalidrawlib、.drawio、draw.io 素材库（`<mxlibrary>` 包着的 .xml）、drawio-config.json。
"""
from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from pathlib import Path

from .drawio import normalize_drawio
from .jsjson import js_number, stringify
from .palette import palette as current_palette

_HEX = re.compile(r"#[0-9a-fA-F]{6}\b")
_CELL_TAG = re.compile(r"<(?:mxCell|object|UserObject)\b[^>]*>")
_SHAPES = ("rectangle", "ellipse", "diamond", "arrow", "line", "freedraw", "frame")


def _pairs(p: dict) -> dict[str, dict[str, str]]:
    """令牌名 → {light, dark}（hue 的 stroke 用 hue 名，fill 用 `<hue>-fill`）。"""
    out: dict[str, dict[str, str]] = {}
    for k, v in p["color"]["base"].items():
        if not k.startswith("$"):
            out[k] = {m: v[m].lower() for m in ("light", "dark")}
    for k, v in p["color"]["hue"].items():
        if k.startswith("$"):
            continue
        out[k] = {m: v["stroke"][m].lower() for m in ("light", "dark")}
        out[f"{k}-fill"] = {m: v["fill"][m].lower() for m in ("light", "dark")}
    return out


@dataclass
class Migration:
    """旧调色板 → 当前调色板的改写规则。"""

    colors: dict[str, str]
    widths: dict[float, float]
    radius: float
    stats: dict[str, int] = field(default_factory=dict)

    @classmethod
    def from_palettes(cls, old: dict, new: dict | None = None) -> Migration:
        new = new or current_palette()
        o, n = _pairs(old), _pairs(new)
        colors: dict[str, str] = {}
        # 先 dark 后 light：两边撞值时以 light（作画用的值）为准
        for mode in ("dark", "light"):
            for name, pair in o.items():
                if name in n and pair[mode] != n[name][mode]:
                    colors[pair[mode]] = n[name][mode]
        ow, nw = old["diagram"]["stroke-width"], new["diagram"]["stroke-width"]
        widths = {float(ow[k]): float(nw[k]) for k in ow if k in nw and ow[k] != nw[k]}
        return cls(colors, widths, float(new["diagram"]["corner-radius"]))

    def _bump(self, key: str, n: int = 1) -> None:
        self.stats[key] = self.stats.get(key, 0) + n

    # ------------------------------------------------------------ 原子改写

    def hexes(self, text: str) -> str:
        def sub(m: re.Match) -> str:
            to = self.colors.get(m.group(0).lower())
            if to is None:
                return m.group(0)
            self._bump("colors")
            return to
        return _HEX.sub(sub, text)

    def width(self, w):
        if isinstance(w, (int, float)) and not isinstance(w, bool) and float(w) in self.widths:
            self._bump("stroke-width")
            return self.widths[float(w)]
        return w

    # ------------------------------------------------------------ Excalidraw

    def excalidraw_elements(self, elements: list) -> None:
        for el in elements:
            if not isinstance(el, dict):
                continue
            for k in ("strokeColor", "backgroundColor"):
                if isinstance(el.get(k), str):
                    el[k] = self.hexes(el[k])
            if el.get("type") in _SHAPES:
                el["strokeWidth"] = self.width(el.get("strokeWidth"))
            r = el.get("roundness")
            if isinstance(r, dict) and r.get("type") == 3 and r.get("value") != self.radius:
                r["value"] = int(self.radius) if self.radius.is_integer() else self.radius
                self._bump("radius")

    def excalidraw(self, src: str) -> str:
        doc = json.loads(src)
        self.excalidraw_elements(doc.get("elements") or [])
        return stringify(doc) + "\n"

    def excalidrawlib(self, src: str) -> str:
        doc = json.loads(src)
        for it in doc.get("libraryItems") or []:
            self.excalidraw_elements(it.get("elements") or [])
        return json.dumps(doc, ensure_ascii=False, indent=1) + "\n"

    # ------------------------------------------------------------ draw.io

    def _style(self, style: str, vertex: bool) -> str:
        parts = [p for p in style.split(";") if p]
        kv = [(p.split("=", 1)[0], p.split("=", 1)[1] if "=" in p else None) for p in parts]
        out: list[tuple[str, str | None]] = []
        rounded = any(k == "rounded" and v == "1" for k, v in kv)
        arc = js_number(self.radius * 2)
        for k, v in kv:
            if k == "strokeWidth" and v is not None:
                try:
                    num = float(v)
                except ValueError:
                    num = None
                if num is not None and num in self.widths:
                    self._bump("stroke-width")
                    v = js_number(self.widths[num])
            if vertex and rounded and k in ("arcSize", "absoluteArcSize"):
                continue
            out.append((k, v))
            if vertex and rounded and k == "rounded":
                out += [("absoluteArcSize", "1"), ("arcSize", arc)]
        if vertex and rounded:
            before = dict(kv)
            if before.get("absoluteArcSize") != "1" or before.get("arcSize") != arc:
                self._bump("radius")
        text = ";".join(k if v is None else f"{k}={v}" for k, v in out)
        return text + (";" if style.endswith(";") or not style else "")

    def drawio_xml(self, xml: str) -> str:
        def cell(m: re.Match) -> str:
            tag = m.group(0)
            vertex = 'vertex="1"' in tag
            return re.sub(r'(\sstyle=")([^"]*)(")', lambda s: s.group(1) + self._style(s.group(2), vertex) + s.group(3), tag, count=1)
        # 颜色只在最后整体替换一遍（含 value 里的 HTML 颜色），避免 A→B、B→C 的链式替换
        return self.hexes(_CELL_TAG.sub(cell, xml))

    def drawio(self, src: str) -> str:
        return self.drawio_xml(normalize_drawio(src))

    def mxlibrary(self, src: str) -> str:
        raw = src.strip()
        items = json.loads(raw[len("<mxlibrary>"): -len("</mxlibrary>")])
        for it in items:
            it["xml"] = self.drawio_xml(it["xml"])
        return "<mxlibrary>" + json.dumps(items, ensure_ascii=False, indent=1) + "</mxlibrary>\n"

    def drawio_config(self, src: str) -> str:
        cfg = json.loads(src)
        for key in ("presetColors", "defaultColors"):
            if isinstance(cfg.get(key), list):
                cfg[key] = [self.colors.get(f"#{c}".lower(), f"#{c}")[1:].upper() for c in cfg[key]]
        for k in ("defaultVertexStyle", "defaultEdgeStyle"):
            st = cfg.get(k)
            if isinstance(st, dict):
                style = ";".join(f"{a}={b}" for a, b in st.items()) + ";"
                new = self._style(style, vertex=k == "defaultVertexStyle")
                cfg[k] = {p.split("=", 1)[0]: p.split("=", 1)[1] for p in new.split(";") if p}
        text = json.dumps(cfg, ensure_ascii=False, indent=2)
        return self.hexes(text) + "\n"

    # ------------------------------------------------------------ 分发

    def file(self, path: str | Path) -> str | None:
        """返回改写后的文本；不支持的文件返回 None。保留源文件末尾是否有换行。"""
        p = Path(path)
        src = p.read_text("utf-8")
        out = self._dispatch(p.name, src)
        if out is not None and not src.endswith("\n"):
            out = out.rstrip("\n")
        return out

    def _dispatch(self, name: str, src: str) -> str | None:
        if name.endswith(".excalidraw"):
            return self.excalidraw(src)
        if name.endswith(".excalidrawlib"):
            return self.excalidrawlib(src)
        if name.endswith(".drawio"):
            return self.drawio(src)
        if name.endswith(".xml") and src.lstrip().startswith("<mxlibrary>"):
            return self.mxlibrary(src)
        if name.endswith(".json") and '"presetColors"' in src:
            return self.drawio_config(src)
        return None


def load_palette(path: str | Path) -> dict:
    return json.loads(Path(path).read_text("utf-8"))
