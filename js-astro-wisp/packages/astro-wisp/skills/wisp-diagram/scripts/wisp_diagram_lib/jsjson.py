"""与 JavaScript `JSON.stringify(value, null, 2)` 逐字节一致的序列化。

差异点（相对 Python json）：
- 数字按 ECMAScript Number::toString 格式化（1.0 → 1，1e-7 → 1e-7，0.000001 → 0.000001）；
- 对象中“数组索引形”的键（"0"、"12"…）按数值升序排在最前（JS 对象属性顺序规则）。
"""
from __future__ import annotations

import json
import math
import re
from typing import Any

_REPR = re.compile(r"^(-?)(\d+)(?:\.(\d+))?(?:e([+-]?\d+))?$")


def js_number(x: float | int) -> str:
    if isinstance(x, bool):
        return "true" if x else "false"
    if isinstance(x, int):
        if abs(x) <= 2**53:
            return str(x)
        x = float(x)
    if math.isnan(x) or math.isinf(x):
        return "null"
    if x == 0:
        return "0"
    m = _REPR.match(repr(x))
    if not m:  # pragma: no cover
        return repr(x)
    sign, ip, fp, ex = m.group(1), m.group(2), m.group(3) or "", int(m.group(4) or 0)
    digits = ip + fp
    exp10 = ex - len(fp)  # value = digits × 10^exp10
    s = digits.lstrip("0")
    stripped = s.rstrip("0")
    exp10 += len(s) - len(stripped)
    s = stripped
    k = len(s)
    n = k + exp10  # value = 0.s × 10^n
    if k <= n <= 21:
        out = s + "0" * (n - k)
    elif 0 < n <= 21:
        out = s[:n] + "." + s[n:]
    elif -6 < n <= 0:
        out = "0." + "0" * (-n) + s
    else:
        e = n - 1
        es = ("+" if e >= 0 else "-") + str(abs(e))
        out = (s if k == 1 else s[0] + "." + s[1:]) + "e" + es
    return sign + out


def js_string(v: Any) -> str:
    """JS 的 String(v)。"""
    if v is None:
        return "null"
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, (int, float)):
        return js_number(v)
    return str(v)


_INDEX_KEY = re.compile(r"^(0|[1-9]\d*)$")


def js_key_order(keys: list[str]) -> list[str]:
    """JS 普通对象的属性枚举顺序：整数索引键升序，其余保持插入顺序。"""
    idx = [k for k in keys if _INDEX_KEY.match(k) and int(k) < 2**32 - 1]
    if not idx:
        return keys
    rest = [k for k in keys if not (_INDEX_KEY.match(k) and int(k) < 2**32 - 1)]
    return sorted(idx, key=int) + rest


def utf16_key(s: str) -> bytes:
    """按 UTF-16 码元比较（JS 字符串 `<` 的语义）。"""
    return s.encode("utf-16-be", "surrogatepass")


def _quote(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)


def stringify(value: Any, indent: int = 2) -> str:
    pad = " " * indent

    def enc(v: Any, level: int) -> str:
        if v is None:
            return "null"
        if v is True:
            return "true"
        if v is False:
            return "false"
        if isinstance(v, (int, float)):
            return js_number(v)
        if isinstance(v, str):
            return _quote(v)
        if isinstance(v, (list, tuple)):
            if not v:
                return "[]"
            inner = pad * (level + 1)
            return "[\n" + ",\n".join(inner + enc(x, level + 1) for x in v) + "\n" + pad * level + "]"
        if isinstance(v, dict):
            keys = js_key_order([str(k) for k in v.keys()])
            if not keys:
                return "{}"
            m = {str(k): x for k, x in v.items()}
            inner = pad * (level + 1)
            return "{\n" + ",\n".join(f"{inner}{_quote(k)}: {enc(m[k], level + 1)}" for k in keys) + "\n" + pad * level + "}"
        raise TypeError(f"not JSON serializable: {type(v)!r}")

    return enc(value, 0)


def sort_keys(v: Any) -> Any:
    """递归按键排序（UTF-16 码元顺序，等价于 JS 的 `a < b`）。"""
    if isinstance(v, list):
        return [sort_keys(x) for x in v]
    if isinstance(v, dict):
        return {k: sort_keys(v[k]) for k in sorted(v.keys(), key=utf16_key)}
    return v
