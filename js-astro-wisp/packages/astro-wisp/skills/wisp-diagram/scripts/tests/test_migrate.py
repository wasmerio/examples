"""migrate：旧调色板 → 当前调色板，按令牌名改写颜色、线宽、圆角。"""
import copy
import json

from conftest import SCRIPTS
from wisp_diagram_lib.cli import cmd_migrate
from wisp_diagram_lib.lint import lint_drawio, lint_excalidraw
from wisp_diagram_lib.migrate import Migration
from wisp_diagram_lib.palette import palette

NEW = palette()


def old_palette() -> dict:
    """一份“旧”调色板：所有 hue 都换成别的值，线宽 1.5 / 2.5，圆角 8。"""
    p = copy.deepcopy(NEW)
    for i, (h, v) in enumerate((k, v) for k, v in p["color"]["hue"].items() if not k.startswith("$")):
        v["stroke"] = {"light": f"#a{i}00a{i}", "dark": f"#b{i}00b{i}"}
        v["fill"] = {"light": f"#c{i}00c{i}", "dark": f"#d{i}00d{i}"}
    p["diagram"]["stroke-width"] = {"thin": 1, "normal": 1.5, "bold": 2.5}
    p["diagram"]["corner-radius"] = 8
    return p


OLD = old_palette()
H = [h for h in NEW["color"]["hue"] if not h.startswith("$")]


def test_maps_by_token_name_not_nearest():
    m = Migration.from_palettes(OLD, NEW)
    for h in H:
        assert m.colors[OLD["color"]["hue"][h]["stroke"]["light"]] == NEW["color"]["hue"][h]["stroke"]["light"]
        assert m.colors[OLD["color"]["hue"][h]["fill"]["light"]] == NEW["color"]["hue"][h]["fill"]["light"]
        assert m.colors[OLD["color"]["hue"][h]["stroke"]["dark"]] == NEW["color"]["hue"][h]["stroke"]["dark"]
    # 基础色没变，不在映射里
    assert NEW["color"]["base"]["fg"]["light"] not in m.colors


def test_excalidraw():
    o, n = OLD["color"]["hue"]["violet"], NEW["color"]["hue"]["violet"]
    doc = {"type": "excalidraw", "version": 2, "elements": [
        {"id": "a", "type": "rectangle", "x": 0, "y": 0, "width": 96, "height": 48, "strokeColor": o["stroke"]["light"].upper(),
         "backgroundColor": o["fill"]["light"], "strokeWidth": 2.5, "roundness": {"type": 3}},
        {"id": "t", "type": "text", "x": 0, "y": 0, "width": 8, "height": 8, "strokeColor": "#1d1d1f", "strokeWidth": 2.5, "containerId": "a"},
        {"id": "e", "type": "arrow", "x": 0, "y": 0, "width": 8, "height": 0, "strokeColor": o["stroke"]["light"], "strokeWidth": 1.5, "roundness": None},
    ]}
    m = Migration.from_palettes(OLD, NEW)
    out = json.loads(m.excalidraw(json.dumps(doc)))
    a, t, e = out["elements"]
    r, w = NEW["diagram"]["corner-radius"], NEW["diagram"]["stroke-width"]
    assert (a["strokeColor"], a["backgroundColor"], a["strokeWidth"], a["roundness"]) == (
        n["stroke"]["light"], n["fill"]["light"], w["bold"], {"type": 3, "value": r})
    assert t["strokeWidth"] == 2.5  # 文字元素的线宽不动
    assert (e["strokeColor"], e["strokeWidth"], e["roundness"]) == (n["stroke"]["light"], w["normal"], None)
    assert [i for i in lint_excalidraw(out) if i.level == "error"] == []
    # 幂等
    assert Migration.from_palettes(OLD, NEW).excalidraw(json.dumps(out)) == m.excalidraw(json.dumps(out))


def test_drawio_style_and_value():
    o, n = OLD["color"]["hue"]["blue"], NEW["color"]["hue"]["blue"]
    xml = ('<mxfile><diagram id="a" name="A"><mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/>'
           f'<mxCell id="v" value="&lt;font color=&quot;{o["stroke"]["light"]}&quot;&gt;x&lt;/font&gt;" '
           f'style="rounded=1;arcSize=8;whiteSpace=wrap;fillColor={o["fill"]["light"]};strokeColor={o["stroke"]["light"]};strokeWidth=1.5;" vertex="1" parent="1">'
           '<mxGeometry x="0" y="0" width="128" height="48" as="geometry"/></mxCell>'
           f'<mxCell id="e" style="edgeStyle=orthogonalEdgeStyle;rounded=1;strokeColor={o["stroke"]["light"]};strokeWidth=2.5;" edge="1" parent="1" source="v" target="v">'
           '<mxGeometry relative="1" as="geometry"/></mxCell></root></mxGraphModel></diagram></mxfile>')
    out = Migration.from_palettes(OLD, NEW).drawio(xml)
    arc = NEW["diagram"]["corner-radius"] * 2
    w = NEW["diagram"]["stroke-width"]
    assert (f'style="rounded=1;absoluteArcSize=1;arcSize={arc};whiteSpace=wrap;fillColor={n["fill"]["light"]};'
            f'strokeColor={n["stroke"]["light"]};strokeWidth={w["normal"]};"') in out
    assert f'style="edgeStyle=orthogonalEdgeStyle;rounded=1;strokeColor={n["stroke"]["light"]};strokeWidth={w["bold"]};"' in out
    assert f'color=&quot;{n["stroke"]["light"]}&quot;' in out
    assert [i for i in lint_drawio(out) if i.level == "error"] == []
    assert Migration.from_palettes(OLD, NEW).drawio(out) == out


def test_cli_check_and_write(tmp_path):
    old = tmp_path / "old.json"
    old.write_text(json.dumps(OLD), "utf-8")
    o = OLD["color"]["hue"]["green"]
    f = tmp_path / "a.excalidraw"
    f.write_text(json.dumps({"type": "excalidraw", "elements": [
        {"id": "a", "type": "rectangle", "x": 0, "y": 0, "width": 8, "height": 8, "strokeColor": o["stroke"]["light"], "strokeWidth": 1.5}]}), "utf-8")
    (tmp_path / "notes.txt").write_text("x", "utf-8")
    logs: list[str] = []
    assert cmd_migrate([str(f)], str(old), check=True, log=logs.append) == 1
    assert "needs migrate" in logs[-1]
    assert cmd_migrate([str(f), str(tmp_path / "notes.txt")], str(old), log=logs.append) == 0
    assert any("skipped" in m for m in logs)
    assert cmd_migrate([str(f)], str(old), check=True, log=logs.append) == 0
    assert NEW["color"]["hue"]["green"]["stroke"]["light"] in f.read_text("utf-8")


def test_shipped_assets_are_current():
    """素材库已经迁移到当前调色板：拿当前调色板当“旧”调色板跑一遍不应有任何变化。"""
    m = Migration.from_palettes(NEW, NEW)
    for name in ("wisp.excalidrawlib", "wisp-drawio-library.xml", "drawio-config.json"):
        path = SCRIPTS.parent / "assets" / name
        assert m.file(path) == path.read_text("utf-8"), name
