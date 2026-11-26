import json

import check_post
import pytest
from conftest import GOOD, rules


def fm(**over):
    base = {"title": '"标题"', "description": '"摘要"', "pubDate": "2026-01-01"}
    base.update(over)
    return "---\n" + "\n".join(f"{k}: {v}" for k, v in base.items() if v is not None) + "\n---\n\n"


def test_good_post_passes(site, write_post, check):
    p = write_post("good", GOOD)
    assert check(p, site) == []


def test_missing_frontmatter(site, write_post, check):
    p = write_post("x", "正文\n")
    assert "fm-missing" in rules(check(p, site))


def test_required_and_lengths(site, write_post, check):
    p = write_post("x", fm(title='"' + "长" * 81 + '"', description='"' + "长" * 201 + '"', pubDate=None) + "正文。\n")
    r = rules(check(p, site))
    assert {"fm-title-length", "fm-description-length", "fm-required"} <= r


def test_length_boundary_ok(site, write_post, check):
    p = write_post("x", fm(title='"' + "长" * 80 + '"', description='"' + "长" * 200 + '"') + "正文。\n")
    assert check(p, site) == []


@pytest.mark.parametrize("bad", ["2026/03/18", "2026-13-01", "18-03-2026"])
def test_bad_date(site, write_post, check, bad):
    p = write_post("x", fm(pubDate=bad) + "正文。\n")
    assert "fm-date" in rules(check(p, site))


def test_unknown_key_and_types(site, write_post, check):
    p = write_post("x", fm(tag="[a]", draft="yes", tags="LLM, X") + "正文。\n")
    r = rules(check(p, site))
    assert "fm-unknown-key" in r and "fm-type" in r


def test_tag_case_vs_existing(site, write_post, check):
    write_post("a", fm(tags="[LLM]") + "正文。\n")
    p = write_post("b", fm(tags="[llm, Rust]") + "正文。\n")
    f = [x for x in check(p, site) if x.rule == "tag-similar"]
    assert len(f) == 1 and "LLM" in f[0].message
    # 已有标签原样复用则不报
    p2 = write_post("c", fm(tags="[LLM]") + "正文。\n")
    assert "tag-similar" not in rules(check(p2, site))


def test_distinct_acronyms_not_flagged(site, write_post, check):
    write_post("a", fm(tags="[DSA, CSA, KV-Cache]") + "正文。\n")
    p = write_post("b", fm(tags="[NSA, kv_cache]") + "正文。\n")
    f = [x for x in check(p, site) if x.rule == "tag-similar"]
    assert len(f) == 1 and "KV-Cache" in f[0].message and "NSA" not in f[0].message


def test_category_similar(site, write_post, check):
    write_post("a", fm(category="机器学习") + "正文。\n")
    write_post("b0", fm(category="Algorithms") + "正文。\n")
    p = write_post("b", fm(category="algorithms") + "正文。\n")
    assert "category-similar" in rules(check(p, site))


def test_headings(site, write_post, check):
    p = write_post("x", fm() + "# 一级\n\n### 跳级\n")
    r = rules(check(p, site))
    assert "heading-h1" in r and "heading-skip" in r


def test_heading_in_code_ignored(site, write_post, check):
    p = write_post("x", fm() + "## 好\n\n```bash\n# 注释\n### x\n```\n")
    assert check(p, site) == []


def test_image_alt_and_missing(site, write_post, check):
    body = '![](./diagrams/a.excalidraw)\n\n![ok](./images/none.png)\n'
    p = write_post("x", fm() + body)
    r = rules(check(p, site))
    assert {"img-alt", "diagram-missing", "img-missing"} <= r


def test_diagram_svg_missing_and_present(site, write_post, check):
    body = '![流程](./diagrams/a.excalidraw "图 1：流程")\n'
    p = write_post("x", fm() + body, files=["diagrams/a.excalidraw"])
    f = check(p, site)
    assert rules(f) == {"diagram-svg-missing"}
    (p.parent / "diagrams" / "a.wisp.svg").write_text("<svg/>")
    assert check(p, site) == []


def test_drawio_page_fragment(site, write_post, check):
    p = write_post("x", fm() + "![架构](./diagrams/a.drawio#page=2)\n", files=["diagrams/a.drawio", "diagrams/a.wisp.svg"])
    assert check(p, site) == []


def test_code_lang(site, write_post, check):
    p = write_post("x", fm() + "```\nplain\n```\n\n```ts nofold\nlet a = 1;\n```\n")
    f = [x for x in check(p, site) if x.rule == "code-lang"]
    assert len(f) == 1 and f[0].line == 7


def test_unclosed_fence(site, write_post, check):
    p = write_post("x", fm() + "```ts\nlet a;\n")
    assert "fence-unclosed" in rules(check(p, site))


def test_mdx_import(site, write_post, check):
    p = write_post("x", fm() + "<MatMul client:visible a={[[1]]} b={[[1]]} />\n")
    assert "mdx-import" in rules(check(p, site))
    p = write_post("y", fm() + "import MatMul from './MatMul';\n\n<MatMul client:visible a={[[1]]} b={[[1]]} />\n")
    assert check(p, site) == []


def test_component_in_md(site, write_post, check):
    p = write_post("x", fm() + "<MatMul />\n", ext="md")
    assert "md-component" in rules(check(p, site))


def test_hardcoded_color(site, write_post, check):
    p = write_post("x", fm() + '颜色 #ff0000 不行。<span style="color:red">x</span>\n')
    r = rules(check(p, site))
    assert "hardcoded-color" in r and "inline-style" in r


def test_hex_false_positives(site, write_post, check):
    body = "见 [锚点](#fix) 和议题 #1234，以及 `#fff`。\n\n```css\ncolor: #fff;\n```\n"
    p = write_post("x", fm() + body)
    assert check(p, site) == []


def test_halfwidth_punct(site, write_post, check):
    p = write_post("x", fm() + "这是中文,用了半角逗号(括号)。\n")
    f = [x for x in check(p, site) if x.rule == "halfwidth-punct"]
    assert len(f) == 1


def test_halfwidth_exclusions(site, write_post, check):
    body = (
        "版本 v1.2 与 `a,b` 和 $f(x, y)$ 都没问题，[链接文字](https://a.com/x?a=1,2)。\n\n"
        "English only, with (parens): fine.\n\n"
        "文件名 index.mdx 中没有问题。\n"
    )
    p = write_post("x", fm() + body)
    assert "halfwidth-punct" not in rules(check(p, site))


def test_todo(site, write_post, check):
    p = write_post("x", fm() + "TODO：写\n")
    assert "todo" in rules(check(p, site))


def test_comments_masked(site, write_post, check):
    body = "{/* ![](./x.png) # 一级 */}\n\n<!-- ![](./y.png) -->\n"
    p = write_post("x", fm() + body)
    assert check(p, site) == []


# ---------------------------------------------------------------- CLI


def test_cli_exit_codes(site, write_post, capsys):
    write_post("good", GOOD)
    write_post("warn", fm() + "```\nx\n```\n")
    write_post("err", fm() + "# h1\n")
    r = ["--root", str(site)]
    assert check_post.main(["good", *r]) == 0
    assert check_post.main(["warn", *r]) == 0
    assert check_post.main(["warn", "--strict", *r]) == 1
    assert check_post.main(["err", *r]) == 1
    assert check_post.main(["nope", *r]) == 2
    assert check_post.main(["--all", *r]) == 1


def test_cli_output_format(site, write_post, capsys):
    p = write_post("err", fm() + "# h1\n")
    check_post.main([str(p), "--root", str(site)])
    out = capsys.readouterr().out
    assert f"{p}:7 error heading-h1 " in out


def test_cli_json(site, write_post, capsys):
    write_post("err", fm() + "# h1\n")
    check_post.main(["err", "--json", "--root", str(site)])
    data = json.loads(capsys.readouterr().out)
    assert data["summary"]["error"] == 1
    assert data["findings"][0]["rule"] == "heading-h1"
    assert set(data["findings"][0]) == {"file", "line", "level", "rule", "message"}


def test_cli_no_site(tmp_path, monkeypatch, capsys):
    monkeypatch.chdir(tmp_path)
    monkeypatch.setattr(check_post._wisp, "find_root", lambda explicit=None, start=None: None)
    assert check_post.main(["--all"]) == 2
    assert "Wisp" in capsys.readouterr().err


def test_footnotes_ok(site, write_post, check):
    body = "正文[^a]，再引一次[^a]，另一条[^b]。\n\n[^a]: 出处 A。\n\n[^b]: 出处 B，引用了 [^a] 也算使用。\n"
    p = write_post("x", fm() + body)
    assert not {"fn-undefined", "fn-unused", "fn-duplicate"} & rules(check(p, site))


def test_footnote_undefined_unused_duplicate(site, write_post, check):
    body = "正文[^missing]，以及[^a]。\n\n[^a]: 出处。\n\n[^a]: 重复。\n\n[^orphan]: 没人用。\n"
    p = write_post("x", fm() + body)
    f = check(p, site)
    r = rules(f)
    assert {"fn-undefined", "fn-unused", "fn-duplicate"} <= r
    assert [x.level for x in f if x.rule == "fn-unused"] == ["warning"]


def test_footnote_in_code_is_ignored(site, write_post, check):
    body = "正文 `arr[^1]` 不是引用。\n\n```py\nx[^1]\n```\n"
    p = write_post("x", fm() + body)
    assert "fn-undefined" not in rules(check(p, site))


def test_heading_code_warning(site, write_post, check):
    p = write_post("x", fm() + "## `CondHandle` 与 O(1) 查表\n\n### 复杂度 $O(1)$ 允许\n")
    f = [x for x in check(p, site) if x.rule == "heading-code"]
    assert len(f) == 1 and f[0].level == "warning" and f[0].line == 7


def test_quote_mixed_warning(site, write_post, check):
    p = write_post("x", fm() + "这里用“弯引号”，那里又写「直角引号」。\n")
    assert "quote-mixed" in rules(check(p, site))
    p_ok = write_post("y", fm() + "全文统一用“弯引号”和 `code「x」` 没问题。\n")
    assert "quote-mixed" not in rules(check(p_ok, site))


def test_ppt_bold_bullet_warning(site, write_post, check):
    long_desc = "这" * 80
    p = write_post("x", fm() + f"- **核心矛盾**：{long_desc}\n- **短条目**：只写一句话。\n")
    f = [x for x in check(p, site) if x.rule == "ppt-bold-bullet"]
    assert len(f) == 1 and f[0].level == "warning"


def test_backtick_number_warning(site, write_post, check):
    body = "错误码 `207008` 与值 `0` 不应套反引号，但 `0x10`、`-1` 与 `v1.2` 放行。\n\n```py\nx = `1024`\n```\n"
    p = write_post("x", fm() + body)
    f = [x for x in check(p, site) if x.rule == "backtick-number"]
    assert len(f) == 2 and all(x.level == "warning" for x in f)
