"""移植自 validate-assets.test.ts：素材库与 draw.io 配置的颜色全部来自调色板。"""
import json
import re
import xml.etree.ElementTree as ET

from conftest import SCRIPTS
from wisp_diagram_lib.lint import lint_drawio, lint_excalidraw
from wisp_diagram_lib.palette import is_palette_color

ASSETS = SCRIPTS.parent / "assets"


def read(f):
    return (ASSETS / f).read_text("utf-8")


class TestExcalidrawLib:
    lib = json.loads(read("wisp.excalidrawlib"))

    def test_structure(self):
        assert self.lib["type"] == "excalidrawlib"
        assert self.lib["version"] == 2
        items = self.lib["libraryItems"]
        assert len(items) >= 30
        ids = set()
        for it in items:
            assert it["id"] not in ids
            ids.add(it["id"])
            assert it["name"]
            assert len(it["elements"]) > 0
            for el in it["elements"]:
                assert isinstance(el["id"], str) and isinstance(el["type"], str) and isinstance(el["x"], (int, float))

    def test_coverage(self):
        items = self.lib["libraryItems"]
        types = {e["type"] for i in items for e in i["elements"]}
        for t in ("rectangle", "ellipse", "diamond", "arrow", "text"):
            assert t in types
        for kind in ("节点", "椭圆", "菱形"):
            assert len([i for i in items if i["name"].startswith(kind)]) >= 8
        for n in ("分组框", "标题文字"):
            assert any(i["name"].startswith(n) for i in items)

    def test_palette_and_lint(self):
        for it in self.lib["libraryItems"]:
            for el in it["elements"]:
                for k in ("strokeColor", "backgroundColor"):
                    v = el.get(k)
                    if isinstance(v, str) and v != "transparent":
                        assert is_palette_color(v), f"{it['name']} {k}={v}"
            errors = [i for i in lint_excalidraw({"elements": it["elements"]}) if i.level == "error"]
            assert errors == [], it["name"]


class TestDrawioLib:
    raw = read("wisp-drawio-library.xml").strip()

    def test_wrapper(self):
        assert self.raw.startswith("<mxlibrary>") and self.raw.endswith("</mxlibrary>")

    def items(self):
        return json.loads(self.raw[len("<mxlibrary>"): -len("</mxlibrary>")])

    def test_items_parse(self):
        items = self.items()
        assert len(items) >= 30
        for it in items:
            assert it["title"]
            assert it["w"] > 0 and it["h"] >= 0
            root = ET.fromstring(it["xml"])
            assert root.tag == "mxGraphModel", it["title"]
            assert len(root.findall("./root/mxCell")) >= 3, it["title"]

    def test_palette_no_shadow_gradient(self):
        for it in self.items():
            assert [i for i in lint_drawio(it["xml"]) if i.level == "error"] == [], it["title"]


class TestDrawioConfig:
    raw = read("drawio-config.json")
    cfg = json.loads(raw)

    def test_preset_colors(self):
        assert len(self.cfg["presetColors"]) > 8
        for c in self.cfg["presetColors"] + self.cfg["defaultColors"]:
            assert is_palette_color(f"#{c}"), c

    def test_other_hexes(self):
        for h in re.findall(r"#[0-9a-fA-F]{6}\b", self.raw):
            assert is_palette_color(h), h
