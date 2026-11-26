"""Tests for scripts/spreadsheet-import.py (offline; exercises the stdlib
xlsx writer/reader round-trip and both output formats)."""
import csv
import pathlib
import tempfile
import unittest

from helpers import load_script, run_script

mod = load_script("spreadsheet-import.py")


class Units(unittest.TestCase):
    def test_xlsx_round_trip(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = pathlib.Path(tmp) / "wb.xlsx"
            mod.write_xlsx(path, mod.SAMPLE)
            sheets = mod.read_xlsx(path)
            self.assertEqual(set(sheets), {t.lower() for t in mod.SAMPLE})
            speakers = mod.to_records(sheets["speakers"])
            self.assertEqual(speakers[0]["name"], "Jordan Rivera")
            events = mod.to_records(sheets["events"])
            self.assertEqual(events[0]["venue"], "Community Hall")

    def test_xlsx_escapes_special_characters(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = pathlib.Path(tmp) / "wb.xlsx"
            mod.write_xlsx(path, {"Speakers": [["Name"], ["Snacks & <Drinks> Co."]]})
            rows = mod.read_xlsx(path)["speakers"]
            self.assertEqual(rows[1][0], "Snacks & <Drinks> Co.")

    def test_excel_serial_dates_convert(self):
        # 2026-09-19 18:00 is serial 46284.75
        self.assertEqual(mod.excel_serial_to_iso("46284.75"), "2026-09-19T18:00:00")
        self.assertEqual(mod.excel_serial_to_iso("2026-09-19T18:00:00"), "2026-09-19T18:00:00")

    def test_to_records_skips_blank_rows(self):
        rows = [["Name", "Role"], ["", ""], ["Sam", "Lead"]]
        self.assertEqual(mod.to_records(rows), [{"name": "Sam", "role": "Lead"}])

    def test_fm_hugo_and_astro(self):
        pairs = [("title", "Hi"), ("date", "2026-01-01T10:00:00"), ("empty", "")]
        hugo = mod.fm("hugo", pairs, arrays=[("tags", ["a", "b"])])
        self.assertIn('title = "Hi"', hugo)
        self.assertIn("date = 2026-01-01T10:00:00", hugo)  # dates unquoted
        self.assertNotIn("empty", hugo)
        astro = mod.fm("astro", pairs, socials=[("GitHub", "fa-brands fa-github", "https://example.com")])
        self.assertIn('title: "Hi"', astro)
        self.assertIn("social:", astro)


class EndToEnd(unittest.TestCase):
    def make_site(self, tmp):
        (pathlib.Path(tmp) / "hugo.toml").write_text('title = "T"\n')

    def sample_xlsx(self, tmp):
        path = pathlib.Path(tmp) / "community.xlsx"
        r = run_script("spreadsheet-import.py", "--make-sample", str(path))
        assert r.returncode == 0, r.stderr
        return str(path)

    def test_sample_workbook_imports_and_cross_references(self):
        with tempfile.TemporaryDirectory() as tmp:
            self.make_site(tmp)
            r = run_script("spreadsheet-import.py", "--xlsx", self.sample_xlsx(tmp), "--site", tmp)
            self.assertEqual(r.returncode, 0, r.stderr)
            content = pathlib.Path(tmp) / "content"
            event = (content / "events" / "community-kickoff.md").read_text()
            self.assertIn('venueRef = "community-hall"', event)  # matched the Venues tab
            self.assertIn('speakers = ["jordan-rivera", "sasha-chen"]', event)
            self.assertIn('tags = ["meetup", "social"]', event)
            self.assertTrue((content / "venues" / "community-hall.md").exists())
            self.assertTrue((content / "sponsors" / "_index.md").exists())  # typed section created
            self.assertTrue((content / "organizers" / "sam-example.md").exists())

    def test_unknown_names_fall_back_to_flat_fields(self):
        with tempfile.TemporaryDirectory() as tmp:
            self.make_site(tmp)
            csv_dir = pathlib.Path(tmp) / "csv"
            csv_dir.mkdir()
            with open(csv_dir / "events.csv", "w", newline="") as f:
                w = csv.writer(f)
                w.writerow(["Title", "Date", "Venue", "Speakers"])
                w.writerow(["Mystery Night", "2026-03-01T19:00:00", "Somewhere New", "A Stranger"])
            r = run_script("spreadsheet-import.py", "--csv-dir", str(csv_dir), "--site", tmp)
            self.assertEqual(r.returncode, 0, r.stderr)
            event = (pathlib.Path(tmp) / "content" / "events" / "mystery-night.md").read_text()
            self.assertIn('venue = "Somewhere New"', event)   # no venueRef: unknown venue
            self.assertNotIn("venueRef", event)
            self.assertIn('speaker = "A Stranger"', event)    # string fallback
            self.assertNotIn("speakers =", event)

    def test_astro_skips_sponsors_tab(self):
        with tempfile.TemporaryDirectory() as tmp:
            r = run_script("spreadsheet-import.py", "--xlsx", self.sample_xlsx(tmp),
                           "--site", tmp, "--format", "astro")
            self.assertEqual(r.returncode, 0, r.stderr)
            self.assertIn("skipping Sponsors tab", r.stdout)
            self.assertFalse((pathlib.Path(tmp) / "src" / "content" / "sponsors").exists())

    def test_existing_files_are_never_overwritten(self):
        with tempfile.TemporaryDirectory() as tmp:
            self.make_site(tmp)
            xlsx = self.sample_xlsx(tmp)
            run_script("spreadsheet-import.py", "--xlsx", xlsx, "--site", tmp)
            target = pathlib.Path(tmp) / "content" / "events" / "community-kickoff.md"
            target.write_text("hand edited\n")
            r = run_script("spreadsheet-import.py", "--xlsx", xlsx, "--site", tmp)
            self.assertIn("skip (exists)", r.stdout)
            self.assertEqual(target.read_text(), "hand edited\n")


if __name__ == "__main__":
    unittest.main()
