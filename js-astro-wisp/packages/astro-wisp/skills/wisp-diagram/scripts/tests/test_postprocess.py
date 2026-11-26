"""移植自 exporters/postprocess.test.ts。svgo 在 Chromium 中运行，相关用例归入 e2e。"""
import re

import pytest

from wisp_diagram_lib.postprocess import inject_a11y, postprocess, preclean, protect_masks, sanitize_id_prefix, svgo_optimize

RAW = """<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" width="200" height="100"><!-- svg-source:excalidraw --><metadata></metadata><defs><style class="style-fonts">
      </style></defs>
<g stroke-linecap="round"><path d="M0 0 L100 0" stroke="#2f5783" stroke-width="1.5" fill="#e9f2fb"/></g>
<mask/><g mask="url(#mask-a)"><path d="M0 50 L200 50" stroke="#1e1e1e" fill="none"/></g>
<mask id="mask-a"><rect x="0" y="0" fill="#fff" width="200" height="100"/><rect x="80" y="40" fill="#000" width="40" height="20"/></mask>
<text x="10" y="20" font-family="Excalifont, Xiaolai, Segoe UI Emoji" fill="#1e1e1e">注意力 Q·Kᵀ</text></svg>"""


def test_preclean():
    s = preclean(RAW)
    assert "<!--" not in s
    assert "<metadata" not in s
    assert "style-fonts" not in s
    assert not re.search(r"<defs>\s*</defs>", s)


def test_protect_masks():
    svg, restore = protect_masks(RAW)
    assert "<mask" not in svg
    assert len(re.findall("<wisp-protect", svg)) == 2
    assert restore(svg) == RAW


def test_sanitize_id_prefix():
    assert sanitize_id_prefix("Attention_Flow") == "attention-flow"
    assert sanitize_id_prefix("2-layers") == "d-2-layers"
    assert sanitize_id_prefix("注意力") == "diagram"


BASE = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120.5 80" width="1" height="2" role="presentation"><g/></svg>'


def test_inject_a11y():
    s = inject_a11y(BASE, style="hand", source="a&b.excalidraw", id_prefix="ab", title="标题 <x>", desc="描述")
    assert re.match(r'^<svg[^>]* width="120.5" height="80"', s)
    assert 'role="img"' in s
    assert 'role="presentation"' not in s
    assert 'aria-labelledby="ab-title ab-desc"' in s
    assert 'data-wisp-diagram="1"' in s
    assert 'data-source="a&amp;b.excalidraw"' in s
    assert 'data-style="hand"' in s
    assert '<title id="ab-title">标题 &lt;x&gt;</title><desc id="ab-desc">描述</desc>' in s


def test_inject_a11y_without_desc():
    s = inject_a11y(BASE, style="clean", source="x.drawio", id_prefix="x", title="T", page="encoder")
    assert 'aria-labelledby="x-title"' in s
    assert "<desc" not in s
    assert 'data-page="encoder"' in s


@pytest.mark.e2e
def test_svgo_config(session):
    svg = ('<svg xmlns="http://www.w3.org/2000/svg" class="wisp-d" viewBox="0 0 10 10"><style>.wisp-d{--wd-fg:#111}</style><desc>d</desc>'
           '<mask id="m"><rect width="10" height="10" fill="#fff"/></mask><rect width="10" height="10" mask="url(#m)" fill="var(--wd-blue, #2f5783)"/></svg>')
    out = svgo_optimize(session, svg, "fig")
    for s in ('viewBox="0 0 10 10"', ".wisp-d{--wd-fg:#111}", "var(--wd-blue, #2f5783)", "<desc>", 'id="fig-m"', "url(#fig-m)", 'class="wisp-d"'):
        assert s in out


@pytest.mark.e2e
def test_postprocess_full(session):
    r = postprocess(session, RAW, style="hand", source="demo.excalidraw", id_prefix="demo", title="演示", desc="一条带标签的箭头")
    svg = r.svg
    assert r.unknown_colors == []
    for s in ('class="wisp-d"', "var(--wd-blue, #2f5783)", "var(--wd-blue-fill, #e9f2fb)", "var(--wd-fg, #1d1d1f)", "var(--wd-font-hand)"):
        assert s in svg
    assert re.search(r"@media \(prefers-color-scheme:dark\)", svg)
    assert re.search(r'<mask id="demo-mask-a">.*fill="#fff".*fill="#000"', svg)
    assert 'mask="url(#demo-mask-a)"' in svg
    outside = re.sub(r"<style\b[\s\S]*?</style>", "", re.sub(r"<mask\b[\s\S]*?</mask>", "", svg))
    assert not re.search(r'(fill|stroke)="#[0-9a-f]{3,6}"', outside, re.I)
    assert '<title id="demo-title">演示</title>' in svg
    assert svg.endswith("\n")


@pytest.mark.e2e
def test_postprocess_unknown_and_fix(session):
    bad = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="5" height="5" fill="#ff00ff"/></svg>'
    r1 = postprocess(session, bad, style="clean", source="b.drawio", id_prefix="b", title="b")
    assert r1.unknown_colors == ["#ff00ff"]
    r2 = postprocess(session, bad, style="clean", source="b.drawio", id_prefix="b", title="b", fix=True)
    assert r2.unknown_colors == []
    assert re.search(r'fill="var\(--wd-[a-z-]+, #[0-9a-f]{6}\)"', r2.svg)


def test_pad_label_masks():
    from wisp_diagram_lib.postprocess import pad_label_masks
    svg = '<svg><mask id="m"><path fill="#fff" d="M0 0h438v540H0z"/><path fill="#000" d="M182 432.5h60v15h-60z" opacity="1"/></mask><path fill="#000" d="M1 2h3v4h-3z"/></svg>'
    out = pad_label_masks(svg)
    assert 'd="M178 428.5h68v23h-68z"' in out
    assert 'd="M0 0h438v540H0z"' in out  # 白色底不动
    assert out.endswith('<path fill="#000" d="M1 2h3v4h-3z"/></svg>')  # 遮罩外的图形不动
