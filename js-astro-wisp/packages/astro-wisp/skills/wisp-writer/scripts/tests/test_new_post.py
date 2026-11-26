import check_post
import new_post
import pytest


def run(site, *args):
    return new_post.main([*args, "--root", str(site)])


def test_creates_mdx_with_diagrams_dir(site, capsys):
    assert run(site, "my-post", "--title", "标题", "--template", "deep-dive", "--tags", "LLM,Transformer", "--category", "机器学习", "--description", "摘要") == 0
    d = site / "src/content/posts/my-post"
    text = (d / "index.mdx").read_text()
    assert (d / "diagrams").is_dir()
    assert 'title: "标题"' in text and "tags: [LLM, Transformer]" in text and 'category: "机器学习"' in text
    assert "pubDate: 20" in text and "draft" not in text and "{{" not in text


def test_generated_post_passes_check_apart_from_todo(site):
    run(site, "p", "--template", "tutorial", "--title", "教程", "--description", "摘要")
    f = check_post.Checker(site / "src/content/posts/p/index.md", "p", site)
    f.path = site / "src/content/posts/p/index.mdx"
    got = f.run()
    assert {x.rule for x in got} == {"todo"}


@pytest.mark.parametrize("tpl", ["tutorial", "deep-dive", "algorithm", "note", "paper-reading"])
def test_all_templates_no_errors(site, tpl):
    assert run(site, "t", "--template", tpl, "--title", "T", "--description", "D", "--draft") == 0
    d = site / "src/content/posts/t"
    p = next(d.glob("index.md*"))
    got = check_post.Checker(p, str(p), site).run()
    assert [x for x in got if x.level == "error"] == []
    assert "draft: true" in p.read_text()


def test_slug_conflict(site, capsys):
    assert run(site, "dup") == 0
    assert run(site, "dup") == 1
    assert "已存在" in capsys.readouterr().err


def test_single_file_conflict(site):
    (site / "src/content/posts/solo.md").write_text("x")
    assert run(site, "solo") == 1


@pytest.mark.parametrize("slug", ["Bad_Slug", "中文", "x-", "a--b", "a b"])
def test_bad_slug(site, slug):
    assert run(site, slug) == 2


def test_md_vs_mdx(site):
    assert run(site, "a", "--template", "tutorial", "--md") == 0
    assert (site / "src/content/posts/a/index.md").exists()
    assert run(site, "b", "--template", "note", "--mdx") == 0
    assert (site / "src/content/posts/b/index.mdx").exists()
    assert run(site, "c", "--template", "algorithm", "--md") == 2
    assert not (site / "src/content/posts/c").exists()


def test_length_limits(site):
    assert run(site, "a", "--title", "长" * 81) == 2
    assert run(site, "b", "--description", "长" * 201) == 2


def test_unknown_template(site):
    assert run(site, "a", "--template", "nope") == 2


def test_tag_similarity_hint(site, capsys):
    run(site, "a", "--tags", "LLM")
    capsys.readouterr()
    run(site, "b", "--tags", "llm")
    assert "相近" in capsys.readouterr().out


def test_no_site_clear_message(tmp_path, monkeypatch, capsys):
    empty = tmp_path / "empty"
    empty.mkdir()
    monkeypatch.chdir(empty)
    monkeypatch.setattr(new_post._wisp, "find_root", lambda explicit=None, start=None: None)
    assert new_post.main(["x"]) == 2
    err = capsys.readouterr().err
    assert "找不到 Wisp 站点" in err
    assert list(empty.iterdir()) == []


def test_date_default_today(site):
    from datetime import date

    run(site, "a")
    assert f"pubDate: {date.today().isoformat()}" in (site / "src/content/posts/a/index.md").read_text()
