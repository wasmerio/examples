"""移植自 build.test.ts 与 skeleton-to-excalidraw.test.ts。"""
import math

import pytest

from wisp_diagram_lib.build import excalidraw_title_desc, output_path_for, stem, style_of
from wisp_diagram_lib.env import WispError
from wisp_diagram_lib.palette import palette
from wisp_diagram_lib.skeleton import (
    ARROW_GAP, EXCALIFONT, default_skeleton_output, distance_to_edge, edge_geometry, resolve_skeleton_color,
    skeleton_to_element_skeletons,
)

P = palette()


class TestBuildHelpers:
    def test_style_of(self):
        assert style_of("/x/a.excalidraw") == "hand"
        assert style_of("/x/a.drawio") == "clean"
        with pytest.raises(WispError, match="不支持"):
            style_of("/x/a.svg")

    def test_output_paths(self):
        assert stem("/p/transformer-block.drawio") == "transformer-block"
        assert output_path_for("/p/diagrams/a.drawio") == "/p/diagrams/a.wisp.svg"
        assert output_path_for("/p/diagrams/a.drawio", 1) == "/p/diagrams/a.page-2.wisp.svg"
        assert output_path_for("/p/diagrams/a.excalidraw", 0, "/out") == "/out/a.wisp.svg"

    def test_title_desc(self):
        scene = {"elements": [
            {"type": "text", "text": "注", "fontSize": 12, "x": 0, "y": 300},
            {"type": "text", "text": "自注意力", "fontSize": 18, "x": 0, "y": 0},
            {"type": "text", "text": "Q", "fontSize": 14, "containerId": "q", "x": 0, "y": 50},
            {"type": "text", "text": "gone", "fontSize": 30, "isDeleted": True},
        ]}
        assert excalidraw_title_desc(scene, "/a/attention-flow.excalidraw") == ("自注意力", "Q；注")

    def test_title_fallback(self):
        assert excalidraw_title_desc({"elements": []}, "/a/attention-flow.excalidraw")[0] == "attention flow"


class TestSkeletonColor:
    def test_names(self):
        assert resolve_skeleton_color("blue") == {"stroke": P["color"]["hue"]["blue"]["stroke"]["light"], "fill": P["color"]["hue"]["blue"]["fill"]["light"]}
        assert resolve_skeleton_color("k") == resolve_skeleton_color(P["color"]["semantic"]["k"])
        assert resolve_skeleton_color(None) == {"stroke": P["color"]["base"]["fg"]["light"], "fill": "transparent"}
        assert resolve_skeleton_color("muted")["stroke"] == P["color"]["base"]["muted"]["light"]

    def test_unknown(self):
        with pytest.raises(WispError, match=r"可用：.*blue.*weight"):
            resolve_skeleton_color("pink")


RECT = {"id": "r", "x": 0, "y": 0, "w": 100, "h": 40}


class TestGeometry:
    def test_distance_to_edge(self):
        assert distance_to_edge(RECT, 1, 0) == pytest.approx(50)
        assert distance_to_edge(RECT, 0, 1) == pytest.approx(20)
        assert distance_to_edge({**RECT, "shape": "ellipse"}, math.sqrt(0.5), math.sqrt(0.5)) < math.hypot(50, 20)
        assert distance_to_edge({**RECT, "shape": "diamond"}, 1, 0) == pytest.approx(50)

    def test_edge_geometry(self):
        g = edge_geometry(RECT, {"id": "b", "x": 200, "y": 0, "w": 100, "h": 40})
        assert g["x"] == pytest.approx(100 + ARROW_GAP)
        assert g["y"] == pytest.approx(20)
        assert g["x"] + g["dx"] == pytest.approx(200 - ARROW_GAP)
        assert g["dy"] == pytest.approx(0)

    def test_axis_snap_vertical(self):
        # 上下排列、x 投影重叠但中心不对齐：竖直线落在重叠区间的中点，而不是斜线
        g = edge_geometry(RECT, {"id": "b", "x": 40, "y": 120, "w": 200, "h": 40})
        assert g["x"] == pytest.approx(70)
        assert g["dx"] == pytest.approx(0)
        assert g["y"] == pytest.approx(40 + ARROW_GAP)
        assert g["y"] + g["dy"] == pytest.approx(120 - ARROW_GAP)

    def test_diagonal_when_not_facing(self):
        g = edge_geometry(RECT, {"id": "b", "x": 200, "y": 120, "w": 100, "h": 40})
        assert g["dx"] > 0 and g["dy"] > 0

    def test_via(self):
        g = edge_geometry(RECT, {"id": "b", "x": 200, "y": 120, "w": 100, "h": 40}, [[250, 20]])
        assert g["points"] == [[0, 0], [150 - ARROW_GAP, 0], [150 - ARROW_GAP, 100 - ARROW_GAP]]
        assert g["y"] == pytest.approx(20)

    def test_too_close(self):
        with pytest.raises(WispError, match="太近"):
            edge_geometry(RECT, {"id": "c", "x": 104, "y": 0, "w": 100, "h": 40})


SK = {
    "style": "hand",
    "nodes": [
        {"id": "q", "shape": "rect", "x": 0, "y": 0, "w": 96, "h": 48, "label": "Q", "color": "q"},
        {"id": "s", "shape": "ellipse", "x": 160, "y": 40, "w": 120, "h": 48, "label": "softmax", "color": "activation", "emphasis": True},
        {"id": "d", "shape": "diamond", "x": 3, "y": 160, "w": 96, "h": 64, "color": "grad"},
    ],
    "edges": [{"from": "q", "to": "s", "label": "QKᵀ/√d"}, {"from": "d", "to": "s", "dashed": True, "arrow": "both", "color": "muted"}],
    "texts": [{"x": 0, "y": -32, "text": "自注意力", "size": "title"}, {"x": 0, "y": 240, "text": "注", "size": "note"}],
}


class TestElementSkeletons:
    elements, warnings = skeleton_to_element_skeletons(SK)

    def by_type(self, t):
        return [e for e in self.elements if e["type"] == t]

    def test_counts(self):
        for t, n in (("rectangle", 1), ("ellipse", 1), ("diamond", 1), ("arrow", 2), ("text", 2)):
            assert len(self.by_type(t)) == n

    def test_style_params(self):
        d = P["diagram"]
        q = next(e for e in self.elements if e["id"] == "q")
        assert q["roughness"] == d["excalidraw"]["roughness"]
        assert q["fillStyle"] == d["excalidraw"]["fillStyle"]
        assert q["strokeWidth"] == d["stroke-width"]["normal"]
        assert q["strokeColor"] == P["color"]["hue"]["blue"]["stroke"]["light"]
        assert q["roundness"] == {"type": 3, "value": d["corner-radius"]}
        assert q["label"]["strokeColor"] == P["color"]["base"]["fg"]["light"]  # 节点里的字是 fg
        assert q["label"]["text"] == "Q" and q["label"]["fontSize"] == d["font-size-px"]["label"] and q["label"]["fontFamily"] == EXCALIFONT
        assert next(e for e in self.elements if e["id"] == "s")["strokeWidth"] == d["stroke-width"]["bold"]

    def test_arrows(self):
        a1, a2 = self.by_type("arrow")
        assert a1["start"] == {"id": "q"} and a1["end"] == {"id": "s"} and a1["endArrowhead"] == "arrow" and a1["startArrowhead"] is None
        assert a1["label"]["text"] == "QKᵀ/√d" and a1["label"]["fontSize"] == P["diagram"]["font-size-px"]["note"]
        assert a2["strokeStyle"] == "dashed" and a2["startArrowhead"] == "arrow" and a2["strokeColor"] == P["color"]["base"]["muted"]["light"]

    def test_texts(self):
        title, note = self.by_type("text")
        assert title["text"] == "自注意力" and title["fontSize"] == P["diagram"]["font-size-px"]["title"]
        assert title["strokeColor"] == P["color"]["base"]["fg"]["light"]
        assert note["fontSize"] == P["diagram"]["font-size-px"]["note"] and note["strokeColor"] == P["color"]["base"]["muted"]["light"]

    def test_neutral_nodes(self):
        d, base = P["diagram"], P["color"]["base"]
        els, _ = skeleton_to_element_skeletons({"nodes": [
            {"id": "a", "x": 0, "y": 0, "w": 96, "h": 48, "label": "A"},
            {"id": "b", "x": 160, "y": 0, "w": 96, "h": 48, "color": "neutral", "emphasis": True},
            {"id": "c", "x": 320, "y": 0, "w": 96, "h": 48, "label": "Q", "color": "q", "labelColor": "q"},
        ]})
        a, b, c = els
        assert (a["strokeColor"], a["backgroundColor"], a["strokeWidth"]) == (base["muted"]["light"], base["surface"]["light"], d["stroke-width"]["thin"])
        assert (b["strokeColor"], b["backgroundColor"], b["strokeWidth"]) == (base["fg"]["light"], base["surface"]["light"], d["stroke-width"]["normal"])
        assert a["label"]["strokeColor"] == base["fg"]["light"]
        assert c["label"]["strokeColor"] == P["color"]["hue"]["blue"]["stroke"]["light"]

    def test_grid_warning(self):
        assert self.warnings == ["节点 d 的 x=3 不在 8px 网格上"]

    def test_errors(self):
        with pytest.raises(WispError, match="不存在"):
            skeleton_to_element_skeletons({"nodes": SK["nodes"], "edges": [{"from": "q", "to": "zz"}]})
        with pytest.raises(WispError, match="重复"):
            skeleton_to_element_skeletons({"nodes": [SK["nodes"][0], SK["nodes"][0]]})


def test_default_skeleton_output():
    assert default_skeleton_output("/a/b.skeleton.json") == "/a/b.excalidraw"
    assert default_skeleton_output("/a/c.json") == "/a/c.excalidraw"
