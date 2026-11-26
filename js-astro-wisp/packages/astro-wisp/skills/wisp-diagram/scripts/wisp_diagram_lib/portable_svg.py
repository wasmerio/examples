"""把导出的 SVG 转成可移植 SVG（docs/diagrams.md §3）：
颜色 → var(--wd-x, fallback)，去背景矩形，注入作用域化 <style>，统一 font-family。"""
from __future__ import annotations

import math
import re
from dataclasses import dataclass, field

from . import palette as P
from .color import to_fixed

COLOR_PROPS = ["fill", "stroke", "stop-color", "flood-color", "lighting-color", "color"]
_COLOR_PROP_RE = "|".join(COLOR_PROPS)
_COLOR_IN_TEXT = re.compile(r"#[0-9a-fA-F]{8}\b|#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3,4}\b|(?:rgba?|hsla?)\([^)]*\)", re.ASCII)
_KEEP = re.compile(r"^(none|transparent|currentcolor|inherit|initial|unset)$", re.I)
_DECL_RE = re.compile(
    rf"(^|[;{{\s])({_COLOR_PROP_RE}|background|background-color|border-color|outline-color|filter|font-family)(\s*:\s*)([^;}}]+)",
    re.I,
)


@dataclass
class PortableSvgResult:
    svg: str
    warnings: list[str]
    unknown_colors: list[str]


@dataclass
class _Ctx:
    fix: bool
    warnings: list[str] = field(default_factory=list)
    unknown: dict[str, None] = field(default_factory=dict)
    snapped: dict[str, None] = field(default_factory=dict)


def _var_ref(css_var: str, fallback: str) -> str:
    return f"var({css_var}, {fallback})"


def _js_trim(s: str) -> str:
    from .xmlfmt import js_trim
    return js_trim(s)


def _map_one(raw: str, ctx: _Ctx) -> str | None:
    v = _js_trim(raw)
    if _KEEP.match(v) or v.startswith("var(") or v.startswith("url("):
        return None
    parsed = P.parse_color(v)
    if not parsed:
        return None
    if parsed.alpha == 0:
        return None
    if parsed.alpha < 1:
        ctx.unknown.setdefault(v.lower(), None)
        return None
    bg = P.token("bg")
    if P.is_white(parsed.hex):
        return _var_ref(bg.css_var, bg.light)
    exact = P.exact_token(parsed.hex)
    if exact:
        return _var_ref(exact.css_var, exact.light)
    if ctx.fix:
        n = P.nearest_token(parsed.hex)
        ctx.snapped.setdefault(f"{parsed.hex} -> {n.token.css_var} (ΔE {to_fixed(n.delta_e, 1)})", None)
        return _var_ref(n.token.css_var, n.token.light)
    ctx.unknown.setdefault(parsed.hex, None)
    return None


def _map_value(value: str, ctx: _Ctx) -> str:
    if "var(" in value:
        return value
    whole = _map_one(value, ctx)
    if whole:
        return whole
    if not _COLOR_IN_TEXT.search(value):
        return value
    return _COLOR_IN_TEXT.sub(lambda m: _map_one(m.group(0), ctx) or m.group(0), value)


def _font_var(value: str) -> str:
    v = value.lower()
    if "var(" in v:
        return value
    if re.search(r"virgil|excalifont|excalidraw|segoe print|comic", v):
        return "var(--wd-font-hand)"
    if re.search(r"cascadia|mono|courier|consolas|menlo", v):
        return "var(--wd-font-mono)"
    return "var(--wd-font-sans)"


def _map_declarations(css: str, ctx: _Ctx) -> str:
    def repl(m: re.Match) -> str:
        pre, prop, sep, val = m.group(1), m.group(2), m.group(3), m.group(4)
        if prop.lower() == "font-family":
            return f"{pre}{prop}{sep}{_font_var(_js_trim(val))}"
        return f"{pre}{prop}{sep}{_map_value(_js_trim(val), ctx)}"

    return _DECL_RE.sub(repl, css)


def _map_style_content(css: str, ctx: _Ctx) -> str:
    parts = re.split(r"(@font-face\s*\{[^}]*\})", css, flags=re.I)
    return "".join(p if re.match(r"@font-face", p, re.I) else _map_declarations(p, ctx) for p in parts)


def _parse_num(v: str | None) -> float | None:
    if v is None:
        return None
    m = re.match(r"^\s*([+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?)", v)
    if not m:
        return None
    n = float(m.group(1))
    return n if math.isfinite(n) else None


def _attr(tag: str, name: str) -> str | None:
    m = re.search(rf'\s{name}="([^"]*)"', tag)
    return m.group(1) if m else None


def _js_number_list(s: str) -> list[float]:
    out = []
    for part in re.split(r"[\s,]+", s):
        try:
            out.append(float(part) if part.strip() != "" else 0.0)
        except ValueError:
            out.append(float("nan"))
    return out


def _remove_background(svg: str, warnings: list[str]) -> str:
    m = re.search(r"<svg\b[^>]*>", svg)
    root_tag = m.group(0) if m else ""
    vb_raw = _attr(root_tag, "viewBox")
    vb = _js_number_list(_js_trim(vb_raw)) if vb_raw is not None else None
    removed = False
    bg = P.token("bg")

    def repl(mm: re.Match) -> str:
        nonlocal removed
        tag = mm.group(0)
        if removed:
            return tag
        fill_raw = _attr(tag, "fill")
        if fill_raw is None:
            sm = re.search(r'style="[^"]*\bfill\s*:\s*([^;"]+)', tag)
            fill_raw = sm.group(1) if sm else None
        if not fill_raw:
            return tag
        f = _js_trim(fill_raw)
        pc = P.parse_color(f)
        is_bg = P.is_white(f) or re.match(r"^var\(--wd-bg", f) is not None or (pc is not None and pc.hex == bg.light)
        if not is_bg:
            return tag
        w = _attr(tag, "width")
        h = _attr(tag, "height")
        x = _parse_num(_attr(tag, "x"))
        y = _parse_num(_attr(tag, "y"))
        x = 0.0 if x is None else x
        y = 0.0 if y is None else y
        if w == "100%" and h == "100%":
            covers = True
        elif vb and len(vb) == 4 and all(math.isfinite(v) for v in vb):
            vx, vy, vw, vh = vb
            pw = _parse_num(w)
            ph = _parse_num(h)
            covers = x <= vx + 1 and y <= vy + 1 and (pw or 0) >= vw - 2 and (ph or 0) >= vh - 2
        else:
            covers = False
        if not covers:
            return tag
        removed = True
        return ""

    out = re.sub(r"<rect\b[^>]*?(?:/>|>\s*</rect>)", repl, svg)
    if removed:
        warnings.append("removed background rect")
    return out


def _patch_root(svg: str, warnings: list[str]) -> str:
    def repl(m: re.Match) -> str:
        a = m.group(1)

        def style_repl(sm: re.Match) -> str:
            kept = [d for d in sm.group(1).split(";")
                    if _js_trim(d) and not re.match(r"^\s*(background(?:-color)?|color-scheme)\s*:", d, re.I)]
            return f' style="{";".join(kept)}"' if kept else ""

        a = re.sub(r'\sstyle="([^"]*)"', style_repl, a, count=1)
        if re.search(r'\sclass="', a):
            def cls_repl(cm: re.Match) -> str:
                cls = cm.group(1)
                return f' class="{cls}"' if re.search(r"(^|\s)wisp-d(\s|$)", cls) else f' class="{cls} wisp-d"'
            a = re.sub(r'\sclass="([^"]*)"', cls_repl, a, count=1)
        else:
            a += ' class="wisp-d"'
        if not re.search(r'\sxmlns="', a):
            a += ' xmlns="http://www.w3.org/2000/svg"'
            warnings.append("added missing xmlns")
        return f"<svg{a}>"

    return re.sub(r"<svg\b([^>]*)>", repl, svg, count=1)


def _protect(svg: str, pattern: str) -> tuple[str, "callable"]:
    saved: list[str] = []

    def repl(m: re.Match) -> str:
        saved.append(m.group(0))
        return f"<!--wd-protect-{len(saved) - 1}-->"

    out = re.sub(pattern, repl, svg)

    def restore(s: str) -> str:
        return re.sub(r"<!--wd-protect-(\d+)-->", lambda m: saved[int(m.group(1))], s)

    return out, restore


def to_portable_svg(raw_svg: str, *, style: str | None = None, fix: bool = False) -> PortableSvgResult:
    """转成可移植 SVG。`<mask>`、`<clipPath>`、`<pattern>` 内部原样保留；背景矩形只在
    `<defs>` 之外的顶层删除。"""
    ctx = _Ctx(fix=fix)
    svg = re.sub(r"<style\b[^>]*data-wisp-vars[^>]*>[\s\S]*?</style>", "", raw_svg)
    svg, restore_masks = _protect(svg, r"<(mask|clipPath|pattern)\b[^>]*>[\s\S]*?</\1>")
    svg, restore_defs = _protect(svg, r"<defs\b[^>]*>[\s\S]*?</defs>")
    svg = _remove_background(svg, ctx.warnings)
    svg = restore_defs(svg)
    svg = _patch_root(svg, ctx.warnings)
    svg = re.sub(r"(<style\b[^>]*>)([\s\S]*?)(</style>)", lambda m: f"{m.group(1)}{_map_style_content(m.group(2), ctx)}{m.group(3)}", svg)
    svg = re.sub(r'(\sstyle=")([^"]*)(")', lambda m: f"{m.group(1)}{_map_declarations(m.group(2), ctx)}{m.group(3)}", svg)
    svg = re.sub(rf'(\s(?:{_COLOR_PROP_RE})=")([^"]*)(")', lambda m: f"{m.group(1)}{_map_value(m.group(2), ctx)}{m.group(3)}", svg)
    svg = re.sub(r'(\sfont-family=")([^"]*)(")', lambda m: f"{m.group(1)}{_font_var(m.group(2))}{m.group(3)}", svg)
    style_el = f'<style data-wisp-vars="1">{P.wd_style_css()}</style>'
    svg = re.sub(r"<svg\b[^>]*>", lambda m: m.group(0) + style_el, svg, count=1)
    svg = restore_masks(svg)
    for s in ctx.snapped:
        ctx.warnings.append(f"snapped {s}")
    unknown = sorted(ctx.unknown)
    for u in unknown:
        ctx.warnings.append(f"unknown color {u} left unchanged")
    if style and not re.search(r"data-style=", svg):
        svg = re.sub(r"<svg\b", f'<svg data-style="{style}"', svg, count=1)
    return PortableSvgResult(svg, ctx.warnings, unknown)
