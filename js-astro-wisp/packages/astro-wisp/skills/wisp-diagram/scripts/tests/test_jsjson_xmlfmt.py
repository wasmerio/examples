"""Python 版新增：JS 兼容的 JSON 序列化与 fast-xml-parser 兼容的 XML 格式化（行为规格来自 node 实测）。"""
import pytest

from wisp_diagram_lib.jsjson import js_number, stringify
from wisp_diagram_lib.xmlfmt import format_xml


@pytest.mark.parametrize("v,s", [
    (1, "1"), (1.0, "1"), (-0.0, "0"), (1.5, "1.5"), (0.1 + 0.2, "0.30000000000000004"),
    (1e21, "1e+21"), (1e20, "100000000000000000000"), (1e-7, "1e-7"), (0.000001, "0.000001"),
    (123456789.125, "123456789.125"), (-2.5e-8, "-2.5e-8"), (2**60, "1152921504606847000"),
    (1.7976931348623157e308, "1.7976931348623157e+308"), (5e-324, "5e-324"),
])
def test_js_number(v, s):
    assert js_number(v) == s


def test_stringify_like_js():
    assert stringify({"b": [1, {"x": None}], "a": {}, "10": True, "2": "中\n"}) == (
        '{\n  "2": "中\\n",\n  "10": true,\n  "b": [\n    1,\n    {\n      "x": null\n    }\n  ],\n  "a": {}\n}'
    )
    assert stringify([]) == "[]"


# 期望值为 fast-xml-parser 5.12 / fast-xml-builder 1.3（T5a normalize 所用）的实际输出
@pytest.mark.parametrize("src,out", [
    ('<?xml version="1.0" encoding="UTF-8"?>\n<mxfile a=\'x"y\' b="1"><!-- c --><diagram name="p">  </diagram></mxfile>',
     '<?xml version="1.0" encoding="UTF-8"?>\n<mxfile a="x&quot;y" b="1">\n  <diagram name="p"/>\n</mxfile>\n'),
    ("<a><b>text</b><c> t1 <d/> t2 </c><e><![CDATA[x<y]]></e></a>",
     "<a>\n  <b>text</b>\n  <c>\n    t1\n    <d/>\n    t2\n  </c>\n  <e>x<y</e>\n</a>\n"),
    ('<a x="&amp;&lt;" y="中"><b/>\n\n<b></b></a>', '<a x="&amp;&lt;" y="中">\n  <b/>\n  <b/>\n</a>\n'),
    ("<a>  </a>", "<a/>\n"),
    ("<root><x attr/></root>", "<root>\n  <x/>\n</root>\n"),
    ("<a><b>1</b><b>2</b>tail</a>", "<a>\n  \n  <b>1</b>\n  <b>2</b>\n  tail\n</a>\n"),
    ('<a b="1"   c = "2" />', '<a b="1" c="2"/>\n'),
    ("<a>head<b>1</b></a>", "<a>head\n  <b>1</b>\n</a>\n"),
    ("<a>x<b/>y<c>2</c></a>", "<a>x\n  <b/>\n  y\n  <c>2</c>\n</a>\n"),
    ("<a><b><c>1</c></b></a>", "<a>\n  <b>\n    <c>1</c>\n  </b>\n</a>\n"),
    ('<?xml version="1.0"?><!DOCTYPE x><a/>', '<?xml version="1.0"?>\n<a/>\n'),
])
def test_format_xml_matches_fast_xml_parser(src, out):
    assert format_xml(src) == out
