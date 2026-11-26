"""Tests for scripts/update-sponsors.py (offline: rendering and the
marker-based regeneration; the GraphQL fetch itself is not exercised).
Skipped in the astro repo, where the script doesn't ship."""
import pathlib
import tempfile
import unittest

from helpers import SCRIPTS, load_script

HAS_SCRIPT = (SCRIPTS / "update-sponsors.py").exists()
mod = load_script("update-sponsors.py") if HAS_SCRIPT else None

SPONSOR = {"login": "OctoCat", "name": "Octo Cat",
           "avatarUrl": "https://example.com/a.png", "url": "https://github.com/octocat"}


@unittest.skipUnless(HAS_SCRIPT, "update-sponsors.py ships in the Hugo repo only")
class UpdateSponsors(unittest.TestCase):
    def test_toml_str_escapes(self):
        self.assertEqual(mod.toml_str('say "hi" \\ bye'), '"say \\"hi\\" \\\\ bye"')

    def test_render_sponsor_has_marker_and_fields(self):
        page = mod.render_sponsor(SPONSOR, 10)
        self.assertIn(mod.MARKER, page)
        self.assertIn('title = "Octo Cat"', page)
        self.assertIn("weight = 10", page)
        self.assertIn('url = "https://github.com/octocat"', page)

    def test_name_falls_back_to_login(self):
        page = mod.render_sponsor({**SPONSOR, "name": None}, 10)
        self.assertIn('title = "OctoCat"', page)

    def test_write_pages_regenerates_only_marked_files(self):
        with tempfile.TemporaryDirectory() as tmp:
            out = pathlib.Path(tmp)
            (out / "_index.md").write_text("hand-written index\n")
            (out / "hand-made.md").write_text("no marker here\n")
            (out / "stale.md").write_text(f"+++\n{mod.MARKER}\nold\n+++\n")
            written, removed = mod.write_pages([SPONSOR], out)
            self.assertEqual((written, removed), (1, 1))
            self.assertTrue((out / "octocat.md").exists())
            self.assertFalse((out / "stale.md").exists())
            self.assertEqual((out / "_index.md").read_text(), "hand-written index\n")
            self.assertEqual((out / "hand-made.md").read_text(), "no marker here\n")


if __name__ == "__main__":
    unittest.main()
