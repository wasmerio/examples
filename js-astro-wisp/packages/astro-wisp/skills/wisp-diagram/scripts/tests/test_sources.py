"""移植自 lib/sources.test.ts：drawio 压缩/解压/规范化、excalidraw 规范化、lint 规则与 --fix、CLI 退出码。"""
import json
import re
import shutil

from conftest import FIX, fx, snap
from wisp_diagram_lib.cli import cmd_lint, cmd_normalize
from wisp_diagram_lib.drawio import compress_diagram, decompress_diagram, list_pages, normalize_drawio
from wisp_diagram_lib.excalidraw import normalize_excalidraw
from wisp_diagram_lib.lint import MAX_HUES, apply_fixes, lint_drawio, lint_excalidraw
from wisp_diagram_lib.palette import palette


class TestDrawio:
    def test_round_trips_compression(self):
        xml = '<mxGraphModel><root><mxCell id="0" value="中文 &amp; é"/></root></mxGraphModel>'
        assert decompress_diagram(compress_diagram(xml)) == xml

    def test_lists_pages(self):
        assert [(p.name, p.compressed) for p in list_pages(fx("sample-compressed.drawio"))] == [("Page-1", True), ("Second", True)]
        assert all(not p.compressed for p in list_pages(fx("sample-plain.drawio")))

    def test_normalize_compressed_equals_plain_and_idempotent(self):
        a = normalize_drawio(fx("sample-compressed.drawio"))
        assert a == normalize_drawio(fx("sample-plain.drawio"))
        assert normalize_drawio(a) == a
        assert not re.search(r"<diagram[^>]*>[A-Za-z0-9+/=]{40,}", a)
        assert a == snap("normalized.drawio")


class TestExcalidrawNormalize:
    out = normalize_excalidraw(fx("sample.excalidraw"))

    def test_sorts_and_trims(self):
        doc = json.loads(self.out)
        assert [e["id"] for e in doc["elements"]] == ["a3", "b2", "c4", "d5", "t1"]
        assert doc["appState"] == {"viewBackgroundColor": "#ffffff", "gridSize": 8}

    def test_idempotent(self):
        assert normalize_excalidraw(self.out) == self.out


class TestLintExcalidraw:
    issues = lint_excalidraw(fx("sample.excalidraw"))

    def by(self, rule):
        return [i for i in self.issues if i.rule == rule]

    def test_reports_rules(self):
        assert [i.element_id for i in self.by("palette-color")] == ["a3"]
        assert self.by("palette-color")[0].fix.to == "#2f5783"
        assert [i.element_id for i in self.by("font-size")] == ["c4"]
        assert [i.element_id for i in self.by("grid")] == ["a3"]

    def test_oversize_and_gradient(self):
        big = json.dumps({"elements": [{"id": "x", "type": "rectangle", "x": 0, "y": 0, "strokeColor": "linear-gradient(red, blue)"}],
                          "files": {"a": "x" * int(2.1 * 1024 * 1024)}})
        rules = [i.rule for i in lint_excalidraw(big)]
        assert "file-size" in rules
        assert "gradient" in rules

    def test_apply_fixes_snaps_colors(self):
        fixed = apply_fixes("excalidraw", fx("sample.excalidraw"), self.issues)
        assert [i for i in lint_excalidraw(fixed) if i.rule == "palette-color"] == []


class TestLintDrawio:
    src = fx("sample-compressed.drawio")
    issues = lint_drawio(src)

    def by(self, rule):
        return [i for i in self.issues if i.rule == rule]

    def test_reports_rules(self):
        assert [i.element_id for i in self.by("palette-color")] == ["3"]
        assert len(self.by("shadow")) == 1
        assert len(self.by("gradient")) == 1
        assert [i.element_id for i in self.by("font-size")] == ["3"]
        assert [i.element_id for i in self.by("grid")] == ["3"]
        assert len(self.by("compressed")) == 1

    def test_apply_fixes(self):
        fixed = apply_fixes("drawio", self.src, self.issues)
        assert [i for i in lint_drawio(fixed) if i.level == "error"] == []
        assert "fillColor=#" in fixed
        assert all(not p.compressed for p in list_pages(fixed))

    def test_messages_match_ts(self):
        # 与 T5a 的 TS 实现输出逐字一致（ΔE 用同一套 lab65 CIEDE2000 计算）
        msgs = [i.message for i in self.issues]
        assert "style fillColor: #ff00ff is not in the palette; nearest is #8b9098 (--wd-subtle, ΔE 27.3)" in msgs
        assert "fontSize=20 is not one of 14/18/12 (±1)" in msgs
        assert "x=13 not aligned to 8px grid" in msgs


class TestCli:
    def test_lint_exit_codes_and_fix(self, tmp_path):
        for f in ("sample.excalidraw", "sample-compressed.drawio"):
            shutil.copy(FIX / f, tmp_path / f)
        logs = []
        assert cmd_lint([str(tmp_path / "*.excalidraw"), str(tmp_path / "*.drawio")], log=logs.append) == 1
        assert any("palette-color" in line for line in logs)
        assert cmd_lint([str(tmp_path / "*.excalidraw"), str(tmp_path / "*.drawio")], fix=True, log=logs.append) == 0
        assert cmd_lint([str(tmp_path / "*.drawio")], strict=True, log=logs.append) == 1  # warnings remain

    def test_lint_exit_2(self, tmp_path):
        logs = []
        assert cmd_lint([], log=logs.append) == 2
        (tmp_path / "bad.excalidraw").write_text("{nope")
        assert cmd_lint([str(tmp_path / "bad.excalidraw")], log=logs.append) == 2

    def test_normalize_check_then_write(self, tmp_path):
        f = tmp_path / "sample.excalidraw"
        f.write_text(fx("sample.excalidraw"))
        logs = []
        assert cmd_normalize([str(f)], check=True, log=logs.append) == 1
        assert cmd_normalize([str(f)], log=logs.append) == 0
        assert cmd_normalize([str(f)], check=True, log=logs.append) == 0


def test_lint_width_and_math():
    slate = palette()["color"]["hue"]["slate"]
    sf, ss = slate["fill"]["light"], slate["stroke"]["light"]
    node = lambda x, v: (f'<mxCell id="n{x}" value="{v}" style="rounded=1;fillColor={sf};strokeColor={ss};" vertex="1" parent="1">'
                         f'<mxGeometry x="{x}" y="0" width="160" height="40" as="geometry"/></mxCell>')
    page = lambda math, body: (f'<mxfile><diagram id="a" name="A"><mxGraphModel math="{math}"><root><mxCell id="0"/><mxCell id="1" parent="0"/>'
                               f'{body}</root></mxGraphModel></diagram></mxfile>')
    rules = lambda xml: [(i.level, i.rule) for i in lint_drawio(xml)]
    assert rules(page("1", node(0, "a") + node(480, r"\\(x_t\\)"))) == []
    assert rules(page("1", node(0, "a") + node(960, "b"))) == [("warn", "width")]
    assert rules(page("0", node(0, r"\\(x_t\\)"))) == [("error", "math")]
    assert rules(page("1", node(0, "$$x$$"))) == [("warn", "math")]
    wide = {"elements": [{"id": "a", "type": "rectangle", "x": 0, "y": 0, "width": 96, "height": 48},
                         {"id": "b", "type": "arrow", "x": 96, "y": 24, "width": 704, "height": 0, "points": [[0, 0], [704, 0]]}]}
    assert [(i.level, i.rule) for i in lint_excalidraw(wide)] == [("warn", "width")]


def test_lint_hue_count():
    hue = palette()["color"]["hue"]
    names = [h for h in hue if not h.startswith("$") and h != "slate"]

    def rect(i, h, fill=True):
        return {"id": f"r{i}", "type": "rectangle", "x": i * 8, "y": 0, "width": 8, "height": 8,
                "strokeColor": hue[h]["stroke"]["light"], "backgroundColor": hue[h]["fill"]["light"] if fill else "transparent"}

    rules = lambda els: [i.rule for i in lint_excalidraw({"elements": els})]
    ok = [rect(i, h) for i, h in enumerate(names[:MAX_HUES])] + [rect(9, "slate")]
    assert "hue-count" not in rules(ok)  # slate 是中性色，不计
    too_many = [rect(i, h, fill=i % 2 == 0) for i, h in enumerate(names[: MAX_HUES + 1])]
    issues = [i for i in lint_excalidraw({"elements": too_many}) if i.rule == "hue-count"]
    assert len(issues) == 1 and issues[0].level == "warn" and f"{MAX_HUES + 1} hues" in issues[0].message

    def cell(i, h):
        return (f'<mxCell id="c{i}" style="rounded=1;fillColor={hue[h]["fill"]["light"]};strokeColor={hue[h]["stroke"]["light"]};" '
                f'vertex="1" parent="1"><mxGeometry x="{i * 8}" y="0" width="8" height="8" as="geometry"/></mxCell>')

    def doc(*pages):
        body = "".join(f'<diagram id="p{n}" name="P{n}"><mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/>{"".join(cells)}'
                       "</root></mxGraphModel></diagram>" for n, cells in enumerate(pages))
        return f"<mxfile>{body}</mxfile>"

    # 按页计数：两页各用 3 种不同的 hue 不报警
    a = [cell(i, h) for i, h in enumerate(names[:3])]
    b = [cell(i, h) for i, h in enumerate(names[3:6])]
    assert [i for i in lint_drawio(doc(a, b)) if i.rule == "hue-count"] == []
    c = [cell(i, h) for i, h in enumerate(names[:4])]
    msgs = [i.message for i in lint_drawio(doc(a, c)) if i.rule == "hue-count"]
    assert len(msgs) == 1 and msgs[0].startswith("page 2: 4 hues")
