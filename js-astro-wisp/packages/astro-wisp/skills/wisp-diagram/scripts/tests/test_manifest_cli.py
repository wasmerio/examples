"""manifest 读写与 CLI。Python 是 manifest 的唯一写入方；astro-wisp 的 render-diagram.ts 只读校验。"""
import json
from pathlib import Path

import pytest

from conftest import FIX
from wisp_diagram_lib.cli import main
from wisp_diagram_lib.env import GENERATOR
from wisp_diagram_lib.manifest import (
    check_all, content_hash, empty_manifest, entry_status, load_manifest, scan_sources, serialize_manifest,
)

SRC = "src/content/posts/demo/diagrams/flow.excalidraw"
OUT = "src/content/posts/demo/diagrams/flow.wisp.svg"


def write(base, rel, body):
    p = base / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(body)


@pytest.fixture
def root(tmp_path):
    def write(rel, body):
        globals()["write"](tmp_path, rel, body)

    write(SRC, '{"a":1}')
    write(OUT, "<svg/>")
    write("src/content/posts/demo/images/not-a-diagram.excalidraw", "{}")
    write("src/content/shared/diagrams/arch.drawio", "<mxfile/>")
    return tmp_path


def built():
    m = empty_manifest()
    m["entries"][SRC] = {"source": content_hash('{"a":1}'), "style": "hand", "exporter": "excalidraw-playwright",
                         "embedFonts": False, "outputs": {OUT: content_hash("<svg/>")}}
    return m


def test_scan_sources(root):
    assert scan_sources(str(root)) == [SRC, "src/content/shared/diagrams/arch.drawio"]


def test_content_hash():
    assert content_hash("a\r\nb") == content_hash("a\nb")
    # 与 node:crypto 的 sha256 一致（render-diagram.ts 用同一算法）
    assert content_hash("abc") == "sha256-ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
    assert content_hash("中文\n".encode()) == content_hash("中文\r\n")


class TestEntryStatus:
    def test_ok_unbuilt(self, root):
        assert entry_status(SRC, built(), str(root)).kind == "ok"
        assert entry_status(SRC, empty_manifest(), str(root)).kind == "unbuilt"

    def test_source_changed(self, root):
        write(root, SRC, '{"a":2}')
        assert entry_status(SRC, built(), str(root)).kind == "source-changed"

    def test_output_missing_modified(self, root):
        (root / OUT).unlink()
        s = entry_status(SRC, built(), str(root))
        assert (s.kind, s.output) == ("output-missing", OUT)
        write(root, OUT, "<svg>edited</svg>")
        s = entry_status(SRC, built(), str(root))
        assert (s.kind, s.output) == ("output-modified", OUT)

    def test_generator_changed(self, root):
        m = built()
        m["generator"] = "wisp-diagram@0"
        assert entry_status(SRC, m, str(root)).kind == "generator-changed"


def test_check_all(root):
    m = built()
    m["entries"]["src/content/posts/gone/diagrams/x.drawio"] = {**m["entries"][SRC], "style": "clean"}
    mp = root / "diagrams.manifest.json"
    mp.write_text(serialize_manifest(m))
    problems = check_all(str(root), str(mp))
    assert [p[0] for p in problems] == ["src/content/shared/diagrams/arch.drawio", "src/content/posts/gone/diagrams/x.drawio"]
    assert "尚未构建" in problems[0][1]
    assert "不存在" in problems[1][1]


def test_serialize_manifest():
    m = built()
    m["entries"]["a/diagrams/b.drawio"] = {"source": "x", "style": "clean", "exporter": "drawio-browser", "embedFonts": False,
                                         "outputs": {"z.svg": "1", "a.svg": "2"}, "pages": ["p1", "p2"]}
    s = serialize_manifest(m)
    assert s.endswith("\n")
    parsed = json.loads(s)
    assert list(parsed["entries"]) == ["a/diagrams/b.drawio", SRC]
    assert list(parsed["entries"]["a/diagrams/b.drawio"]["outputs"]) == ["a.svg", "z.svg"]
    assert parsed["generator"] == GENERATOR
    assert serialize_manifest(parsed) == s


def test_serialize_is_byte_compatible_with_ts():
    """manifest-sample.json 是格式基线（原 TS 实现写出）：读回再写必须逐字节一致，保证已提交的 manifest 不因升级产生无关 diff。"""
    raw = (FIX / "manifest-sample.json").read_text("utf-8")
    assert serialize_manifest(load_manifest(str(FIX / "manifest-sample.json"))) == raw


def test_cli_exit_codes(capsys):
    assert main(["--help"]) == 0
    assert main([]) == 2
    assert main(["nope"]) == 2
    assert "未知命令" in capsys.readouterr().err
    assert main(["export", "--theme", "sepia", "a.svg"]) == 2


def test_check_cli(root, capsys):
    mp = root / "m.json"
    mp.write_text(serialize_manifest(built()))
    assert main(["check", "--root", str(root), "--manifest", str(mp)]) == 1
    err = capsys.readouterr().err
    assert "arch.drawio" in err and "尚未构建" in err
    (root / "src/content/shared/diagrams/arch.drawio").unlink()
    assert main(["check", "--root", str(root), "--manifest", str(mp)]) == 0
    assert "全部与 manifest 一致" in capsys.readouterr().out


def test_lint_root_scan(root, capsys):
    (root / "src/content/shared/diagrams/arch.drawio").unlink()
    assert main(["lint", "--root", str(root)]) == 0
    assert "1 file(s)" in capsys.readouterr().out
    assert Path(root / SRC).exists()
