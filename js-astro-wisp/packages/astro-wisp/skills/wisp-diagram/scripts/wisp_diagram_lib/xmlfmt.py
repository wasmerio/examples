"""最小 XML 解析 / 格式化，逐字节复刻 fast-xml-parser 5 + fast-xml-builder 1 在
`preserveOrder, ignoreAttributes:false, processEntities:false, trimValues:true,
format:true, indentBy:'  ', suppressEmptyNode:true` 配置下的行为（T5a normalize 所用）。

保留：元素顺序、属性原文（不解实体）、PI（<?xml …?>）、文本（去首尾空白）。
丢弃：注释、DOCTYPE、无值的布尔属性；CDATA 内容按原文作为文本输出（与原实现一致）。
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field

_JS_WS = " \t\n\r\x0b\x0c\xa0                　﻿"


def js_trim(s: str) -> str:
    return s.strip(_JS_WS)


@dataclass
class Node:
    tag: str
    attrs: dict[str, str] | None = None
    children: list["Node | Text"] = field(default_factory=list)
    pi: bool = False

    def elements(self, name: str | None = None) -> list["Node"]:
        return [c for c in self.children if isinstance(c, Node) and not c.pi and (name is None or c.tag == name)]


@dataclass
class Text:
    text: str


_ATTR_RE = re.compile(r"""([^\s=]+)\s*(=\s*(['"])([\s\S]*?)\3)?""")
_WS_RE = re.compile(r"\s")


def _build_attrs(s: str) -> dict[str, str] | None:
    attrs: dict[str, str] = {}
    for m in _ATTR_RE.finditer(s):
        name, val = m.group(1), m.group(4)
        if name and val is not None:
            attrs[name] = js_trim(val)
    return attrs or None


def _tag_exp(xml: str, i: int, closing: str) -> tuple[str, int] | None:
    boundary = ""
    out = []
    seg = i
    n = len(xml)
    c0 = closing[0]
    c1 = closing[1] if len(closing) > 1 else ""
    idx = i
    while idx < n:
        ch = xml[idx]
        if boundary:
            if ch == boundary:
                boundary = ""
        elif ch in ("'", '"'):
            boundary = ch
        elif ch == c0:
            if c1:
                if idx + 1 < n and xml[idx + 1] == c1:
                    out.append(xml[seg:idx])
                    return "".join(out), idx
            else:
                out.append(xml[seg:idx])
                return "".join(out), idx
        elif ch == "\t":
            out.append(xml[seg:idx] + " ")
            seg = idx + 1
        idx += 1
    return None


def _read_tag_exp(xml: str, i: int, closing: str = ">") -> tuple[str, str, int, bool] | None:
    r = _tag_exp(xml, i + 1, closing)
    if r is None:
        return None
    data, close = r
    m = _WS_RE.search(data)
    tag_name = data
    tag_exp = data
    if m:
        tag_name = data[: m.start()]
        tag_exp = data[m.start() + 1:].lstrip(_JS_WS)
    return tag_name, tag_exp, close, True


def _find_closing(xml: str, s: str, i: int, err: str) -> int:
    j = xml.find(s, i)
    if j < 0:
        raise ValueError(err)
    return j + len(s) - 1


def _skip_doctype(xml: str, i: int) -> int:
    depth = 0
    j = i + 2
    n = len(xml)
    while j < n:
        ch = xml[j]
        if ch == "[":
            depth += 1
        elif ch == "]":
            depth -= 1
        elif ch == ">" and depth <= 0:
            return j
        j += 1
    raise ValueError("Unclosed DOCTYPE")


def parse(xml: str) -> Node:
    xml = re.sub(r"\r\n?", "\n", xml)
    root = Node("!xml")
    stack: list[Node] = []
    cur = root
    text = ""

    def save(t: str, parent: Node) -> str:
        if t:
            v = js_trim(t)
            if v:
                parent.children.append(Text(v))
        return ""

    i = 0
    n = len(xml)
    while i < n:
        ch = xml[i]
        if ch == "<":
            c1 = xml[i + 1] if i + 1 < n else ""
            if c1 == "/":
                close = _find_closing(xml, ">", i, "Closing Tag is not closed.")
                text = save(text, cur)
                cur = stack.pop() if stack else root
                text = ""
                i = close
            elif c1 == "?":
                r = _read_tag_exp(xml, i, "?>")
                if r is None:
                    raise ValueError("Pi Tag is not closed.")
                name, exp, close, present = r
                text = save(text, cur)
                attrs = _build_attrs(exp)
                node = Node(name, pi=True)
                if name != exp and present and attrs:
                    node.attrs = attrs
                cur.children.append(node)
                i = close + 1
            elif xml.startswith("!--", i + 1):
                i = _find_closing(xml, "-->", i + 4, "Comment is not closed.")
            elif xml.startswith("!D", i + 1):
                i = _skip_doctype(xml, i)
            elif xml.startswith("![", i + 1):
                close = _find_closing(xml, "]]>", i, "CDATA is not closed.") - 2
                exp = xml[i + 9: close]
                text = save(text, cur)
                cur.children.append(Text(exp))
                i = close + 2
            else:
                r = _read_tag_exp(xml, i, ">")
                if r is None:
                    raise ValueError(f"Unclosed tag at {i}")
                name, exp, close, present = r
                if text and cur.tag != "!xml":
                    text = save(text, cur)
                self_closing = False
                if len(exp) > 0 and exp.rfind("/") == len(exp) - 1:
                    self_closing = True
                    if name.endswith("/"):
                        name = name[:-1]
                        exp = name
                    else:
                        exp = exp[:-1]
                    present = name != exp
                attrs = _build_attrs(exp) if (name != exp and present) else None
                node = Node(name, attrs)
                cur.children.append(node)
                if not self_closing:
                    stack.append(cur)
                    cur = node
                text = ""
                i = close
        else:
            text += ch
        i += 1
    return root


def _esc_attr(v: str) -> str:
    return v.replace('"', "&quot;").replace("'", "&apos;")


def _attr_str(attrs: dict[str, str] | None) -> str:
    if not attrs:
        return ""
    return "".join(f' {k}="{_esc_attr(v)}"' for k, v in attrs.items())


def _arr_to_str(children: list, indentation: str, indent_by: str) -> str:
    out = ""
    prev_tag = False
    for c in children:
        if isinstance(c, Text):
            if prev_tag:
                out += indentation
            out += c.text
            prev_tag = False
            continue
        if c.pi:
            temp = "" if c.tag == "?xml" else indentation
            out += f"{temp}<{c.tag}{_attr_str(c.attrs)}?>"
            prev_tag = True
            continue
        new_ind = indentation + indent_by if indentation else ""
        start = f"{indentation}<{c.tag}{_attr_str(c.attrs)}"
        val = _arr_to_str(c.children, new_ind, indent_by)
        if not val:
            out += start + "/>"
        elif val.endswith(">"):
            out += f"{start}>{val}{indentation}</{c.tag}>"
        else:
            out += start + ">"
            if indentation and ("/>" in val or "</" in val):
                out += indentation + indent_by + val + indentation
            else:
                out += val
            out += f"</{c.tag}>"
        prev_tag = True
    return out


def build(root: Node, indent_by: str = "  ") -> str:
    return _arr_to_str(root.children, "\n", indent_by)


def format_xml(xml: str) -> str:
    """统一缩进，保证 git diff 稳定（与 TS 版 normalize 逐字节一致）。"""
    return js_trim(build(parse(xml))) + "\n"
