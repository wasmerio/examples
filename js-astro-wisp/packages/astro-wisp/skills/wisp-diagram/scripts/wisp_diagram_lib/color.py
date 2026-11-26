"""CSS 颜色解析与 CIEDE2000，行为对齐 culori 4（T5a 的 TS 实现所用）。只依赖标准库。

支持：#rgb/#rgba/#rrggbb/#rrggbbaa（与 culori 一样允许省略 #）、rgb()/rgba()、hsl()/hsla()
（逗号旧语法与空格新语法）、CSS 颜色名、transparent。
"""
from __future__ import annotations

import math
import re
from dataclasses import dataclass

NAMED = {k: v for k, v in (p.split(":") for p in """
aliceblue:f0f8ff antiquewhite:faebd7 aqua:00ffff aquamarine:7fffd4 azure:f0ffff beige:f5f5dc bisque:ffe4c4
black:000000 blanchedalmond:ffebcd blue:0000ff blueviolet:8a2be2 brown:a52a2a burlywood:deb887 cadetblue:5f9ea0
chartreuse:7fff00 chocolate:d2691e coral:ff7f50 cornflowerblue:6495ed cornsilk:fff8dc crimson:dc143c cyan:00ffff
darkblue:00008b darkcyan:008b8b darkgoldenrod:b8860b darkgray:a9a9a9 darkgreen:006400 darkgrey:a9a9a9
darkkhaki:bdb76b darkmagenta:8b008b darkolivegreen:556b2f darkorange:ff8c00 darkorchid:9932cc darkred:8b0000
darksalmon:e9967a darkseagreen:8fbc8f darkslateblue:483d8b darkslategray:2f4f4f darkslategrey:2f4f4f
darkturquoise:00ced1 darkviolet:9400d3 deeppink:ff1493 deepskyblue:00bfff dimgray:696969 dimgrey:696969
dodgerblue:1e90ff firebrick:b22222 floralwhite:fffaf0 forestgreen:228b22 fuchsia:ff00ff gainsboro:dcdcdc
ghostwhite:f8f8ff gold:ffd700 goldenrod:daa520 gray:808080 green:008000 greenyellow:adff2f grey:808080
honeydew:f0fff0 hotpink:ff69b4 indianred:cd5c5c indigo:4b0082 ivory:fffff0 khaki:f0e68c lavender:e6e6fa
lavenderblush:fff0f5 lawngreen:7cfc00 lemonchiffon:fffacd lightblue:add8e6 lightcoral:f08080 lightcyan:e0ffff
lightgoldenrodyellow:fafad2 lightgray:d3d3d3 lightgreen:90ee90 lightgrey:d3d3d3 lightpink:ffb6c1
lightsalmon:ffa07a lightseagreen:20b2aa lightskyblue:87cefa lightslategray:778899 lightslategrey:778899
lightsteelblue:b0c4de lightyellow:ffffe0 lime:00ff00 limegreen:32cd32 linen:faf0e6 magenta:ff00ff maroon:800000
mediumaquamarine:66cdaa mediumblue:0000cd mediumorchid:ba55d3 mediumpurple:9370db mediumseagreen:3cb371
mediumslateblue:7b68ee mediumspringgreen:00fa9a mediumturquoise:48d1cc mediumvioletred:c71585
midnightblue:191970 mintcream:f5fffa mistyrose:ffe4e1 moccasin:ffe4b5 navajowhite:ffdead navy:000080
oldlace:fdf5e6 olive:808000 olivedrab:6b8e23 orange:ffa500 orangered:ff4500 orchid:da70d6 palegoldenrod:eee8aa
palegreen:98fb98 paleturquoise:afeeee palevioletred:db7093 papayawhip:ffefd5 peachpuff:ffdab9 peru:cd853f
pink:ffc0cb plum:dda0dd powderblue:b0e0e6 purple:800080 rebeccapurple:663399 red:ff0000 rosybrown:bc8f8f
royalblue:4169e1 saddlebrown:8b4513 salmon:fa8072 sandybrown:f4a460 seagreen:2e8b57 seashell:fff5ee
sienna:a0522d silver:c0c0c0 skyblue:87ceeb slateblue:6a5acd slategray:708090 slategrey:708090 snow:fffafa
springgreen:00ff7f steelblue:4682b4 tan:d2b48c teal:008080 thistle:d8bfd8 tomato:ff6347 turquoise:40e0d0
violet:ee82ee wheat:f5deb3 white:ffffff whitesmoke:f5f5f5 yellow:ffff00 yellowgreen:9acd32
""".split())}


@dataclass
class RGB:
    r: float
    g: float
    b: float
    alpha: float | None = None


_NUM = r"([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)"
_PER = _NUM + "%"
_NUM_PER = f"(?:{_NUM}%|{_NUM})"
_HUE = f"(?:{_NUM}(deg|grad|rad|turn)|{_NUM})"
_C = r"\s*,\s*"
_HEX = re.compile(r"^#?([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})$", re.I)
_RGB_NUM_OLD = re.compile(rf"^rgba?\(\s*{_NUM}{_C}{_NUM}{_C}{_NUM}\s*(?:,\s*{_NUM_PER}\s*)?\)$")
_RGB_PER_OLD = re.compile(rf"^rgba?\(\s*{_PER}{_C}{_PER}{_C}{_PER}\s*(?:,\s*{_NUM_PER}\s*)?\)$")
_HSL_OLD = re.compile(rf"^hsla?\(\s*{_HUE}{_C}{_PER}{_C}{_PER}\s*(?:,\s*{_NUM_PER}\s*)?\)$")
_TOK = r"([+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?(?:%|deg|grad|rad|turn)?|none)"
_MODERN = re.compile(rf"^(rgba?|hsla?)\(\s*{_TOK}\s+{_TOK}\s+{_TOK}\s*(?:/\s*{_TOK}\s*)?\)$")

_HUE_UNITS = {"deg": 1.0, "rad": 180 / math.pi, "grad": 9 / 10, "turn": 360.0}


def _clamp01(v: float) -> float:
    return max(0.0, min(1.0, v))


def _parse_hex(s: str) -> RGB | None:
    m = _HEX.match(s)
    if not m:
        return None
    h = m.group(1)
    if len(h) in (3, 4):
        h = "".join(c * 2 for c in h)
    n = [int(h[i:i + 2], 16) / 255 for i in range(0, len(h), 2)]
    return RGB(n[0], n[1], n[2], n[3] if len(n) == 4 else None)


def _hsl_to_rgb(h: float | None, s: float | None, l: float | None, alpha: float | None) -> RGB:
    h = (h or 0.0) % 360
    if h < 0:
        h += 360
    s = s or 0.0
    l = l or 0.0
    m1 = l + s * (l if l < 0.5 else 1 - l)
    m2 = m1 - (m1 - l) * 2 * abs(((h / 60) % 2) - 1)
    seg = math.floor(h / 60)
    table = {
        0: (m1, m2, 2 * l - m1), 1: (m2, m1, 2 * l - m1), 2: (2 * l - m1, m1, m2),
        3: (2 * l - m1, m2, m1), 4: (m2, 2 * l - m1, m1), 5: (m1, 2 * l - m1, m2),
    }
    r, g, b = table.get(seg, (2 * l - m1,) * 3)
    return RGB(r, g, b, alpha)


def _alpha(per: str | None, num: str | None) -> float | None:
    if per is not None:
        return _clamp01(float(per) / 100)
    if num is not None:
        return _clamp01(float(num))
    return None


def _parse_modern(s: str) -> RGB | None:
    m = _MODERN.match(s)
    if not m:
        return None
    fn, a, b, c, al = m.groups()

    def kind(t: str) -> tuple[str, float | None]:
        if t == "none":
            return ("none", None)
        for u, f in _HUE_UNITS.items():
            if t.endswith(u):
                return ("hue", float(t[: -len(u)]) * f)
        if t.endswith("%"):
            return ("per", float(t[:-1]))
        return ("num", float(t))

    ka, kb, kc = kind(a), kind(b), kind(c)
    alpha = None
    if al is not None:
        k = kind(al)
        if k[0] == "hue":
            return None
        if k[0] != "none":
            alpha = min(1.0, max(0.0, k[1] if k[0] == "num" else k[1] / 100))  # type: ignore[operator]
    if fn.startswith("rgb"):
        if "hue" in (ka[0], kb[0], kc[0]):
            return None
        ch = [0.0 if t == "none" else (v / 255 if t == "num" else v / 100) for t, v in (ka, kb, kc)]  # type: ignore[operator]
        return RGB(ch[0], ch[1], ch[2], alpha)
    if ka[0] == "per" or kb[0] == "hue" or kc[0] == "hue":
        return None
    h = None if ka[0] == "none" else ka[1]
    s_ = None if kb[0] == "none" else kb[1] / 100  # type: ignore[operator]
    l_ = None if kc[0] == "none" else kc[1] / 100  # type: ignore[operator]
    return _hsl_to_rgb(h, s_, l_, alpha)


def parse(color: str) -> RGB | None:
    """culori.parse 的子集。失败返回 None。"""
    s = color.strip()
    r = _parse_modern(s) or _parse_hex(s)
    if r:
        return r
    m = _RGB_NUM_OLD.match(s)
    if m:
        return RGB(float(m[1]) / 255, float(m[2]) / 255, float(m[3]) / 255, _alpha(m[4], m[5]))
    m = _RGB_PER_OLD.match(s)
    if m:
        return RGB(float(m[1]) / 100, float(m[2]) / 100, float(m[3]) / 100, _alpha(m[4], m[5]))
    named = NAMED.get(s.lower())
    if named:
        return _parse_hex(named)
    if s == "transparent":
        return RGB(0, 0, 0, 0)
    m = _HSL_OLD.match(s)
    if m:
        if m[3] is not None:
            h = float(m[3])
        else:
            h = float(m[1]) * _HUE_UNITS[m[2]]
        return _hsl_to_rgb(h, min(max(0.0, float(m[4]) / 100), 1.0), min(max(0.0, float(m[5]) / 100), 1.0), _alpha(m[6], m[7]))
    return None


def _js_round(v: float) -> int:
    return math.floor(v + 0.5)


def format_hex(c: RGB) -> str:
    def fix(v: float) -> int:
        return _js_round(_clamp01(v or 0) * 255)

    return "#%02x%02x%02x" % (fix(c.r), fix(c.g), fix(c.b))


# ---------------------------------------------------------------- CIEDE2000（lab65，同 culori）

_D65 = (0.3127 / 0.329, 1.0, (1 - 0.3127 - 0.329) / 0.329)
_K = 29**3 / 3**3
_E = 6**3 / 29**3


def _lin(c: float) -> float:
    a = abs(c)
    if a <= 0.04045:
        return c / 12.92
    return (math.copysign(1, c) if c != 0 else 1) * ((a + 0.055) / 1.055) ** 2.4


def _cbrt(v: float) -> float:
    return math.copysign(abs(v) ** (1 / 3), v) if not hasattr(math, "cbrt") else math.cbrt(v)


def to_lab65(c: RGB) -> tuple[float, float, float]:
    r, g, b = _lin(c.r), _lin(c.g), _lin(c.b)
    x = 0.4123907992659593 * r + 0.357584339383878 * g + 0.1804807884018343 * b
    y = 0.2126390058715102 * r + 0.715168678767756 * g + 0.0721923153607337 * b
    z = 0.0193308187155918 * r + 0.119194779794626 * g + 0.9505321522496607 * b

    def f(v: float) -> float:
        return _cbrt(v) if v > _E else (_K * v + 16) / 116

    f0, f1, f2 = f(x / _D65[0]), f(y / _D65[1]), f(z / _D65[2])
    return (116 * f1 - 16, 500 * (f0 - f1), 200 * (f1 - f2))


def ciede2000(std: RGB, smp: RGB) -> float:
    lStd, aStd, bStd = to_lab65(std)
    lSmp, aSmp, bSmp = to_lab65(smp)
    cStd = math.sqrt(aStd * aStd + bStd * bStd)
    cSmp = math.sqrt(aSmp * aSmp + bSmp * bSmp)
    cAvg = (cStd + cSmp) / 2
    G = 0.5 * (1 - math.sqrt(cAvg**7 / (cAvg**7 + 25**7)))
    apStd = aStd * (1 + G)
    apSmp = aSmp * (1 + G)
    cpStd = math.sqrt(apStd * apStd + bStd * bStd)
    cpSmp = math.sqrt(apSmp * apSmp + bSmp * bSmp)
    hpStd = 0.0 if abs(apStd) + abs(bStd) == 0 else math.atan2(bStd, apStd)
    hpStd += (hpStd < 0) * 2 * math.pi
    hpSmp = 0.0 if abs(apSmp) + abs(bSmp) == 0 else math.atan2(bSmp, apSmp)
    hpSmp += (hpSmp < 0) * 2 * math.pi
    dL = lSmp - lStd
    dC = cpSmp - cpStd
    dhp = 0.0 if cpStd * cpSmp == 0 else hpSmp - hpStd
    dhp -= (dhp > math.pi) * 2 * math.pi
    dhp += (dhp < -math.pi) * 2 * math.pi
    dH = 2 * math.sqrt(cpStd * cpSmp) * math.sin(dhp / 2)
    Lp = (lStd + lSmp) / 2
    Cp = (cpStd + cpSmp) / 2
    if cpStd * cpSmp == 0:
        hp = hpStd + hpSmp
    else:
        hp = (hpStd + hpSmp) / 2
        hp -= (abs(hpStd - hpSmp) > math.pi) * math.pi
        hp += (hp < 0) * 2 * math.pi
    Lpm50 = (Lp - 50) ** 2
    T = (1 - 0.17 * math.cos(hp - math.pi / 6) + 0.24 * math.cos(2 * hp)
         + 0.32 * math.cos(3 * hp + math.pi / 30) - 0.2 * math.cos(4 * hp - (63 * math.pi) / 180))
    Sl = 1 + (0.015 * Lpm50) / math.sqrt(20 + Lpm50)
    Sc = 1 + 0.045 * Cp
    Sh = 1 + 0.015 * Cp * T
    deltaTheta = ((30 * math.pi) / 180) * math.exp(-1 * (((180 / math.pi) * hp - 275) / 25) ** 2)
    Rc = 2 * math.sqrt(Cp**7 / (Cp**7 + 25**7))
    Rt = -1 * math.sin(2 * deltaTheta) * Rc
    return math.sqrt((dL / Sl) ** 2 + (dC / Sc) ** 2 + (dH / Sh) ** 2 + (((Rt * dC) / Sc) * dH) / Sh)


def to_fixed(v: float, digits: int) -> str:
    """JS Number.prototype.toFixed（对 ΔE 这类小正数足够；按十进制展开四舍五入）。"""
    from decimal import ROUND_HALF_UP, Decimal

    return str(Decimal(v).quantize(Decimal(1).scaleb(-digits), rounding=ROUND_HALF_UP))
