"""调色板工具：只依赖 skills/wisp-diagram/palette.json，整个 skill 可独立复制。"""
from __future__ import annotations

import json
from dataclasses import dataclass
from functools import lru_cache

from . import color as _c
from .env import SKILL_DIR

PALETTE_PATH = SKILL_DIR / "palette.json"


@lru_cache(maxsize=1)
def palette() -> dict:
    return json.loads(PALETTE_PATH.read_text("utf-8"))


def hues() -> list[str]:
    return [k for k in palette()["color"]["hue"] if not k.startswith("$")]


#: 进入 --wd-* 变量表的 base 令牌（accent-fg、code-bg、selection 不属于图表）
WD_BASE = ("bg", "surface", "surface-2", "border", "fg", "muted", "subtle", "accent")

#: 这些十六进制写法一律视为 fg（Excalidraw 默认黑等）
FG_ALIASES = ("#000000", "#1e1e1e", "#1d1d1f")


@dataclass(frozen=True)
class Token:
    name: str
    css_var: str
    light: str
    dark: str

    def get(self, mode: str) -> str:
        return self.light if mode == "light" else self.dark


@dataclass(frozen=True)
class ParsedColor:
    hex: str
    alpha: float


def parse_color(value: str) -> ParsedColor | None:
    """解析任意 CSS 颜色，失败返回 None。"""
    c = _c.parse(value.strip())
    if c is None:
        return None
    return ParsedColor(_c.format_hex(c), 1.0 if c.alpha is None else c.alpha)


def normalize_hex(value: str) -> str | None:
    p = parse_color(value)
    return p.hex if p else None


def _norm(p: dict) -> tuple[str, str]:
    return normalize_hex(p["light"]), normalize_hex(p["dark"])  # type: ignore[return-value]


@lru_cache(maxsize=1)
def tokens() -> tuple[Token, ...]:
    """全部图表令牌。hue 在前，所以 accent 与 teal 同色时优先匹配 teal。"""
    p = palette()
    out: list[Token] = []
    for h in hues():
        hv = p["color"]["hue"][h]
        out.append(Token(h, f"--wd-{h}", *_norm(hv["stroke"])))
        out.append(Token(f"{h}-fill", f"--wd-{h}-fill", *_norm(hv["fill"])))
    for b in WD_BASE:
        pair = p["color"]["base"].get(b)
        if pair:
            out.append(Token(b, f"--wd-{b}", *_norm(pair)))
    return tuple(out)


def token(name: str) -> Token:
    return next(t for t in tokens() if t.name == name)


def exact_token(value: str) -> Token | None:
    h = normalize_hex(value)
    if not h:
        return None
    if h in FG_ALIASES:
        return token("fg")
    return next((t for t in tokens() if t.light == h), None)


def is_white(value: str) -> bool:
    return normalize_hex(value) == "#ffffff"


@dataclass(frozen=True)
class Nearest:
    token: Token
    delta_e: float


def nearest_token(value: str) -> Nearest:
    """在全部令牌的 light 值中找 ΔE2000 最近者。"""
    target = _c.parse(value.strip())
    if target is None:
        raise ValueError(f"Not a color: {value}")
    best: Nearest | None = None
    for t in tokens():
        d = _c.ciede2000(target, _c.parse(t.light))  # type: ignore[arg-type]
        if best is None or d < best.delta_e:
            best = Nearest(t, d)
    assert best is not None
    return best


@dataclass(frozen=True)
class ResolvedColor:
    hue: str
    stroke: dict
    fill: dict


def resolve_color(name: str) -> ResolvedColor | None:
    """解析 hue 名或语义名（q、k、v、weight…）。未知返回 None。"""
    if name.startswith("$"):
        return None
    p = palette()["color"]
    hue = name if name in p["hue"] else p["semantic"].get(name)
    h = p["hue"].get(hue) if isinstance(hue, str) else None
    if not hue or not h:
        return None
    return ResolvedColor(hue, h["stroke"], h["fill"])


def _quote_font(f: str) -> str:
    name = f[: -len(" Variable")] if f.endswith(" Variable") else f
    return f'"{name}"' if any(ch.isspace() for ch in name) else name


def font_stack(kind: str) -> str:
    """字体栈。去掉 " Variable" 后缀（站点外没有这些可变字体名）并去重。"""
    seen: dict[str, None] = {}
    for f in palette()["font"][kind]:
        seen.setdefault(_quote_font(f), None)
    return ",".join(seen)


def wd_vars(mode: str) -> dict[str, str]:
    """某个主题下的 --wd-* 变量表（bg 固定为 transparent，字体变量只在 light 中给出）。"""
    v: dict[str, str] = {t.css_var: t.get(mode) for t in tokens()}
    v["--wd-bg"] = "transparent"
    if mode == "light":
        v["--wd-font-sans"] = font_stack("sans")
        v["--wd-font-mono"] = font_stack("mono")
        v["--wd-font-hand"] = font_stack("hand")
    return v


def wd_style_css() -> str:
    """作用域化的 CSS：light 默认值 + prefers-color-scheme:dark 覆盖。"""
    def body(v: dict[str, str]) -> str:
        return ";".join(f"{k}:{x}" for k, x in v.items())

    return f".wisp-d{{{body(wd_vars('light'))}}}@media (prefers-color-scheme:dark){{.wisp-d{{{body(wd_vars('dark'))}}}}}"


def is_palette_color(value: str) -> bool:
    """允许出现在源文件里的颜色（light 令牌 + 白 + 黑 + 默认黑）。"""
    h = normalize_hex(value)
    if not h:
        return False
    return h == "#ffffff" or exact_token(h) is not None


def font_sizes() -> list[float]:
    return list(palette()["diagram"]["font-size-px"].values())


def grid() -> float:
    return palette()["diagram"]["grid-px"]
