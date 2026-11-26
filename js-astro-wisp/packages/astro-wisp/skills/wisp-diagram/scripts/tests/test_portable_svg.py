"""移植自 lib/portable-svg.test.ts（含快照）。"""
import re

from conftest import fx, snap
from wisp_diagram_lib.palette import nearest_token, resolve_color, wd_vars
from wisp_diagram_lib.portable_svg import to_portable_svg


class TestPalette:
    def test_nearest_token_snaps_close_blue(self):
        n = nearest_token("#2563eb")
        assert n.token.name == "blue"
        assert n.delta_e > 0

    def test_resolves_semantic_and_hue(self):
        assert resolve_color("q").hue == "blue"
        assert resolve_color("amber").stroke["light"] == "#7b5518"
        assert resolve_color("nope") is None

    def test_var_tables(self):
        assert wd_vars("light")["--wd-blue-fill"] == "#e9f2fb"
        assert wd_vars("dark")["--wd-blue"] == "#a9cbef"


class TestExcalidrawExport:
    r = to_portable_svg(fx("excalidraw-export.svg"), style="hand")

    def test_maps_palette_colors_and_reports_unknown(self):
        s = self.r.svg
        assert 'fill="var(--wd-blue-fill, #e9f2fb)"' in s
        assert 'stroke="var(--wd-blue, #2f5783)"' in s
        assert 'stroke="var(--wd-green, #2c522d)"' in s  # rgb()
        assert 'stroke="var(--wd-fg, #1d1d1f)"' in s  # #1e1e1e
        assert 'fill="var(--wd-bg, #fcfcfb)"' in s  # #FFF
        assert "fill: var(--wd-fg, #1d1d1f)" in s  # style, #000
        assert self.r.unknown_colors == ["#2563eb"]
        assert 'stroke="#2563eb"' in s

    def test_removes_background_adds_class_and_style(self):
        s = self.r.svg
        assert 'width="320" height="200" fill' not in s
        assert re.search(r'<svg [^>]*class="wisp-d"', s)
        assert "@media (prefers-color-scheme:dark){.wisp-d{" in s
        assert 'data-style="hand"' in s

    def test_unifies_fonts_keeps_font_face(self):
        s = self.r.svg
        assert 'font-family="var(--wd-font-hand)"' in s
        assert "font-family: var(--wd-font-hand)" in s
        assert 'font-family: "Virgil"; src:' in s

    def test_idempotent(self):
        assert to_portable_svg(self.r.svg).svg == self.r.svg

    def test_snapshot(self):
        assert self.r.svg == snap("portable-excalidraw.svg")

    def test_fix_snaps_unknown(self):
        f = to_portable_svg(fx("excalidraw-export.svg"), fix=True)
        assert f.unknown_colors == []
        assert 'stroke="var(--wd-blue, #2f5783)"' in f.svg
        assert any(w.startswith("snapped #2563eb") for w in f.warnings)


class TestDrawioExport:
    r = to_portable_svg(fx("drawio-export.svg"), style="clean")

    def test_strips_background_and_maps(self):
        s = self.r.svg
        assert "background" not in s
        assert 'fill="#ffffff"' not in s
        assert 'stroke="var(--wd-fg, #1d1d1f)"' in s
        assert "stroke: var(--wd-fg, #1d1d1f)" in s
        assert "color: var(--wd-fg, #1d1d1f)" in s
        assert "font-family: var(--wd-font-sans)" in s
        assert self.r.unknown_colors == ["#ff00ff"]

    def test_snapshot(self):
        assert self.r.svg == snap("portable-drawio.svg")


class TestMasks:
    r = to_portable_svg(fx("excalidraw-mask.svg"))

    def test_leaves_mask_and_clippath(self):
        s = self.r.svg
        assert '<mask id="m1"><rect x="0" y="0" width="320" height="200" fill="#ffffff"></rect><rect x="100" y="40" width="40" height="20" fill="#000000"></rect></mask>' in s
        assert '<clipPath id="c1"><rect x="0" y="0" width="320" height="200" fill="#ffffff"></rect></clipPath>' in s
        assert self.r.unknown_colors == []

    def test_removes_only_top_level_background(self):
        assert "removed background rect" in self.r.warnings
        assert 'stroke="var(--wd-blue, #2f5783)" stroke-width="1.5" mask="url(#m1)"' in self.r.svg
        assert len(re.findall(r'<rect x="0" y="0" width="320" height="200" fill="#ffffff">', self.r.svg)) == 2

    def test_idempotent(self):
        assert to_portable_svg(self.r.svg).svg == self.r.svg
