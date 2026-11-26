"""Tests for scripts/sessionize-import.py (offline, via the bundled fixture)."""
import pathlib
import tempfile
import unittest

from helpers import FIXTURES, load_script, run_script

mod = load_script("sessionize-import.py")
FIXTURE = str(FIXTURES / "sessionize-all.json")


class Units(unittest.TestCase):
    def test_slugify(self):
        self.assertEqual(mod.slugify("Jordan Rivera"), "jordan-rivera")
        self.assertEqual(mod.slugify("Águeda Núñez-Smith!"), "agueda-nunez-smith")
        self.assertEqual(mod.slugify("???"), "untitled")

    def test_slugify_preserves_non_latin_scripts(self):
        # a KDrama fan club will import 한글 names on week one
        self.assertEqual(mod.slugify("김민지"), "김민지")
        self.assertEqual(mod.slugify("박 서준"), "박-서준")
        self.assertEqual(mod.slugify("Мария Иванова"), "мария-иванова")

    def test_slugify_falls_back_to_id_not_untitled(self):
        self.assertEqual(mod.slugify("???", fallback="sp42"), "sp42")

    def test_unique_slug_suffixes_collisions(self):
        seen = set()
        self.assertEqual(mod.unique_slug("Kim Minji", seen), "kim-minji")
        self.assertEqual(mod.unique_slug("Kim Minji", seen), "kim-minji-2")
        self.assertEqual(mod.unique_slug("Kim Minji", seen), "kim-minji-3")

    def test_sessionize_url_from_id(self):
        self.assertEqual(mod.sessionize_url("abc123"),
                         "https://sessionize.com/api/v2/abc123/view/All")

    def test_stored_source_reads_popular_import_toml(self):
        with tempfile.TemporaryDirectory() as tmp:
            site = pathlib.Path(tmp)
            self.assertIsNone(mod.stored_source(site))
            (site / "popular-import.toml").write_text('[sessionize]\nid = "xyz9"\n')
            self.assertEqual(mod.stored_source(site),
                             "https://sessionize.com/api/v2/xyz9/view/All")
            (site / "popular-import.toml").write_text(
                '[sessionize]\nurl = "https://sessionize.com/api/v2/full/view/All"\n')
            self.assertEqual(mod.stored_source(site),
                             "https://sessionize.com/api/v2/full/view/All")

    def test_no_source_exits_with_guidance(self):
        with tempfile.TemporaryDirectory() as tmp:
            (pathlib.Path(tmp) / "hugo.toml").write_text('title = "T"\n')
            r = run_script("sessionize-import.py", "--site", tmp)
            self.assertNotEqual(r.returncode, 0)
            self.assertIn("popular-import.toml", r.stderr)

    def test_time_range_same_meridiem(self):
        self.assertEqual(mod.time_range("2026-09-19T14:00:00", "2026-09-19T15:00:00"), "2:00 – 3:00 PM")

    def test_time_range_cross_meridiem(self):
        self.assertEqual(mod.time_range("2026-09-19T11:30:00", "2026-09-19T13:15:00"), "11:30 AM – 1:15 PM")

    def test_time_range_open_ended(self):
        self.assertEqual(mod.time_range("2026-09-19T18:00:00", None), "6:00 PM")
        self.assertEqual(mod.time_range(None, None), "")

    def test_first_para_truncates_on_word_boundary(self):
        text = "word " * 100
        out = mod.first_para(text, limit=50)
        self.assertLessEqual(len(out), 50)
        self.assertTrue(out.endswith("…"))

    def test_speaker_page_hugo_maps_socials_and_website(self):
        speaker = {
            "fullName": "Jordan Rivera",
            "tagLine": "Wrangler",
            "bio": "Line one.\n\nLine two.",
            "profilePicture": "https://example.com/p.jpg",
            "links": [
                {"title": "Mastodon", "url": "https://example.com/@j", "linkType": "Mastodon"},
                {"title": "Blog", "url": "https://example.com/j", "linkType": "Blog"},
            ],
        }
        page = mod.speaker_page(speaker, "hugo")
        self.assertIn('title = "Jordan Rivera"', page)
        self.assertIn("fa-brands fa-mastodon", page)
        self.assertIn('website = "https://example.com/j"', page)
        self.assertIn('bio = "Line one."', page)  # card bio = first paragraph
        self.assertIn("Line two.", page)  # full bio in the body

    def test_event_page_astro_fields(self):
        sess = {"title": "Talk", "description": "Desc.", "startsAt": "2026-01-02T18:00:00",
                "endsAt": "2026-01-02T19:00:00", "speakers": ["a"], "roomId": 1}
        page = mod.event_page(sess, {1: "Main Hall"}, {"a": "jordan"}, "astro", "https://example.com/r")
        self.assertIn('venue: "Main Hall"', page)
        self.assertIn('speakers: ["jordan"]', page)
        self.assertIn('rsvp: "https://example.com/r"', page)
        self.assertTrue(page.startswith("---\n"))


class EndToEnd(unittest.TestCase):
    def import_into(self, tmp, *extra):
        (pathlib.Path(tmp) / "hugo.toml").write_text('title = "T"\n')
        return run_script("sessionize-import.py", "--file", FIXTURE, "--site", tmp, *extra)

    def test_import_writes_events_and_speakers(self):
        with tempfile.TemporaryDirectory() as tmp:
            r = self.import_into(tmp)
            self.assertEqual(r.returncode, 0, r.stderr)
            content = pathlib.Path(tmp) / "content"
            self.assertTrue((content / "speakers" / "jordan-rivera.md").exists())
            self.assertTrue((content / "events" / "two-decades-of-community-building.md").exists())
            event = (content / "events" / "two-decades-of-community-building.md").read_text()
            self.assertIn('speakers = ["jordan-rivera", "sasha-chen"]', event)
            self.assertIn('venue = "Main Hall"', event)

    def test_service_sessions_are_skipped(self):
        with tempfile.TemporaryDirectory() as tmp:
            self.import_into(tmp)
            self.assertFalse((pathlib.Path(tmp) / "content" / "events" / "lunch.md").exists())

    def test_existing_files_are_never_overwritten(self):
        with tempfile.TemporaryDirectory() as tmp:
            self.import_into(tmp)
            target = pathlib.Path(tmp) / "content" / "speakers" / "jordan-rivera.md"
            target.write_text("hand edited\n")
            r = self.import_into(tmp)
            self.assertIn("skip (exists)", r.stdout)
            self.assertEqual(target.read_text(), "hand edited\n")

    def test_force_overwrites(self):
        with tempfile.TemporaryDirectory() as tmp:
            self.import_into(tmp)
            target = pathlib.Path(tmp) / "content" / "speakers" / "jordan-rivera.md"
            target.write_text("hand edited\n")
            self.import_into(tmp, "--force")
            self.assertNotEqual(target.read_text(), "hand edited\n")

    def test_dry_run_writes_nothing(self):
        with tempfile.TemporaryDirectory() as tmp:
            r = self.import_into(tmp, "--dry-run")
            self.assertIn("would write", r.stdout)
            self.assertFalse((pathlib.Path(tmp) / "content").exists())

    def test_astro_format_flag(self):
        with tempfile.TemporaryDirectory() as tmp:
            r = run_script("sessionize-import.py", "--file", FIXTURE, "--site", tmp, "--format", "astro")
            self.assertEqual(r.returncode, 0, r.stderr)
            speaker = (pathlib.Path(tmp) / "src" / "content" / "speakers" / "sasha-chen.md").read_text()
            self.assertTrue(speaker.startswith("---\n"))
            self.assertIn('title: "Sasha Chen"', speaker)


if __name__ == "__main__":
    unittest.main()
