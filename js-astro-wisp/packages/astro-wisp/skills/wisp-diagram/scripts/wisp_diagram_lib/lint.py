"""lint 规则：非调色板颜色、字号、网格对齐、阴影 / 渐变、文件大小、压缩存储；以及 --fix。"""
from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from typing import Any

from . import palette as P
from .color import to_fixed
from .drawio import DIAGRAM_RE, list_pages, normalize_drawio
from .jsjson import js_number, js_string, stringify
from .xmlfmt import Node, parse as parse_xml

MAX_SOURCE_BYTES = 2 * 1024 * 1024
#: 正文栏约 710px：图比这宽就会被等比缩小。超过 WIDE 提醒，超过 TOO_WIDE 时 14px 的字已不到 9px
COLUMN_PX = 710
WIDE_PX = 720
TOO_WIDE_PX = 1000
FONT_TOLERANCE = 1
#: 一张图里最多几种 hue（slate 是中性灰，不计）。颜色只给语义角色，超过就是在用颜色区分兄弟节点
MAX_HUES = 3
NEUTRAL_HUES = ("slate",)


@dataclass
class LintFix:
    field: str
    to: str | float
    from_: str | None = None
    page: int | None = None


@dataclass
class LintIssue:
    level: str  # error | warn
    rule: str  # palette-color | font-size | grid | shadow | gradient | file-size | compressed | width | math | hue-count
    message: str
    element_id: str | None = None
    fix: LintFix | None = None


def _font_size_ok(n: float) -> bool:
    return any(abs(n - s) <= FONT_TOLERANCE for s in P.font_sizes())


def _js_round(v: float) -> float:
    import math
    return math.floor(v + 0.5)


def _on_grid(n: float) -> bool:
    g = P.grid()
    return abs(n - _js_round(n / g) * g) <= 0.5


_SKIP_COLOR = re.compile(r"^(none|transparent|default|inherit|swimlane)$", re.I)


def _sizes_text() -> str:
    return "/".join(js_number(s) for s in P.font_sizes())


def _mb(n: int) -> str:
    return to_fixed(n / 1048576, 1)


def _color_issue(where: str, value: str, el_id: str | None, fld: str, page: int | None = None) -> LintIssue | None:
    if _SKIP_COLOR.match(value.strip()):
        return None
    if P.is_palette_color(value):
        return None
    hx = P.normalize_hex(value)
    if not hx:
        return LintIssue("error", "palette-color", f'{where}: unrecognised color "{value}"', el_id)
    n = P.nearest_token(hx)
    return LintIssue(
        "error", "palette-color",
        f"{where}: {value} is not in the palette; nearest is {n.token.light} (--wd-{n.token.name}, ΔE {to_fixed(n.delta_e, 1)})",
        el_id, LintFix(fld, n.token.light, value, page),
    )


def _hue_of(value: str) -> str | None:
    """调色板颜色所属的 hue 名（stroke 与 fill 同属一个 hue）；基础色、中性 hue 返回 None。"""
    t = P.exact_token(value) if isinstance(value, str) else None
    if t is None:
        return None
    name = t.name[:-5] if t.name.endswith("-fill") else t.name
    return name if name in P.hues() and name not in NEUTRAL_HUES else None


def _hue_count_issue(hues: set[str], where: str = "") -> LintIssue | None:
    if len(hues) <= MAX_HUES:
        return None
    names = ", ".join(h for h in P.hues() if h in hues)
    return LintIssue("warn", "hue-count", f"{where}{len(hues)} hues in one figure ({names}); use at most {MAX_HUES} — "
                     "colour is for semantic roles only, make the other nodes neutral (surface fill, muted/fg stroke)")


def _is_num(v: Any) -> bool:
    return isinstance(v, (int, float)) and not isinstance(v, bool)


def _width_issue(width: float, where: str = "") -> LintIssue | None:
    if width <= WIDE_PX:
        return None
    pct = _js_round(COLUMN_PX / width * 100)
    tail = ("; text will be unreadable — lay it out top-to-bottom or split it" if width > TOO_WIDE_PX
            else "; aim for 640–700px so it renders at natural size")
    return LintIssue("warn", "width", f"{where}content is {js_number(_js_round(width))}px wide; the ~710px text column scales it to {js_number(pct)}%{tail}")


def _truthy(v: Any) -> bool:
    return not (v is None or v is False or v == 0 and _is_num(v) or v == "")


# ---------------------------------------------------------------- Excalidraw

_GRID_TYPES = ("rectangle", "ellipse", "diamond", "text", "image", "frame", "magicframe", "embeddable")


def lint_excalidraw(src: str | dict) -> list[LintIssue]:
    issues: list[LintIssue] = []
    text = src if isinstance(src, str) else json.dumps(src, ensure_ascii=False, separators=(",", ":"))
    size = len(text.encode("utf-8"))
    if size > MAX_SOURCE_BYTES:
        issues.append(LintIssue("warn", "file-size", f'source is {_mb(size)} MB (> 2 MB); embedded images in "files" bloat it'))
    doc = json.loads(src) if isinstance(src, str) else src
    lo = hi = None
    hues: set[str] = set()
    for el in doc.get("elements") or []:
        if not isinstance(el, dict) or _truthy(el.get("isDeleted")):
            continue
        for fld in ("strokeColor", "backgroundColor"):
            h = _hue_of(el.get(fld))
            if h:
                hues.add(h)
        if _is_num(el.get("x")):
            pts = el.get("points") if isinstance(el.get("points"), list) else None
            xs = ([el["x"] + p[0] for p in pts if isinstance(p, list) and p and _is_num(p[0])] if pts
                  else [el["x"], el["x"] + (el["width"] if _is_num(el.get("width")) else 0)])
            if xs:
                lo = min(xs) if lo is None else min(lo, *xs)
                hi = max(xs) if hi is None else max(hi, *xs)
        el_id = el.get("id")
        typ = js_string(el.get("type")) if "type" in el else "undefined"
        for fld in ("strokeColor", "backgroundColor"):
            v = el.get(fld)
            if isinstance(v, str):
                i = _color_issue(f"{typ} {fld}", v, el_id, fld)
                if i:
                    issues.append(i)
        fs = el.get("fontSize")
        if typ == "text" and _is_num(fs) and not _font_size_ok(fs):
            issues.append(LintIssue("warn", "font-size", f"text fontSize {js_number(fs)} is not one of {_sizes_text()} (±{FONT_TOLERANCE})", el_id))
        if typ in _GRID_TYPES and not (typ == "text" and _truthy(el.get("containerId"))):
            off = [k for k in ("x", "y") if _is_num(el.get(k)) and not _on_grid(el[k])]
            if off:
                pos = ", ".join(f"{k}={js_number(el[k])}" for k in off)
                issues.append(LintIssue("warn", "grid", f"{typ} {pos} not aligned to {js_number(P.grid())}px grid", el_id))
        for k, v in el.items():
            if re.search("shadow", k, re.I) and _truthy(v):
                issues.append(LintIssue("error", "shadow", f"{typ} uses shadow ({k})", el_id))
            if isinstance(v, str) and re.search(r"gradient\(", v, re.I):
                issues.append(LintIssue("error", "gradient", f"{typ} {k} uses a gradient", el_id))
    w = _width_issue(hi - lo) if lo is not None and hi is not None else None
    if w:
        issues.append(w)
    h = _hue_count_issue(hues)
    if h:
        issues.append(h)
    return issues


# ---------------------------------------------------------------- draw.io

def parse_style(style: str) -> dict[str, str]:
    m: dict[str, str] = {}
    for part in style.split(";"):
        if not part:
            continue
        i = part.find("=")
        if i < 0:
            m[part] = ""
        else:
            m[part[:i]] = part[i + 1:]
    return m


_STYLE_COLOR_KEYS = ("fillColor", "strokeColor", "fontColor", "labelBackgroundColor", "labelBorderColor",
                     "swimlaneFillColor", "background", "gradientColor")
_CELL_TAGS = ("mxCell", "object", "UserObject")
_VALUE_COLOR_RE = re.compile(r"""(?:color\s*[:=]\s*["']?|color&quot;?\s*[:=]\s*)(#[0-9a-fA-F]{3,8})\b""", re.ASCII)


def _grouped(node: Node) -> list[tuple[str, list[Node]]]:
    """按子元素名分组（首次出现顺序），复刻 fast-xml-parser 非 preserveOrder 模式下的对象键顺序。"""
    groups: dict[str, list[Node]] = {}
    for c in node.elements():
        groups.setdefault(c.tag, []).append(c)
    return list(groups.items())


def _collect_cells(node: Node, out: list[Node]) -> None:
    for name, items in _grouped(node):
        for c in items:
            if name in _CELL_TAGS:
                out.append(c)
            _collect_cells(c, out)


def _drawio_pages(root: Node) -> list[Node]:
    mxfile = root.elements("mxfile")
    if mxfile:
        diagrams = mxfile[0].elements("diagram")
        if diagrams:
            return diagrams
    models = root.elements("mxGraphModel")
    if models:
        return [Node("page", None, list(models))]
    return []


def lint_drawio(xml: str) -> list[LintIssue]:
    issues: list[LintIssue] = []
    size = len(xml.encode("utf-8"))
    if size > MAX_SOURCE_BYTES:
        issues.append(LintIssue("warn", "file-size", f"source is {_mb(size)} MB (> 2 MB)"))
    if any(p.compressed for p in list_pages(xml)):
        issues.append(LintIssue("warn", "compressed", "diagram content is compressed; run normalize to store plain XML", None, LintFix("compressed", "normalize")))
    plain = normalize_drawio(xml)
    for pi, page in enumerate(_drawio_pages(parse_xml(plain))):
        cells: list[Node] = []
        _collect_cells(page, cells)
        models = page.elements("mxGraphModel")
        math_on = bool(models) and (models[0].attrs or {}).get("math") == "1"
        lo = hi = None
        hues: set[str] = set()
        for cell in cells:
            a = cell.attrs or {}
            el_id = a.get("id")
            style = parse_style(a.get("style", ""))
            geoms = cell.elements("mxGeometry")
            geom = geoms[0] if len(geoms) == 1 and (geoms[0].attrs or geoms[0].children) else None
            for key in _STYLE_COLOR_KEYS:
                v = style.get(key)
                if v is None:
                    continue
                if key == "gradientColor":
                    if not _SKIP_COLOR.match(v):
                        issues.append(LintIssue("error", "gradient", f"gradientColor={v} (gradients are not allowed)", el_id, LintFix("gradientColor", "none", v, pi)))
                    continue
                i = _color_issue(f"style {key}", v, el_id, key, pi)
                if i:
                    issues.append(i)
                h = _hue_of(v)
                if h:
                    hues.add(h)
            if style.get("shadow") == "1":
                issues.append(LintIssue("error", "shadow", "shadow=1 (shadows are not allowed)", el_id, LintFix("shadow", "0", "1", pi)))
            fs = style.get("fontSize")
            if fs is not None:
                num = _js_to_number(fs)
                if num is not None and not _font_size_ok(num):
                    issues.append(LintIssue("warn", "font-size", f"fontSize={fs} is not one of {_sizes_text()} (±{FONT_TOLERANCE})", el_id))
            value = a.get("value")
            if isinstance(value, str) and "$$" in value:
                issues.append(LintIssue("warn", "math", "label uses $$...$$; write \\(\\displaystyle ...\\) and break lines with <br>", el_id))
            if isinstance(value, str) and not math_on and re.search(r"\\\(.+?\\\)", value):
                issues.append(LintIssue("error", "math", 'label contains \\(...\\) but the page has math="0"; set math="1" on <mxGraphModel>', el_id))
            if a.get("vertex") == "1" and geom is not None:
                gx, gw = _js_to_number((geom.attrs or {}).get("x", "0")), _js_to_number((geom.attrs or {}).get("width", "0"))
                if gx is not None and gw is not None:
                    lo = gx if lo is None else min(lo, gx)
                    hi = gx + gw if hi is None else max(hi, gx + gw)
            if isinstance(value, str):
                for m in _VALUE_COLOR_RE.finditer(value):
                    i = _color_issue("value html color", m.group(1), el_id, "value")
                    if i:
                        i.fix = None
                        issues.append(i)
            if a.get("vertex") == "1" and geom is not None:
                ga = geom.attrs or {}
                off = []
                for k in ("x", "y"):
                    if k in ga:
                        num = _js_to_number(ga[k])
                        if num is None or not _on_grid(num):
                            off.append(k)
                if off:
                    pos = ", ".join(f"{k}={ga[k]}" for k in off)
                    issues.append(LintIssue("warn", "grid", f"{pos} not aligned to {js_number(P.grid())}px grid", el_id))
        w = _width_issue(hi - lo, f"page {pi + 1}: " if pi else "") if lo is not None and hi is not None else None
        if w:
            issues.append(w)
        h = _hue_count_issue(hues, f"page {pi + 1}: " if pi else "")
        if h:
            issues.append(h)
    return issues


def _js_to_number(s: str) -> float | None:
    """JS 的 Number(s)；NaN 与 ±Infinity 返回 None（两处调用都把它们当作“非有限数”）。"""
    t = s.strip()
    if t == "":
        return 0.0
    try:
        if re.fullmatch(r"[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?", t):
            return float(t)
        if re.fullmatch(r"0[xX][0-9a-fA-F]+", t):
            return float(int(t, 16))
    except ValueError:
        pass
    return None


# ---------------------------------------------------------------- fixes

def _set_style_key(style: str, key: str, to: str) -> str:
    parts = [p for p in style.split(";") if p]
    hit = False
    nxt = []
    for p in parts:
        if p == key or p.startswith(f"{key}="):
            hit = True
            nxt.append(f"{key}={to}")
        else:
            nxt.append(p)
    if not hit:
        nxt.append(f"{key}={to}")
    return ";".join(nxt) + ";"


def apply_fixes(kind: str, source: str, issues: list[LintIssue]) -> str:
    """应用 issues 中带 fix 的修复，返回新的源文件文本。drawio 会同时解压为明文。"""
    fixable = [i for i in issues if i.fix]
    if kind == "excalidraw":
        doc = json.loads(source)
        for i in fixable:
            el = next((e for e in doc.get("elements") or [] if isinstance(e, dict) and e.get("id") == i.element_id), None)
            if el is not None and i.fix.field != "compressed":  # type: ignore[union-attr]
                el[i.fix.field] = i.fix.to  # type: ignore[union-attr]
        return stringify(doc) + "\n"
    xml = normalize_drawio(source)
    for i in reversed(fixable):
        fx = i.fix
        assert fx is not None
        if fx.field == "compressed" or not i.element_id:
            continue
        ranges = [(m.start(), m.end()) for m in re.finditer(r"<diagram\b[\s\S]*?</diagram>", xml)]
        if not ranges:
            ranges = [(0, len(xml))]
        page = fx.page or 0
        start, end = ranges[page] if page < len(ranges) else ranges[0]
        sl = xml[start:end]
        tag = re.search(rf'<(mxCell|object|UserObject)\b[^>]*\sid="{re.escape(i.element_id)}"[^>]*>', sl)
        if not tag:
            continue
        t = tag.group(0)
        if re.search(r'\sstyle="([^"]*)"', t):
            new_tag = re.sub(r'\sstyle="([^"]*)"', lambda m: f' style="{_set_style_key(m.group(1), fx.field, js_string(fx.to))}"', t, count=1)
        else:
            new_tag = t
        xml = xml[:start] + sl[: tag.start()] + new_tag + sl[tag.end():] + xml[end:]
    return xml


def issue_to_dict(i: LintIssue) -> dict:
    d: dict[str, Any] = {"level": i.level, "rule": i.rule, "message": i.message}
    if i.element_id is not None:
        d["elementId"] = i.element_id
    if i.fix:
        f: dict[str, Any] = {"field": i.fix.field}
        if i.fix.from_ is not None:
            f["from"] = i.fix.from_
        f["to"] = i.fix.to
        if i.fix.page is not None:
            f["page"] = i.fix.page
        d["fix"] = f
    return d
