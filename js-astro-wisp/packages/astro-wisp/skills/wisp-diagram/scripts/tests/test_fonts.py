"""移植自 exporters/fonts.test.ts。分片清单与子集嵌入需要下载字体，归入 e2e。"""
import re

import pytest

from wisp_diagram_lib.fonts import collect_svg_text, decode_entities, embed_fonts, in_ranges, parse_unicode_range, shards_for


def test_parse_unicode_range():
    assert parse_unicode_range("U+20-7e, U+4E00, U+4??") == [(0x20, 0x7E), (0x4E00, 0x4E00), (0x400, 0x4FF)]
    assert in_ranges(0x41, parse_unicode_range("U+20-7e"))
    assert not in_ranges(0x4E2D, parse_unicode_range("U+20-7e"))


def test_collect_svg_text():
    svg = "<svg><title>标题</title><desc>描述</desc><style>.a{}</style><text>A&amp;B</text><foreignObject><div>中文</div></foreignObject></svg>"
    assert sorted(collect_svg_text(svg)) == sorted("A&B中文")
    assert decode_entities("&#x4e2d;&#25991;") == "中文"


def test_excalifont_shards_static():
    s = shards_for("Excalifont")
    assert len(s) > 1
    assert any(in_ranges(0x41, x.ranges) for x in s)


@pytest.mark.e2e
def test_noto_covers_common_hanzi():
    assert any(in_ranges(ord("注"), x.ranges) for x in shards_for("Noto Sans SC"))


@pytest.mark.e2e
def test_embed_fonts_hand_idempotent():
    svg = '<svg xmlns="http://www.w3.org/2000/svg"><text font-family="var(--wd-font-hand)">Q 注意力</text></svg>'
    r = embed_fonts(svg)
    assert r.families == ["Excalifont", "Noto Sans SC"]
    assert re.search(r'<style data-wisp-fonts="1">@font-face\{font-family:"Excalifont"', r.svg)
    assert 'font-family:"Noto Sans SC"' in r.svg
    assert "data:font/woff2;base64," in r.svg
    assert 0 < r.bytes < 200_000
    again = embed_fonts(r.svg)
    assert again.svg.count("data-wisp-fonts") == 1
