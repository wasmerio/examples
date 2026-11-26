import os
import sys
from pathlib import Path

import pytest

SCRIPTS = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(SCRIPTS))

FIX = Path(__file__).resolve().parent / "fixtures"
SNAP = Path(__file__).resolve().parent / "snapshots"


def fx(name: str) -> str:
    return (FIX / name).read_text("utf-8")


def snap(name: str) -> str:
    return (SNAP / name).read_text("utf-8")


E2E = bool(os.environ.get("WISP_DIAGRAM_E2E"))


def pytest_configure(config):
    config.addinivalue_line("markers", "e2e: 需要 Chromium 与网络 / 缓存（WISP_DIAGRAM_E2E=1 时运行）")


def pytest_collection_modifyitems(config, items):
    if E2E:
        return
    skip = pytest.mark.skip(reason="端到端测试：设置 WISP_DIAGRAM_E2E=1 运行（需要 Chromium，首次需联网）")
    for item in items:
        if "e2e" in item.keywords:
            item.add_marker(skip)


@pytest.fixture(scope="session")
def session():
    from wisp_diagram_lib.browser import BrowserSession

    s = BrowserSession()
    yield s
    s.close()
