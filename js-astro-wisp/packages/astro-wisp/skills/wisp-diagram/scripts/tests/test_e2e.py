"""端到端（WISP_DIAGRAM_E2E=1）：与 T5b 的 TS 实现产物逐字节比对、骨架转换可复现、PNG 明暗不同、项目模式。

fixtures/e2e/ 是 TS 版生成并提交的产物副本（tests/fixtures/diagrams/ 同款）。
"""
import json
import shutil

import pytest

from conftest import FIX
from wisp_diagram_lib.build import build_diagram
from wisp_diagram_lib.export_png import svg_to_png
from wisp_diagram_lib.skeleton import skeleton_to_excalidraw

E = FIX / "e2e"
pytestmark = pytest.mark.e2e


def read(n):
    return (E / n).read_text("utf-8")


def test_skeleton_reproducible_and_matches_ts(session):
    sk = json.loads(read("hand-attention.skeleton.json"))
    js, _ = skeleton_to_excalidraw(session, sk)
    assert js == read("hand-attention.excalidraw")
    js2, _ = skeleton_to_excalidraw(session, sk)
    assert js2 == js


def test_hand_build_byte_identical(session):
    r = build_diagram(str(E / "hand-attention.excalidraw"), session=session, write=False)
    assert len(r.outputs) == 1
    assert r.unknown_colors == []
    assert r.outputs[0].svg == read("hand-attention.wisp.svg")


def test_clean_build_byte_identical_via_browser(session):
    r = build_diagram(str(E / "clean-transformer.drawio"), session=session, write=False, drawio="browser")
    assert [o.page[1] for o in r.outputs] == ["encoder", "数据流"]
    assert r.unknown_colors == []
    assert r.exporter == "drawio-browser"
    assert r.outputs[0].svg == read("clean-transformer.wisp.svg")
    assert r.outputs[1].svg == read("clean-transformer.page-2.wisp.svg")


def test_png_light_dark_differ(session):
    svg = read("clean-transformer.page-2.wisp.svg")
    light = svg_to_png(session, svg, theme="light", scale=1)
    dark = svg_to_png(session, svg, theme="dark", scale=1)
    assert light[:8].hex() == "89504e470d0a1a0a"
    assert light != dark


def test_project_mode_build_then_check(tmp_path, capsys):
    from wisp_diagram_lib.cli import main

    d = tmp_path / "src/content/posts/demo/diagrams"
    d.mkdir(parents=True)
    shutil.copy(E / "hand-attention.excalidraw", d / "flow.excalidraw")
    m = tmp_path / "diagrams.manifest.json"
    assert main(["check", "--root", str(tmp_path)]) == 1
    assert main(["build", "--root", str(tmp_path), "--manifest", str(m)]) == 0
    assert (d / "flow.wisp.svg").read_text("utf-8") == read("hand-attention.wisp.svg").replace(
        'data-source="hand-attention.excalidraw"', 'data-source="flow.excalidraw"').replace("hand-attention-", "flow-")
    assert main(["check", "--root", str(tmp_path)]) == 0
    capsys.readouterr()
    assert main(["build", "--root", str(tmp_path), "--manifest", str(m)]) == 0
    assert "全部最新" in capsys.readouterr().out
