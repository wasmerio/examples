"""Shared test helpers: load the helper scripts (their filenames contain
dashes, so plain `import` can't reach them) and run them as subprocesses.
Run the suite with:  python3 -m unittest discover scripts/tests
No dependencies beyond the standard library, same as the scripts themselves."""
import importlib.util
import pathlib
import subprocess
import sys

SCRIPTS = pathlib.Path(__file__).resolve().parent.parent


def load_script(filename):
    path = SCRIPTS / filename
    spec = importlib.util.spec_from_file_location(filename.replace("-", "_").removesuffix(".py"), path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def run_script(filename, *args):
    return subprocess.run(
        [sys.executable, str(SCRIPTS / filename), *args],
        capture_output=True, text=True,
    )


FIXTURES = pathlib.Path(__file__).resolve().parent / "fixtures"
