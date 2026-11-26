"""字体：Excalifont（@excalidraw/excalidraw 0.18.1 dist）、Inter、Noto Sans SC（@fontsource-variable）。
全部按版本从 jsDelivr 下载并缓存（cdn.py）。

- 浏览器导出页用 font_face_css() 注册字体，保证文本测量与最终渲染一致；
- --embed-fonts 用 embed_fonts() 按图中实际字符裁剪子集（fontTools），以 base64 woff2 写入 <style>。

族名与 palette.font_stack() 一致（去掉 " Variable" 后缀）：Inter、"Noto Sans SC"、Excalifont。
"""
from __future__ import annotations

import base64
import io
import re
from dataclasses import dataclass, field
from functools import lru_cache

from . import cdn
from .versions import EXCALIDRAW_DIST, EXCALIFONT_SHARDS, INTER, INTER_CSS, NOTO_SC, NOTO_SC_CSS, npm_path

FAMILIES = ("Excalifont", "Inter", "Noto Sans SC")


@dataclass(frozen=True)
class FontShard:
    family: str
    #: jsDelivr 路径（/npm/...）
    path: str
    unicode_range: str
    ranges: tuple[tuple[int, int], ...] = field(default=())
    weight: str | None = None

    @property
    def file(self) -> str:
        return self.path.rsplit("/", 1)[-1]


def parse_unicode_range(text: str) -> list[tuple[int, int]]:
    out: list[tuple[int, int]] = []
    for part in text.split(","):
        t = re.sub(r"^U\+", "", part.strip(), flags=re.I)
        if not t:
            continue
        if "?" in t:
            out.append((int(t.replace("?", "0"), 16), int(t.replace("?", "f"), 16)))
        elif "-" in t:
            a, b = t.split("-", 1)
            out.append((int(a, 16), int(re.sub(r"^U\+", "", b, flags=re.I), 16)))
        else:
            n = int(t, 16)
            out.append((n, n))
    return out


def in_ranges(cp: int, ranges) -> bool:
    return any(a <= cp <= b for a, b in ranges)


def _fontsource_shards(css_path: str, pkg: str, version: str, family: str) -> list[FontShard]:
    css = cdn.fetch_npm(css_path, quiet=True).decode("utf-8")
    shards: list[FontShard] = []
    for block in re.findall(r"@font-face\s*\{[^}]*\}", css):
        if not re.search(r"font-style:\s*normal", block):
            continue
        url = re.search(r"url\(\./([^)]+)\)", block)
        rng = re.search(r"unicode-range:\s*([^;]+);", block)
        wt = re.search(r"font-weight:\s*([^;]+);", block)
        if not url or not rng:
            continue
        r = rng.group(1).strip()
        shards.append(FontShard(family, npm_path(pkg, version, url.group(1)), r, tuple(parse_unicode_range(r)),
                                wt.group(1).strip() if wt else None))
    return shards


@lru_cache(maxsize=None)
def shards_for(family: str) -> tuple[FontShard, ...]:
    if family == "Excalifont":
        return tuple(FontShard("Excalifont", f"{EXCALIDRAW_DIST}fonts/Excalifont/{f}", r, tuple(parse_unicode_range(r)))
                     for f, r in EXCALIFONT_SHARDS)
    if family == "Inter":
        return tuple(_fontsource_shards(INTER_CSS, "@fontsource-variable/inter", INTER, "Inter"))
    if family == "Noto Sans SC":
        return tuple(_fontsource_shards(NOTO_SC_CSS, "@fontsource-variable/noto-sans-sc", NOTO_SC, "Noto Sans SC"))
    raise ValueError(family)


def _face_rule(family: str, src: str, s: FontShard) -> str:
    w = f"font-weight:{s.weight};" if s.weight else ""
    return f'@font-face{{font-family:"{family}";font-style:normal;{w}font-display:block;src:{src};unicode-range:{s.unicode_range}}}'


def font_face_css(families, url_for, aliases: dict[str, list[str]] | None = None) -> str:
    """浏览器页面用的 @font-face。aliases 可把同一组文件再注册成别的族名
    （把 Noto Sans SC 注册成 Excalidraw 的 CJK 回退族 Xiaolai，使中文按 Noto SC 测量）。"""
    rules: list[str] = []
    aliases = aliases or {}
    for f in families:
        for s in shards_for(f):
            for name in [f, *aliases.get(f, [])]:
                rules.append(_face_rule(name, f'url({url_for(s)}) format("woff2")', s))
    return "\n".join(rules)


_ENTITY = {"amp": "&", "lt": "<", "gt": ">", "quot": '"', "apos": "'", "nbsp": "\xa0"}


def decode_entities(s: str) -> str:
    def repl(m: re.Match) -> str:
        e = m.group(1)
        if e[0] == "#":
            return chr(int(e[2:], 16) if e[1] in "xX" else int(e[1:]))
        return _ENTITY.get(e, m.group(0))

    return re.sub(r"&(#x[0-9a-f]+|#\d+|\w+);", repl, s, flags=re.I | re.ASCII)


def collect_svg_text(svg: str) -> str:
    """收集 SVG 中所有可见文本字符（<text>、<foreignObject> 内的 HTML；<title>/<desc> 不计）。"""
    body = re.sub(r"<style\b[\s\S]*?</style>", "", svg)
    body = re.sub(r"<script\b[\s\S]*?</script>", "", body)
    body = re.sub(r"<(title|desc|metadata)\b[\s\S]*?</\1>", "", body)
    text = "".join(decode_entities(m) for m in re.findall(r">([^<]+)<", body))
    text = re.sub(r"\s+", " ", text)
    return "".join(dict.fromkeys(text))


def subset_woff2(data: bytes, text: str) -> bytes:
    from fontTools import subset
    from fontTools.ttLib import TTFont

    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = ["*"]
    opts.name_IDs = ["*"]
    opts.notdef_outline = True
    font = TTFont(io.BytesIO(data))
    sub = subset.Subsetter(opts)
    sub.populate(text=text)
    sub.subset(font)
    out = io.BytesIO()
    font.flavor = "woff2"
    font.save(out)
    return out.getvalue()


@dataclass
class EmbedResult:
    svg: str
    bytes: int
    families: list[str]


def embed_fonts(svg: str) -> EmbedResult:
    """按图中字符裁剪字体并内嵌。--wd-font-hand → Excalifont + Noto Sans SC；
    --wd-font-sans（或无变量）→ Inter + Noto Sans SC。"""
    stripped = re.sub(r"<style\b[^>]*data-wisp-fonts[^>]*>[\s\S]*?</style>", "", svg)
    no_style = re.sub(r"<style\b[\s\S]*?</style>", "", stripped)
    uses_hand = "--wd-font-hand" in no_style
    uses_sans = "--wd-font-sans" in no_style or not uses_hand
    families: list[str] = []
    if uses_hand:
        families.append("Excalifont")
    if uses_sans:
        families.append("Inter")
    families.append("Noto Sans SC")
    chars = [c for c in collect_svg_text(stripped) if c.strip() != ""]
    rules: list[str] = []
    total = 0
    for fam in families:
        for s in shards_for(fam):
            mine = [c for c in chars if in_ranges(ord(c), s.ranges)]
            if not mine:
                continue
            out = subset_woff2(cdn.fetch_npm(s.path), "".join(mine))
            total += len(out)
            rules.append(_face_rule(fam, f'url(data:font/woff2;base64,{base64.b64encode(out).decode("ascii")}) format("woff2")', s))
    if not rules:
        return EmbedResult(stripped, 0, families)
    style = f'<style data-wisp-fonts="1">{"".join(rules)}</style>'
    return EmbedResult(re.sub(r"<svg\b[^>]*>", lambda m: m.group(0) + style, stripped, count=1), total, families)


__all__ = ["FontShard", "shards_for", "font_face_css", "embed_fonts", "collect_svg_text", "decode_entities",
           "parse_unicode_range", "in_ranges"]
